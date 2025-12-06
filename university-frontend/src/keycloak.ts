let kcInstance: any = null;

export async function initKeycloak(options: any = { onLoad: 'check-sso', pkceMethod: 'S256' }) {
  if (!kcInstance) {
    const KeycloakModule = await import('keycloak-js');
    const KeycloakCtor = (KeycloakModule as any).default ?? KeycloakModule;
    kcInstance = new KeycloakCtor({
      url: 'http://localhost:8080',
      realm: 'university',
      clientId: 'university-frontend'
    });
    try {
      const initResult = await kcInstance.init(options);
      console.info('[Keycloak] init result:', initResult, 'authenticated:', kcInstance.authenticated);
    } catch (err) {
      console.error('[Keycloak] init failed:', err);
      throw err;
    }
    
    setInterval(() => {
      if (!kcInstance) return;
      kcInstance.updateToken(30).catch(() => kcInstance.clearToken());
    }, 20000);
  }
  return kcInstance;
}

export function getKeycloak() {
  if (!kcInstance) throw new Error('Keycloak not initialized. Call initKeycloak first.');
  return kcInstance;
}

const KeycloakService = { initKeycloak, getKeycloak };
export default KeycloakService;