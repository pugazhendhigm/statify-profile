export const SPOTIFY_CONFIG = {
  CLIENT_ID: import.meta.env.VITE_SPOTIFY_CLIENT_ID || '9a5ee17e2a9a44fc9fa9657a5af17309',
  CLIENT_SECRET: import.meta.env.VITE_SPOTIFY_CLIENT_SECRET || 'c6a036cd9fd24b808b31e8127912fbb6',
  REDIRECT_URI: import.meta.env.VITE_SPOTIFY_REDIRECT_URI || 'https://statify-profile.vercel.app/callback',
  BASE_URL: import.meta.env.VITE_BASE_URL,
  SCOPES: [
    'user-read-private',
    'user-read-email',
    'user-top-read',
    'user-read-recently-played',
    'user-read-playback-state',
    'user-read-currently-playing',
    'playlist-read-private',
    'playlist-read-collaborative',
  ].join(' '),
};

export const SPOTIFY_ENDPOINTS = {
  AUTHORIZE: 'https://accounts.spotify.com/authorize',
  TOKEN: 'https://accounts.spotify.com/api/token',
  API: 'https://api.spotify.com/v1',
};

export const TIME_RANGES = {
  short_term: { label: '4 Weeks', value: 'short_term' },
  medium_term: { label: '6 Months', value: 'medium_term' },
  long_term: { label: 'All Time', value: 'long_term' },
} as const;

export const STORAGE_KEYS = {
  AUTH_TOKENS: 'spotify_auth_tokens',
  THEME: 'spotify_theme',
  USER_DATA: 'spotify_user_data',
} as const;