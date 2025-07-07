import { motion } from 'framer-motion';
import { Play, Pause, ExternalLink, Volume2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { spotifyService } from '../../services/spotify';
import { formatDuration } from '../../utils/helpers';
import { Card } from '../ui/Card';
import { SkeletonLoader } from '../ui/SkeletonLoader';

export const CurrentlyPlaying: React.FC = () => {
  const { data: currentTrack, isLoading } = useQuery({
    queryKey: ['currentlyPlaying'],
    queryFn: spotifyService.getCurrentlyPlaying,
    refetchInterval: 5000,
  });

  if (isLoading) {
    return (
      <Card className="col-span-full">
        <div className="flex items-center gap-4">
          <SkeletonLoader className="w-20 h-20 rounded-lg" />
          <div className="flex-1">
            <SkeletonLoader count={3} />
          </div>
        </div>
      </Card>
    );
  }

  if (!currentTrack) {
    return (
      <Card className="col-span-full">
        <div className="text-center py-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-600 rounded-full flex items-center justify-center">
            <Play className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-300">No music playing right now</p>
        </div>
      </Card>
    );
  }

  const progressPercentage = (currentTrack.progress_ms / currentTrack.item.duration_ms) * 100;

  return (
    <Card className="col-span-full">
      <div className="flex items-center gap-6">
        <div className="relative">
          <div className="w-20 h-20 rounded-lg overflow-hidden">
            <img
              src={currentTrack.item.album.images[0]?.url}
              alt={currentTrack.item.album.name}
              className="w-full h-full object-cover"
            />
          </div>
          
          <motion.div
            className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center"
            animate={{ scale: currentTrack.is_playing ? [1, 1.2, 1] : 1 }}
            transition={{ duration: 1, repeat: currentTrack.is_playing ? Infinity : 0 }}
          >
            {currentTrack.is_playing ? (
              <Pause className="w-4 h-4 text-white" />
            ) : (
              <Play className="w-4 h-4 text-white" />
            )}
          </motion.div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-semibold text-white text-lg truncate">
              {currentTrack.item.name}
            </h3>
            <button
              onClick={() => window.open(currentTrack.item.external_urls.spotify, '_blank')}
              className="p-1 text-gray-400 hover:text-white transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>
          
          <p className="text-gray-300 mb-3 truncate">
            {currentTrack.item.artists.map(artist => artist.name).join(', ')}
          </p>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <span>{formatDuration(currentTrack.progress_ms)}</span>
              <div className="flex-1 bg-gray-700 rounded-full h-1">
                <motion.div
                  className="bg-green-500 h-1 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercentage}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              <span>{formatDuration(currentTrack.item.duration_ms)}</span>
            </div>
            
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <span>{currentTrack.item.album.name}</span>
              <span>•</span>
              <span>{currentTrack.item.album.release_date.split('-')[0]}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-gray-400">
            <Volume2 className="w-4 h-4" />
            <span className="text-sm">{currentTrack.device.volume_percent}%</span>
          </div>
          
          <div className="text-right">
            <p className="text-sm text-gray-300">{currentTrack.device.name}</p>
            <p className="text-xs text-gray-400 capitalize">{currentTrack.device.type}</p>
          </div>
        </div>
      </div>
    </Card>
  );
};