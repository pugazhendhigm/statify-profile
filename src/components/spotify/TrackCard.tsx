import { motion } from 'framer-motion';
import { ExternalLink, Play, Clock } from 'lucide-react';
import type { SpotifyTrack } from '../../types/spotify';
import { formatDuration } from '../../utils/helpers';

interface TrackCardProps {
  track: SpotifyTrack;
  rank: number;
}

export const TrackCard: React.FC<TrackCardProps> = ({ track, rank }) => {
  const handleClick = () => {
    window.open(track.external_urls.spotify, '_blank');
  };

  return (
    <motion.div
      className="group relative overflow-hidden bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 hover:border-white/20 p-6 cursor-pointer transition-all duration-300"
      whileHover={{ scale: 1.01, y: -4 }}
      whileTap={{ scale: 0.99 }}
      onClick={handleClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: rank * 0.02 }}
    >
      {/* Hover Gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
      
      <div className="relative flex items-center gap-6">
        {/* Rank */}
        <div className="flex-shrink-0">
          <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
            {rank}
          </div>
        </div>

        {/* Album Art */}
        <div className="relative flex-shrink-0">
          <div className="w-20 h-20 rounded-xl overflow-hidden shadow-lg">
            {track.album.images?.[0]?.url ? (
              <div className="relative w-full h-full">
                <img
                  src={track.album.images[0].url}
                  alt={track.album.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                {/* Play Button Overlay */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <Play className="w-4 h-4 text-white ml-0.5" />
                  </div>
                </div>
              </div>
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center">
                <Play className="w-8 h-8 text-gray-400" />
              </div>
            )}
          </div>
        </div>

        {/* Track Info */}
        <div className="flex-1 min-w-0 space-y-2">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <h3 className="font-bold text-white text-lg leading-tight truncate group-hover:text-green-400 transition-colors duration-300">
                {track.name}
              </h3>
              <p className="text-gray-300 truncate mt-1">
                {track.artists.map(artist => artist.name).join(', ')}
              </p>
            </div>
            
            <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20">
                <ExternalLink className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4 text-sm text-gray-400">
            <span className="truncate">{track.album.name}</span>
            <span>•</span>
            <span>{track.album.release_date.split('-')[0]}</span>
          </div>
        </div>

        {/* Track Stats */}
        <div className="flex-shrink-0 text-right space-y-3">
          {/* Popularity */}
          <div className="flex items-center gap-3">
            <div className="w-16 bg-gray-700/50 rounded-full h-1.5 overflow-hidden">
              <motion.div
                className="bg-gradient-to-r from-green-400 to-green-600 h-1.5 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${track.popularity}%` }}
                transition={{ duration: 1, delay: rank * 0.02 + 0.3 }}
              />
            </div>
            <span className="text-xs text-green-400 font-medium w-8">{track.popularity}%</span>
          </div>
          
          {/* Duration */}
          <div className="flex items-center gap-2 text-gray-300">
            <Clock className="w-4 h-4" />
            <span className="text-sm font-medium">{formatDuration(track.duration_ms)}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};