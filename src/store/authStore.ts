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
  isInitialized: boolean;
  setUser: (user: SpotifyUser | null) => void;
  setTokens: (tokens: AuthTokens | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  login: (code: string) => Promise<void>;
  logout: () => void;
  initialize: () => Promise<void>;
  clearSession: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      tokens: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      isInitialized: false,

      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setTokens: (tokens) => set({ tokens }),
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),

      clearSession: () => {
        // Clear all auth-related data
        spotifyService.logout();
        
        // Clear localStorage items
        localStorage.removeItem('spotify_auth_tokens');
        localStorage.removeItem('spotify_user_data');
        localStorage.removeItem('spotify-auth');
        
        // Clear sessionStorage items
        sessionStorage.removeItem('spotify_auth_state');
        sessionStorage.clear();
        
        // Reset store state
        set({ 
          user: null, 
          tokens: null, 
          isAuthenticated: false, 
          error: null,
          isLoading: false
        });
      },
      login: async (code: string) => {
        try {
          set({ isLoading: true, error: null });
          
          const tokens = await spotifyService.exchangeCodeForToken(code);
          const user = await spotifyService.getCurrentUser();
          
          set({ 
            tokens, 
            user, 
            isAuthenticated: true, 
            isLoading: false,
            isInitialized: true
          });
          
          // Navigate to dashboard after successful login
          setTimeout(() => {
            window.location.href = '/dashboard';
          }, 100);
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Login failed';
          set({ 
            error: errorMessage, 
            isLoading: false, 
            isAuthenticated: false,
            isInitialized: true
          });
          throw error;
        }
      },

      logout: () => {
        get().clearSession();
        
        // Force redirect to landing page and reload to ensure clean state
        window.location.href = '/';
      },

      initialize: async () => {
        if (get().isInitialized) return;
        
        try {
          set({ isLoading: true });
          
          if (spotifyService.isAuthenticated()) {
            const user = await spotifyService.getCurrentUser();
            set({ 
              user, 
              isAuthenticated: true, 
              isLoading: false,
              isInitialized: true
            });
          } else {
            set({ 
              isLoading: false,
              isInitialized: true
            });
          }
        } catch (error) {
          console.error('Failed to initialize auth:', error);
          // Clear potentially corrupted data
          get().clearSession();
          set({ 
            isLoading: false, 
            isAuthenticated: false,
            user: null,
            tokens: null,
            isInitialized: true
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
      onRehydrateStorage: () => (state) => {
        // Ensure we don't have stale authentication state
        if (state && !spotifyService.isAuthenticated()) {
          state.user = null;
          state.tokens = null;
          state.isAuthenticated = false;
        }
      },
    }
  )
);