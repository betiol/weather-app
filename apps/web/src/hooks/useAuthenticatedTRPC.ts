import { useAuth } from '../contexts/AuthContext';
import { useEffect, useState } from 'react';

export const useAuthenticatedTRPC = () => {
  const { getIdToken, user } = useAuth();
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const fetchToken = async () => {
      try {
        if (user) {
          const idToken = await getIdToken();
          setToken(idToken);
        } else {
          setToken(null);
        }
      } catch (error) {
        console.error('Failed to get user token:', error);
        setToken(null);
      }
    };
    fetchToken();
  }, [getIdToken, user]);

  const withAuth = <T extends Record<string, any>>(input: T = {} as T) => {
    if (!token) {
      return { ...input, token: '' };
    }
    return { ...input, token };
  };

  const getAuthInput = <T extends Record<string, any>>(input: T = {} as T) => {
    if (!token) throw new Error('Unauthorized');
    return { ...input, token };
  };

  return {
    token,
    isAuthenticated: !!token && !!user,
    withAuth,
    getAuthInput,
  };
}; 