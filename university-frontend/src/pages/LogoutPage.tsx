import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LogoutPage() {
  const navigate = useNavigate();
  useEffect(() => {
    localStorage.clear();
    sessionStorage.clear();
    navigate('/', { replace: true });
  }, [navigate]);
  return null;
}