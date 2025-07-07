import { motion } from 'framer-motion';
import { User, LogOut, ExternalLink } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { formatNumber } from '../../utils/helpers';

export const UserProfile: React.FC = () => {
  const { user, logout } = useAuthStore();

  if (!user) return null;

  return (
    <motion.div
      className="flex items-center gap-4 p-4 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-300"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.02 }}
    >
      {/* Profile Image */}
      <div className="relative">
        {user.images?.[0]?.url ? (
          <motion.img
            src={user.images[0].url}
            alt={user.display_name}
            className="w-14 h-14 rounded-full object-cover border-2 border-green-400/30"
            whileHover={{ scale: 1.1 }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
          />
        ) : (
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center border-2 border-green-400/30">
            <User className="w-7 h-7 text-white" />
          </div>
        )}
        {/* Online Indicator */}
        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-gray-900 shadow-lg">
          <div className="w-full h-full bg-green-400 rounded-full animate-pulse" />
        </div>
      </div>
      
      {/* User Info */}
      <div className="flex-1 min-w-0">
        <h3 className="font-bold text-white truncate text-lg">{user.display_name}</h3>
        <div className="flex items-center gap-2 text-sm text-gray-300">
          <span>{formatNumber(user.followers?.total || 0)} followers</span>
          <span>•</span>
          <span className="capitalize">{user.product || 'free'}</span>
        </div>
      </div>
      
      {/* Action Buttons */}
      <div className="flex items-center gap-2">
        <motion.button
          onClick={() => window.open(`https://open.spotify.com/user/${user.id}`, '_blank')}
          className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          title="View on Spotify"
        >
          <ExternalLink className="w-5 h-5" />
        </motion.button>
        
        <motion.button
          onClick={logout}
          className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-full transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          title="Logout"
        >
          <LogOut className="w-5 h-5" />
        </motion.button>
      </div>
    </motion.div>
  );
};