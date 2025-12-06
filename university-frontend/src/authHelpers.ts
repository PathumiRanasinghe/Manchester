import KeycloakService from './keycloak';

export function hasRole(role: string): boolean {
  try {
    const keycloak = KeycloakService.getKeycloak();
    const roles = keycloak.tokenParsed?.realm_access?.roles || [];
    return roles.includes(role);
  } catch {
    return false;
  }
}

export function hasAnyRole(rolesToCheck: string[]): boolean {
  try {
    const keycloak = KeycloakService.getKeycloak();
    const roles = keycloak.tokenParsed?.realm_access?.roles || [];
    return rolesToCheck.some(role => roles.includes(role));
  } catch {
    return false;
  }
}
