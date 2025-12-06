
import { useEffect } from 'react';
import KeycloakService from '../keycloak';

export default function LogoutPage() {
  useEffect(() => {
    localStorage.clear();
    sessionStorage.clear();
    KeycloakService.getKeycloak().logout({ redirectUri: window.location.origin });
  }, []);
  return null;
}