import axios from 'axios';
import { getKeycloak } from '../keycloak';

const api = axios.create({
  // use relative path so CRA dev proxy forwards requests to backend and avoids CORS
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' }
});

api.interceptors.request.use(async (config) => {
  try {
    const kc = getKeycloak();
    if (kc) {
      // ensure token is fresh
      await kc.updateToken(30).catch(() => {});
      const token = kc.token;
      console.debug('[API] attaching token (first 8 chars):', token ? token.substring(0,8) + '...' : null);
      if (token) {
        config.headers = config.headers ?? {};
        (config.headers as any)['Authorization'] = `Bearer ${token}`;
      }
    }
  } catch (e) {
    // Keycloak not initialized yet or other error — proceed without token
  }
  return config;
});

export default api;
