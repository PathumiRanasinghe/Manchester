import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getKeycloak } from '../keycloak';

export default function AuthRedirect() {
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        // Prefer the initialized instance
        const kc = (window as any).__KEYCLOAK ?? (await (async () => { try { return getKeycloak(); } catch { return null; } })());
        if (!mounted || !kc) return;
        if (kc.authenticated) {
          // Only auto-redirect when the user landed on the root/login path.
          // Don't override explicit navigation to other routes.
          const currentPath: string = (window && window.location && window.location.pathname) ? String(window.location.pathname) : '/';
          // Allow redirect when landing on root/login OR when currently on the generic student dashboard
          // so users with elevated roles (lecturer/admin) are sent to their correct dashboard.
          const shouldRedirect = currentPath === '/' || currentPath === '/login' || currentPath === '' || currentPath === '/dashboard';
          if (!shouldRedirect) return;

          // Robust role detection: check realm roles, resource (client) roles, and token claims
          const tokenParsed = (kc && kc.tokenParsed) || {};

          const flatten = (arr: any[]): string[] => {
            const out: string[] = [];
            if (!Array.isArray(arr)) return out;
            for (const v of arr) {
              if (Array.isArray(v)) out.push(...flatten(v));
              else if (v != null) out.push(String(v));
            }
            return out;
          };

          const hasRole = (role: string) => {
            try {
              // 1) realm role via Keycloak helper
              if (typeof kc.hasRealmRole === 'function' && kc.hasRealmRole(role)) return true;
              // 2) resource/client role via Keycloak helper (if available)
              if (typeof kc.hasResourceRole === 'function') {
                try {
                  if (kc.hasResourceRole(role)) return true;
                } catch (e) {
                  // ignore
                }
              }
              // 3) realm_access roles in token (handle roles possibly nested)
              if (tokenParsed && tokenParsed.realm_access && tokenParsed.realm_access.roles[0]) {
                const r = flatten(tokenParsed.realm_access.roles);
                if (r.includes(role)) return true;
                // check 0th element if user said role lives at index 0
                if (r[0] === role) return true;
              }
              // 4) resource_access roles in token (check all clients and nested arrays)
              if (tokenParsed && tokenParsed.resource_access) {
                for (const clientKey of Object.keys(tokenParsed.resource_access)) {
                  const clientRoles = tokenParsed.resource_access[clientKey] && tokenParsed.resource_access[clientKey].roles;
                  const cr = flatten(clientRoles);
                  if (cr.includes(role)) return true;
                  if (cr[0] === role) return true;
                }
              }
            } catch (e) {
              // ignore
            }
            return false;
          };

          const isAdmin = hasRole('admin');
          const isLecturer = hasRole('lecturer');
          const target = isAdmin ? '/admin/dashboard' : isLecturer ? '/lecturer/dashboard' : '/dashboard';

          // DEV DEBUG: log token and role detection results
          try {
            console.debug('[AuthRedirect] tokenParsed keys:', Object.keys(tokenParsed || {}));
            console.debug('[AuthRedirect] realm_access:', tokenParsed?.realm_access);
            console.debug('[AuthRedirect] resource_access keys:', tokenParsed?.resource_access ? Object.keys(tokenParsed.resource_access) : undefined);
            console.debug('[AuthRedirect] detected isAdmin:', isAdmin, 'isLecturer:', isLecturer, 'target:', target, 'currentPath:', currentPath);
          } catch (e) {
            // ignore logging errors
          }

          if (String(currentPath) !== String(target)) {
            console.info('[AuthRedirect] navigating to', target);
            navigate(target, { replace: true });
          }
        }
      } catch (e) {
        // swallow — nothing to do if auth not ready
      }
    })();

    return () => { mounted = false; };
  }, [navigate]);

  return null;
}
