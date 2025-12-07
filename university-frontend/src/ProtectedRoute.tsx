import { Navigate } from 'react-router-dom';
import KeycloakService from './keycloak';
import { JSX } from 'react';
import { hasRole } from './authHelpers';

interface ProtectedRouteProps {
  children: JSX.Element;
  role?: string;
}

const ProtectedRoute = ({ children, role }: ProtectedRouteProps) => {
  let isAuthenticated = false;
  let hasRequiredRole = true;
  try {
    const keycloak = KeycloakService.getKeycloak();
    isAuthenticated = keycloak.authenticated;
    if (role) {
      hasRequiredRole = hasRole(role);
    }
  } catch (e) {
    isAuthenticated = false;
    hasRequiredRole = false;
  }
  return isAuthenticated && hasRequiredRole ? children : <Navigate to="/forbidden" replace />;
};

export default ProtectedRoute;
