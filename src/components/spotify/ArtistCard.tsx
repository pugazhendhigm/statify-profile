import { motion } from 'framer-motion';
import { ExternalLink, Users, Play } from 'lucide-react';
import type { SpotifyArtist } from '../../types/spotify';
import { formatNumber } from '../../utils/helpers';

interface ArtistCardProps {
  artist: SpotifyArtist;
  rank: number;
}

export const ArtistCard: React.FC<ArtistCardProps> = ({ artist, rank }) => {
  const handleClick = () => {
    window.open(artist.external_urls.spotify, '_blank');
  };

  return (
    <motion.div
      className="group relative overflow-hidden bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 hover:border-white/20 p-6 cursor-pointer transition-all duration-300"
      whileHover={{ scale: 1.02, y: -8 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleClick}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: rank * 0.05 }}
    >
      {/* Rank Badge */}
      <div className="absolute top-4 left-4 w-10 h-10 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg z-10">
        {rank}
      </div>
      
      {/* External Link Icon */}
      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
        <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20">
          <ExternalLink className="w-5 h-5 text-white" />
        </div>
      </div>

      {/* Hover Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl" />

      <div className="relative">
        {/* Artist Image */}
        <div className="w-full aspect-square mb-6 rounded-2xl overflow-hidden relative">
          {artist.images?.[0]?.url ? (
            <div className="relative w-full h-full">
              <img
                src={artist.images[0].url}
                alt={artist.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              {/* Play Button Overlay */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center shadow-2xl transform scale-75 group-hover:scale-100 transition-transform duration-300">
                  <Play className="w-8 h-8 text-white ml-1" />
                </div>
              </div>
            </div>
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center rounded-2xl">
              <Users className="w-16 h-16 text-gray-400" />
            </div>
          )}
        </div>

        {/* Artist Info */}
        <div className="space-y-4">
          <h3 className="font-bold text-white text-xl leading-tight group-hover:text-green-400 transition-colors duration-300">
            {artist.name}
          </h3>
          
          {/* Followers */}
          <div className="flex items-center gap-2 text-gray-300">
            <Users className="w-4 h-4" />
            <span className="text-sm font-medium">{formatNumber(artist.followers?.total || 0)} followers</span>
          </div>

          {/* Genres */}
          <div className="flex flex-wrap gap-2">
            {artist.genres?.slice(0, 3).map((genre, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-xs text-gray-200 border border-white/10 capitalize"
              >
                {genre}
              </span>
            ))}
          </div>

          {/* Popularity Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Popularity</span>
              <span className="text-sm text-green-400 font-medium">{artist.popularity}%</span>
            </div>
            <div className="w-full bg-gray-700/50 rounded-full h-2 overflow-hidden">
              <motion.div
                className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${artist.popularity}%` }}
                transition={{ duration: 1, delay: rank * 0.05 + 0.5 }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl -z-10" />
    </motion.div>
  );
};