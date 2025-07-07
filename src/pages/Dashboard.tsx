import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Music, Users, Clock, BarChart3,
  //  Headphones, TrendingUp,
    Heart } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { spotifyService } from '../services/spotify';
import { UserProfile } from '../components/spotify/UserProfile';
// import { CurrentlyPlaying } from '../components/spotify/CurrentlyPlaying';
import { ArtistCard } from '../components/spotify/ArtistCard';
import { TrackCard } from '../components/spotify/TrackCard';
import { AudioFeatures } from '../components/spotify/AudioFeatures';
import { GenreChart } from '../components/spotify/GenreChart';
import { TimeRangeSelector } from '../components/spotify/TimeRangeSelector';
import { ThemeToggle } from '../components/ui/ThemeToggle';
import { Card } from '../components/ui/Card';
import { SkeletonLoader } from '../components/ui/SkeletonLoader';
import type { TimeRange } from '../types/spotify';

export const Dashboard: React.FC = () => {
  const { user } = useAuthStore();
  const [timeRange, setTimeRange] = useState<TimeRange>('medium_term');
  const [selectedTrackId, setSelectedTrackId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'artists' | 'tracks' | 'recent' | 'playlists'>('overview');

  const { data: topArtists, isLoading: loadingArtists } = useQuery({
    queryKey: ['topArtists', timeRange],
    queryFn: () => spotifyService.getTopArtists(timeRange, 50),
  });

  const { data: topTracks, isLoading: loadingTracks } = useQuery({
    queryKey: ['topTracks', timeRange],
    queryFn: () => spotifyService.getTopTracks(timeRange, 50),
  });

  const { data: recentTracks, isLoading: loadingRecent } = useQuery({
    queryKey: ['recentTracks'],
    queryFn: () => spotifyService.getRecentlyPlayed(50),
  });

  if (!user) return null;

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'artists', label: 'Top Artists', icon: Users },
    { id: 'tracks', label: 'Top Tracks', icon: Music },
    { id: 'recent', label: 'Recent', icon: Clock },
    // { id: 'playlists', label: 'Features', icon: Headphones },
  ] as const;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-green-900 text-white flex flex-col">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-96 h-96 bg-green-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 flex-1">
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
          <motion.div
            className="flex items-center gap-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg">
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/8/84/Spotify_icon.svg" 
                alt="Spotify"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">
                Statify
              </h1>
              <p className="text-gray-400">Welcome back, {user.display_name}</p>
            </div>
          </motion.div>
          
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <UserProfile />
          </div>
        </header>

        {/* Navigation Tabs */}
        <motion.div
          className="flex flex-wrap gap-2 mb-8 p-2 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {tabs.map((tab) => (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-green-500 text-white shadow-lg shadow-green-500/25'
                  : 'text-gray-300 hover:text-white hover:bg-white/10'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <tab.icon className="w-5 h-5" />
              <span className="hidden sm:inline">{tab.label}</span>
            </motion.button>
          ))}
        </motion.div>

        <main className="space-y-8">
          <AnimatePresence mode="wait">
            {activeTab === 'overview' && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-8"
              >
                {/* Currently Playing */}
                {/* <section>
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                    <TrendingUp className="w-7 h-7 text-green-400" />
                    Now Playing
                  </h2>
                  <CurrentlyPlaying />
                </section> */}

                {/* Time Range Selector */}
                <section className="flex justify-center">
                  <TimeRangeSelector selected={timeRange} onSelect={setTimeRange} />
                </section>

                {/* Overview Grid */}
                <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Top Artists Preview */}
                  <Card>
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <Users className="w-6 h-6 text-green-400" />
                        Top Artists
                      </h3>
                      <button
                        onClick={() => setActiveTab('artists')}
                        className="text-green-400 hover:text-green-300 text-sm font-medium"
                      >
                        View All
                      </button>
                    </div>
                    {loadingArtists ? (
                      <div className="space-y-4">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <div key={i} className="flex items-center gap-3">
                            <SkeletonLoader className="w-12 h-12 rounded-full" />
                            <div className="flex-1">
                              <SkeletonLoader count={2} />
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {topArtists?.items.slice(0, 5).map((artist, index) => (
                          <motion.div
                            key={artist.id}
                            className="flex items-center gap-4 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            <span className="text-green-400 font-bold text-sm w-6">#{index + 1}</span>
                            <img
                              src={artist.images[0]?.url}
                              alt={artist.name}
                              className="w-12 h-12 rounded-full object-cover"
                            />
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-white truncate">{artist.name}</h4>
                              <p className="text-sm text-gray-400 truncate">
                                {artist.genres.slice(0, 2).join(', ')}
                              </p>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </Card>

                  {/* Top Tracks Preview */}
                  <Card>
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <Music className="w-6 h-6 text-green-400" />
                        Top Tracks
                      </h3>
                      <button
                        onClick={() => setActiveTab('tracks')}
                        className="text-green-400 hover:text-green-300 text-sm font-medium"
                      >
                        View All
                      </button>
                    </div>
                    {loadingTracks ? (
                      <div className="space-y-4">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <div key={i} className="flex items-center gap-3">
                            <SkeletonLoader className="w-12 h-12 rounded-lg" />
                            <div className="flex-1">
                              <SkeletonLoader count={2} />
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {topTracks?.items.slice(0, 5).map((track, index) => (
                          <motion.div
                            key={track.id}
                            className="flex items-center gap-4 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                            onClick={() => setSelectedTrackId(track.id)}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            <span className="text-green-400 font-bold text-sm w-6">#{index + 1}</span>
                            <img
                              src={track.album.images[0]?.url}
                              alt={track.album.name}
                              className="w-12 h-12 rounded-lg object-cover"
                            />
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-white truncate">{track.name}</h4>
                              <p className="text-sm text-gray-400 truncate">
                                {track.artists.map(a => a.name).join(', ')}
                              </p>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </Card>
                </section>

                {/* Genre Chart */}
                <GenreChart />
              </motion.div>
            )}

            {activeTab === 'artists' && (
              <motion.div
                key="artists"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-8"
              >
                <div className="flex justify-center">
                  <TimeRangeSelector selected={timeRange} onSelect={setTimeRange} />
                </div>
                
                <section>
                  <h2 className="text-3xl font-bold mb-8 text-center">Your Top Artists</h2>
                  {loadingArtists ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {Array.from({ length: 20 }).map((_, i) => (
                        <Card key={i}>
                          <SkeletonLoader className="aspect-square rounded-lg mb-4" />
                          <SkeletonLoader count={3} />
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {topArtists?.items.map((artist, index) => (
                        <ArtistCard key={artist.id} artist={artist} rank={index + 1} />
                      ))}
                    </div>
                  )}
                </section>
              </motion.div>
            )}

            {activeTab === 'tracks' && (
              <motion.div
                key="tracks"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-8"
              >
                <div className="flex justify-center">
                  <TimeRangeSelector selected={timeRange} onSelect={setTimeRange} />
                </div>
                
                <section>
                  <h2 className="text-3xl font-bold mb-8 text-center">Your Top Tracks</h2>
                  {loadingTracks ? (
                    <div className="space-y-4">
                      {Array.from({ length: 20 }).map((_, i) => (
                        <Card key={i}>
                          <div className="flex items-center gap-4">
                            <SkeletonLoader className="w-16 h-16 rounded-lg" />
                            <div className="flex-1">
                              <SkeletonLoader count={3} />
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {topTracks?.items.map((track, index) => (
                        <TrackCard
                          key={track.id}
                          track={track}
                          rank={index + 1}
                        />
                      ))}
                    </div>
                  )}
                </section>
              </motion.div>
            )}

            {activeTab === 'recent' && (
              <motion.div
                key="recent"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-8"
              >
                <section>
                  <h2 className="text-3xl font-bold mb-8 text-center">Recently Played</h2>
                  {loadingRecent ? (
                    <div className="space-y-4">
                      {Array.from({ length: 20 }).map((_, i) => (
                        <Card key={i}>
                          <div className="flex items-center gap-4">
                            <SkeletonLoader className="w-16 h-16 rounded-lg" />
                            <div className="flex-1">
                              <SkeletonLoader count={3} />
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {recentTracks?.items.map((item, index) => (
                        <motion.div
                          key={`${item.track.id}-${index}`}
                          className="flex items-center gap-4 p-4 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 hover:border-white/20 transition-all cursor-pointer"
                          onClick={() => setSelectedTrackId(item.track.id)}
                          whileHover={{ scale: 1.01, y: -2 }}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <img
                            src={item.track.album.images[0]?.url}
                            alt={item.track.album.name}
                            className="w-16 h-16 rounded-lg object-cover"
                          />
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-white truncate">{item.track.name}</h3>
                            <p className="text-gray-300 truncate">
                              {item.track.artists.map(a => a.name).join(', ')}
                            </p>
                            <p className="text-sm text-gray-400">
                              {new Date(item.played_at).toLocaleString()}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </section>
              </motion.div>
            )}

            {activeTab === 'playlists' && selectedTrackId && (
              <motion.div
                key="playlists"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <AudioFeatures trackId={selectedTrackId} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Audio Features Modal */}
          {selectedTrackId && activeTab !== 'playlists' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setSelectedTrackId(null)}
            >
              <motion.div
                className="bg-gray-900/95 backdrop-blur-xl rounded-3xl border border-white/20 p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-white">Audio Features</h3>
                  <button
                    onClick={() => setSelectedTrackId(null)}
                    className="text-gray-400 hover:text-white text-2xl"
                  >
                    ×
                  </button>
                </div>
                <AudioFeatures trackId={selectedTrackId} />
              </motion.div>
            </motion.div>
          )}
        </main>
      </div>

      {/* Footer */}
      <footer className="relative z-10 mt-12 border-t border-white/10 bg-black/20 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-6">
          <motion.div
            className="flex flex-col items-center justify-center gap-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <span>Designed and Developed with</span>
              <Heart className="w-4 h-4 text-red-400 animate-pulse" />
              <span>by</span>
              <span className="font-semibold bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">
                Pugazhendhi GM
              </span>
            </div>
            <div className="text-xs text-gray-500">
              © 2024 Statify. All rights reserved.
            </div>
          </motion.div>
        </div>
      </footer>
    </div>
  );
};