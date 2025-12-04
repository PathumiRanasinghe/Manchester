import axios from 'axios';
import { getKeycloak } from '../keycloak';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' }
});

api.interceptors.request.use(async (config) => {
  try {
    const kc = getKeycloak();
    if (kc) {
      await kc.updateToken(30).catch(() => {});
      const token = kc.token;
      console.debug('[API] attaching token (first 8 chars):', token ? token.substring(0,8) + '...' : null);
      if (token) {
        config.headers = config.headers ?? {};
        (config.headers as any)['Authorization'] = `Bearer ${token}`;
      }
    }
  } catch (e) {
    console.error('[API] failed to attach token to request:', e);
  }
  return config;
});

export default api;
