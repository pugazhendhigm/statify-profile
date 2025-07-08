import { STORAGE_KEYS } from './constants';
import type { AuthTokens } from '../types/spotify';

export const generateRandomString = (length: number): string => {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let text = '';
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

export const generateCodeChallenge = async (codeVerifier: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(codeVerifier);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
};

export const formatDuration = (ms: number): string => {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

export const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
};

export const getStoredTokens = (): AuthTokens | null => {
  const stored = localStorage.getItem(STORAGE_KEYS.AUTH_TOKENS);
  return stored ? JSON.parse(stored) : null;
};

export const setStoredTokens = (tokens: AuthTokens): void => {
  localStorage.setItem(STORAGE_KEYS.AUTH_TOKENS, JSON.stringify(tokens));
};

export const clearStoredTokens = (): void => {
  localStorage.removeItem(STORAGE_KEYS.AUTH_TOKENS);
  localStorage.removeItem(STORAGE_KEYS.USER_DATA);
  localStorage.removeItem('spotify-auth'); // Clear zustand persist data
};

export const isTokenExpired = (tokens: AuthTokens): boolean => {
  return Date.now() >= tokens.expires_at;
};

export const getAudioFeatureLabel = (feature: string): string => {
  const labels: Record<string, string> = {
    danceability: 'Danceability',
    energy: 'Energy',
    speechiness: 'Speechiness',
    acousticness: 'Acousticness',
    instrumentalness: 'Instrumentalness',
    liveness: 'Liveness',
    valence: 'Positivity',
  };
  return labels[feature] || feature;
};

export const getAudioFeatureDescription = (feature: string): string => {
  const descriptions: Record<string, string> = {
    danceability: 'How suitable a track is for dancing',
    energy: 'Perceptual measure of intensity and power',
    speechiness: 'Presence of spoken words in a track',
    acousticness: 'Measure of whether the track is acoustic',
    instrumentalness: 'Predicts whether a track contains no vocals',
    liveness: 'Detects the presence of an audience',
    valence: 'Musical positiveness conveyed by a track',
  };
  return descriptions[feature] || '';
};