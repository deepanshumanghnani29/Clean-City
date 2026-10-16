import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import api from '../services/api';

interface User {
  _id: string;
  name: string;
  email: string;
  role: 'citizen' | 'staff' | 'admin';
  contributionPoints: number;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isAdmin: boolean;
  isStaff: boolean;
  isCitizen: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('cc_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('cc_token');
      if (storedToken) {
        try {
          const { data } = await api.get('/auth/me');
          setUser(data.user);
          setToken(storedToken);
        } catch {
          localStorage.removeItem('cc_token');
          localStorage.removeItem('cc_user');
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('cc_token', data.token);
    setToken(data.token);
    setUser(data.user);
  };

  const register = async (name: string, email: string, password: string) => {
    const { data } = await api.post('/auth/register', { name, email, password });
    localStorage.setItem('cc_token', data.token);
    setToken(data.token);
    setUser(data.user);
  };

  const logout = () => {
    localStorage.removeItem('cc_token');
    localStorage.removeItem('cc_user');
    setToken(null);
    setUser(null);
    window.location.href = '/';
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        isAdmin: user?.role === 'admin',
        isStaff: user?.role === 'staff',
        isCitizen: user?.role === 'citizen',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
