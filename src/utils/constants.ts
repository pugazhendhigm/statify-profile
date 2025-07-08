export const SPOTIFY_CONFIG = {
  CLIENT_ID: import.meta.env.VITE_SPOTIFY_CLIENT_ID,
  CLIENT_SECRET: import.meta.env.VITE_SPOTIFY_CLIENT_SECRET,
  REDIRECT_URI: import.meta.env.VITE_SPOTIFY_REDIRECT_URI,
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