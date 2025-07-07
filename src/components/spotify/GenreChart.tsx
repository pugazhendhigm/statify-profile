import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { spotifyService } from '../../services/spotify';
import { Card } from '../ui/Card';
import { SkeletonLoader } from '../ui/SkeletonLoader';

export const GenreChart: React.FC = () => {
  const { data: topArtists, isLoading } = useQuery({
    queryKey: ['topArtists', 'long_term'],
    queryFn: () => spotifyService.getTopArtists('long_term', 50),
  });

  if (isLoading) {
    return (
      <Card>
        <h3 className="text-lg font-semibold text-white mb-4">Top Genres</h3>
        <SkeletonLoader className="h-64" />
      </Card>
    );
  }

  if (!topArtists) return null;

  // Count genres
  const genreCount = topArtists.items.reduce((acc, artist) => {
    artist.genres.forEach(genre => {
      acc[genre] = (acc[genre] || 0) + 1;
    });
    return acc;
  }, {} as Record<string, number>);

  // Get top 8 genres
  const topGenres = Object.entries(genreCount)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 8)
    .map(([genre, count]) => ({
      name: genre,
      value: count,
    }));

  const colors = [
    '#1DB954', '#1ED760', '#1AA34A', '#159C3F', 
    '#128A35', '#0F772A', '#0C641F', '#0A5519'
  ];

  return (
    <Card>
      <h3 className="text-lg font-semibold text-white mb-6">Top Genres</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={topGenres}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {topGenres.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="space-y-3">
          {topGenres.map((genre, index) => (
            <motion.div
              key={genre.name}
              className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: colors[index] }}
                />
                <span className="text-white capitalize">{genre.name}</span>
              </div>
              <span className="text-gray-400">{genre.value}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </Card>
  );
};