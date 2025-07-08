import { motion } from 'framer-motion';
import { Music, Sparkles } from 'lucide-react';
import { SPOTIFY_CONFIG, SPOTIFY_ENDPOINTS } from '../../utils/constants';
import { generateRandomString } from '../../utils/helpers';
import { useAuthStore } from '../../store/authStore';

export const LoginButton: React.FC = () => {
  const { clearSession, isLoading } = useAuthStore();
  
  const handleLogin = () => {
    if (isLoading) return; // Prevent multiple clicks
    
    // Clear any existing session before starting new login
    clearSession();
    
    const state = generateRandomString(16);
    sessionStorage.setItem('spotify_auth_state', state);
    
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: SPOTIFY_CONFIG.CLIENT_ID,
      scope: SPOTIFY_CONFIG.SCOPES,
      redirect_uri: SPOTIFY_CONFIG.REDIRECT_URI,
      state: state,
      show_dialog: 'true', // Force Spotify to show login dialog
    });

    const authUrl = `${SPOTIFY_ENDPOINTS.AUTHORIZE}?${params}`;
    window.location.href = authUrl;
  };

  return (
    <motion.div className="relative inline-block">
      <motion.button
        onClick={handleLogin}
        className="group relative overflow-hidden bg-gradient-to-r from-green-500 via-green-600 to-green-700 text-white px-12 py-5 rounded-full font-bold text-lg shadow-2xl shadow-green-500/30 border border-green-400/20"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      >
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-green-400 via-green-500 to-green-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Shimmer effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
          initial={{ x: '-100%' }}
          animate={{ x: '200%' }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
        />
        
        <div className="relative flex items-center gap-4">
          <div className="relative">
            <Music className="w-7 h-7" />
            {!isLoading && (
              <motion.div
                className="absolute -top-1 -right-1"
                animate={{ rotate: [0, 15, -15, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
              >
                <Sparkles className="w-4 h-4 text-yellow-300" />
              </motion.div>
            )}
          </div>
          <span className="text-xl">
            {isLoading ? 'Connecting...' : 'Connect with Spotify'}
          </span>
        </div>
      </motion.button>
      
      {/* Glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-green-600 rounded-full blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-300 -z-10" />
    </motion.div>
  );
};