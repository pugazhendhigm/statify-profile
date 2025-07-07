import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, RadialBarChart, RadialBar } from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { spotifyService } from '../../services/spotify';
import { Card } from '../ui/Card';
import { SkeletonLoader } from '../ui/SkeletonLoader';
import { getAudioFeatureLabel, getAudioFeatureDescription } from '../../utils/helpers';

interface AudioFeaturesProps {
  trackId: string;
}

export const AudioFeatures: React.FC<AudioFeaturesProps> = ({ trackId }) => {
  const { data: audioFeatures, isLoading } = useQuery({
    queryKey: ['audioFeatures', trackId],
    queryFn: () => spotifyService.getAudioFeaturesForTrack(trackId),
    enabled: !!trackId,
  });

  if (isLoading) {
    return (
      <Card>
        <h3 className="text-lg font-semibold text-white mb-4">Audio Features</h3>
        <SkeletonLoader count={6} height="h-12" />
      </Card>
    );
  }

  if (!audioFeatures) return null;

  const features = [
    { name: 'danceability', value: audioFeatures.danceability },
    { name: 'energy', value: audioFeatures.energy },
    { name: 'valence', value: audioFeatures.valence },
    { name: 'acousticness', value: audioFeatures.acousticness },
    { name: 'instrumentalness', value: audioFeatures.instrumentalness },
    { name: 'liveness', value: audioFeatures.liveness },
    { name: 'speechiness', value: audioFeatures.speechiness },
  ];

  const colors = ['#1DB954', '#1ED760', '#1AA34A', '#159C3F', '#128A35', '#0F772A', '#0C641F'];

  return (
    <Card>
      <h3 className="text-lg font-semibold text-white mb-6">Audio Features</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          {features.map((feature, index) => (
            <motion.div
              key={feature.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-white">
                  {getAudioFeatureLabel(feature.name)}
                </span>
                <span className="text-sm text-gray-400">
                  {Math.round(feature.value * 100)}%
                </span>
              </div>
              
              <div className="w-full bg-gray-700 rounded-full h-2">
                <motion.div
                  className="h-2 rounded-full"
                  style={{ backgroundColor: colors[index] }}
                  initial={{ width: 0 }}
                  animate={{ width: `${feature.value * 100}%` }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                />
              </div>
              
              <p className="text-xs text-gray-400 mt-1">
                {getAudioFeatureDescription(feature.name)}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart cx="50%" cy="50%" innerRadius="20%" outerRadius="80%" data={features}>
              <RadialBar
                dataKey="value"
                cornerRadius={10}
                fill="#1DB954"
              />
            </RadialBarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mt-6 p-4 bg-white/5 rounded-lg">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-400">Tempo:</span>
            <span className="text-white ml-2">{Math.round(audioFeatures.tempo)} BPM</span>
          </div>
          <div>
            <span className="text-gray-400">Key:</span>
            <span className="text-white ml-2">{audioFeatures.key}</span>
          </div>
          <div>
            <span className="text-gray-400">Loudness:</span>
            <span className="text-white ml-2">{audioFeatures.loudness.toFixed(1)} dB</span>
          </div>
          <div>
            <span className="text-gray-400">Mode:</span>
            <span className="text-white ml-2">{audioFeatures.mode === 1 ? 'Major' : 'Minor'}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};