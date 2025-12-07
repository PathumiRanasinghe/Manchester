import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getKeycloak } from '../keycloak';

export default function AuthRedirect() {
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const kc = (window as any).__KEYCLOAK ?? (await (async () => { try { return getKeycloak(); } catch { return null; } })());
        if (!mounted || !kc) return;
        if (kc.authenticated) {
      
          const currentPath: string = (window && window.location && window.location.pathname) ? String(window.location.pathname) : '/';
   
          const shouldRedirect =  currentPath === '/' || currentPath === '/login' || currentPath === '' || currentPath === '/dashboard';
          if (!shouldRedirect) return;

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
              if (typeof kc.hasRealmRole === 'function' && kc.hasRealmRole(role)) return true;
              if (typeof kc.hasResourceRole === 'function') {
                try {
                  if (kc.hasResourceRole(role)) return true;
                } catch (e) {
                }
              }
              if (tokenParsed && tokenParsed.realm_access && tokenParsed.realm_access.roles[0]) {
                const r = flatten(tokenParsed.realm_access.roles);
                if (r.includes(role)) return true;
                if (r[0] === role) return true;
              }
              if (tokenParsed && tokenParsed.resource_access) {
                for (const clientKey of Object.keys(tokenParsed.resource_access)) {
                  const clientRoles = tokenParsed.resource_access[clientKey] && tokenParsed.resource_access[clientKey].roles;
                  const cr = flatten(clientRoles);
                  if (cr.includes(role)) return true;
                  if (cr[0] === role) return true;
                }
              }
            } catch (e) {
            }
            return false;
          };

          const isAdmin = hasRole('admin');
          const isLecturer = hasRole('lecturer');
          const target = isAdmin ? '/admin/dashboard' : isLecturer ? '/lecturer/dashboard' : '/dashboard';

    

          if (String(currentPath) !== String(target)) {
            console.info('[AuthRedirect] navigating to', target);
            navigate(target, { replace: true });
          }
        }
      } catch (e) {
      }
    })();

    return () => { mounted = false; };
  }, [navigate]);

  return null;
}
