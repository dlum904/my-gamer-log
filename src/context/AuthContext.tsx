import { createContext, useContext, type ReactNode } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import type { User } from '../types/game';

// Placeholder auth: stores the user locally until the Django backend exists.

interface AuthContextValue {
  user: User | null;
  login: (username: string, password: string) => void;
  signup: (username: string, email: string, password: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useLocalStorage<User | null>('mgl:user', null);

  const login = (username: string) => setUser({ username, email: '' });
  const signup = (username: string, email: string) => setUser({ username, email });
  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
