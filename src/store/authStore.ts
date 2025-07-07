import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { SpotifyUser, AuthTokens } from '../types/spotify';
import { spotifyService } from '../services/spotify';

interface AuthState {
  user: SpotifyUser | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  setUser: (user: SpotifyUser | null) => void;
  setTokens: (tokens: AuthTokens | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  login: (code: string) => Promise<void>;
  logout: () => void;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      tokens: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setTokens: (tokens) => set({ tokens }),
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),

      login: async (code: string) => {
        try {
          set({ isLoading: true, error: null });
          const tokens = await spotifyService.exchangeCodeForToken(code);
          const user = await spotifyService.getCurrentUser();
          
          set({ 
            tokens, 
            user, 
            isAuthenticated: true, 
            isLoading: false 
          });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Login failed';
          set({ 
            error: errorMessage, 
            isLoading: false, 
            isAuthenticated: false 
          });
          throw error;
        }
      },

      logout: () => {
        spotifyService.logout();
        set({ 
          user: null, 
          tokens: null, 
          isAuthenticated: false, 
          error: null 
        });
      },

      initialize: async () => {
        try {
          set({ isLoading: true });
          
          if (spotifyService.isAuthenticated()) {
            const user = await spotifyService.getCurrentUser();
            set({ 
              user, 
              isAuthenticated: true, 
              isLoading: false 
            });
          } else {
            set({ isLoading: false });
          }
        } catch (error) {
          console.error('Failed to initialize auth:', error);
          set({ 
            isLoading: false, 
            isAuthenticated: false,
            user: null,
            tokens: null 
          });
        }
      },
    }),
    {
      name: 'spotify-auth',
      partialize: (state) => ({
        user: state.user,
        tokens: state.tokens,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);