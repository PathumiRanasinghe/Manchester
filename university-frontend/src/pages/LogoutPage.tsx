
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import KeycloakService from '../keycloak';

export default function LogoutPage() {
  useEffect(() => {
    localStorage.clear();
    sessionStorage.clear();
    KeycloakService.getKeycloak().logout({ redirectUri: window.location.origin });
  }, []);
  return null;
}