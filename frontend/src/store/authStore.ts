import { create } from 'zustand';

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => {
  // Try to load initial auth state from localStorage for persistent sessions
  const storedUser = localStorage.getItem('crm_user');
  const storedToken = localStorage.getItem('crm_token');

  let initialUser: User | null = null;
  if (storedUser) {
    try {
      initialUser = JSON.parse(storedUser);
    } catch {
      localStorage.removeItem('crm_user');
    }
  }

  return {
    user: initialUser,
    token: storedToken,
    isAuthenticated: !!storedToken,
    login: (user, token) => {
      localStorage.setItem('crm_user', JSON.stringify(user));
      localStorage.setItem('crm_token', token);
      set({ user, token, isAuthenticated: true });
    },
    logout: () => {
      localStorage.removeItem('crm_user');
      localStorage.removeItem('crm_token');
      set({ user: null, token: null, isAuthenticated: false });
    },
  };
});
