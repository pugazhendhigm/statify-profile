import axios from 'axios';
import { SPOTIFY_ENDPOINTS, SPOTIFY_CONFIG } from '../utils/constants';
import { getStoredTokens, setStoredTokens, clearStoredTokens, isTokenExpired } from '../utils/helpers';
import type { 
  SpotifyUser, 
  SpotifyArtist, 
  SpotifyTrack, 
  SpotifyPlaylistTrack, 
  SpotifyCurrentTrack,
  SpotifyAudioFeatures,
  SpotifyTopItems,
  TimeRange,
  AuthTokens 
} from '../types/spotify';

class SpotifyService {
  private accessToken: string | null = null;

  constructor() {
    this.initializeToken();
  }

  private initializeToken(): void {
    const tokens = getStoredTokens();
    if (tokens && !isTokenExpired(tokens)) {
      this.accessToken = tokens.access_token;
    }
  }

  private async refreshTokenIfNeeded(): Promise<void> {
    const tokens = getStoredTokens();
    if (!tokens) return;

    if (isTokenExpired(tokens)) {
      try {
        const newTokens = await this.refreshToken(tokens.refresh_token);
        this.accessToken = newTokens.access_token;
        setStoredTokens(newTokens);
      } catch (error) {
        console.error('Failed to refresh token:', error);
        clearStoredTokens();
        this.accessToken = null;
        throw error;
      }
    }
  }

  private async makeRequest<T>(url: string, options: RequestInit = {}): Promise<T> {
    await this.refreshTokenIfNeeded();
    
    if (!this.accessToken) {
      throw new Error('No access token available');
    }

    const response = await fetch(url, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Spotify API Error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
    }

    return response.json();
  }

  async exchangeCodeForToken(code: string): Promise<AuthTokens> {
    const response = await axios.post(SPOTIFY_ENDPOINTS.TOKEN, new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: SPOTIFY_CONFIG.REDIRECT_URI,
      client_id: SPOTIFY_CONFIG.CLIENT_ID,
      client_secret: SPOTIFY_CONFIG.CLIENT_SECRET,
    }), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    const tokens: AuthTokens = {
      access_token: response.data.access_token,
      refresh_token: response.data.refresh_token,
      expires_at: Date.now() + (response.data.expires_in * 1000),
      token_type: response.data.token_type,
    };

    this.accessToken = tokens.access_token;
    setStoredTokens(tokens);
    return tokens;
  }

  async refreshToken(refreshToken: string): Promise<AuthTokens> {
    const response = await axios.post(SPOTIFY_ENDPOINTS.TOKEN, new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
      client_id: SPOTIFY_CONFIG.CLIENT_ID,
      client_secret: SPOTIFY_CONFIG.CLIENT_SECRET,
    }), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    const tokens: AuthTokens = {
      access_token: response.data.access_token,
      refresh_token: response.data.refresh_token || refreshToken,
      expires_at: Date.now() + (response.data.expires_in * 1000),
      token_type: response.data.token_type,
    };

    return tokens;
  }

  async getCurrentUser(): Promise<SpotifyUser> {
    return this.makeRequest<SpotifyUser>(`${SPOTIFY_ENDPOINTS.API}/me`);
  }

  async getTopArtists(timeRange: TimeRange = 'medium_term', limit: number = 20): Promise<SpotifyTopItems<SpotifyArtist>> {
    return this.makeRequest<SpotifyTopItems<SpotifyArtist>>(
      `${SPOTIFY_ENDPOINTS.API}/me/top/artists?time_range=${timeRange}&limit=${limit}`
    );
  }

  async getTopTracks(timeRange: TimeRange = 'medium_term', limit: number = 20): Promise<SpotifyTopItems<SpotifyTrack>> {
    return this.makeRequest<SpotifyTopItems<SpotifyTrack>>(
      `${SPOTIFY_ENDPOINTS.API}/me/top/tracks?time_range=${timeRange}&limit=${limit}`
    );
  }

  async getRecentlyPlayed(limit: number = 20): Promise<{ items: SpotifyPlaylistTrack[] }> {
    return this.makeRequest<{ items: SpotifyPlaylistTrack[] }>(
      `${SPOTIFY_ENDPOINTS.API}/me/player/recently-played?limit=${limit}`
    );
  }

  async getCurrentlyPlaying(): Promise<SpotifyCurrentTrack | null> {
    try {
      const response = await this.makeRequest<SpotifyCurrentTrack>(
        `${SPOTIFY_ENDPOINTS.API}/me/player/currently-playing`
      );
      return response;
    } catch (error) {
      // Return null if nothing is playing
      return null;
    }
  }

  async getAudioFeatures(trackIds: string[]): Promise<{ audio_features: SpotifyAudioFeatures[] }> {
    const ids = trackIds.join(',');
    return this.makeRequest<{ audio_features: SpotifyAudioFeatures[] }>(
      `${SPOTIFY_ENDPOINTS.API}/audio-features?ids=${ids}`
    );
  }

  async getAudioFeaturesForTrack(trackId: string): Promise<SpotifyAudioFeatures> {
    return this.makeRequest<SpotifyAudioFeatures>(
      `${SPOTIFY_ENDPOINTS.API}/audio-features/${trackId}`
    );
  }

  isAuthenticated(): boolean {
    const tokens = getStoredTokens();
    return tokens !== null && !isTokenExpired(tokens);
  }

  logout(): void {
    clearStoredTokens();
    this.accessToken = null;
    
    // Clear any cached data
    sessionStorage.clear();
  }
}

export const spotifyService = new SpotifyService();