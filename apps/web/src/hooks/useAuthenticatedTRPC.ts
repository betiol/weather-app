import { useAuth } from '../contexts/AuthContext';

export const useAuthenticatedTRPC = () => {
  const { user } = useAuth();

  return {
    isAuthenticated: !!user,
  };
}; 