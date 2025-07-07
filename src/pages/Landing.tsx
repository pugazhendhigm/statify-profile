import { motion } from 'framer-motion';
import { Music, BarChart3, Users, Clock, Headphones, TrendingUp } from 'lucide-react';
import { LoginButton } from '../components/spotify/LoginButton';
import { ThemeToggle } from '../components/ui/ThemeToggle';

export const Landing: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-green-900 text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-72 h-72 bg-green-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-40 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        <header className="flex justify-between items-center mb-20">
          <motion.div
            className="flex items-center gap-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Music className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">
              Spotify Profile
            </h1>
          </motion.div>
          
          <ThemeToggle />
        </header>

        <main className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <motion.div
              className="mb-8"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h2 className="text-7xl md:text-8xl font-black mb-6 leading-tight">
                <span className="bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                  Your Music
                </span>
                <br />
                <span className="text-white">Visualized</span>
              </h2>
            </motion.div>
            
            <motion.p
              className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Dive deep into your Spotify listening habits with beautiful visualizations, 
              detailed analytics, and insights about your musical journey.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <LoginButton />
            </motion.div>

            <motion.div
              className="mt-16 text-sm text-gray-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <p>Connect your Spotify account to get started</p>
            </motion.div>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-24 max-w-6xl mx-auto"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
          >
            {[
              {
                icon: BarChart3,
                title: "Detailed Analytics",
                description: "Explore your top artists, tracks, and genres with interactive charts and beautiful visualizations.",
                gradient: "from-green-400 to-green-600"
              },
              {
                icon: TrendingUp,
                title: "Listening Trends",
                description: "Track your musical evolution over time with short-term, medium-term, and all-time statistics.",
                gradient: "from-blue-400 to-blue-600"
              },
              {
                icon: Headphones,
                title: "Audio Features",
                description: "Discover the musical DNA of your favorite tracks with detailed audio feature analysis.",
                gradient: "from-purple-400 to-purple-600"
              },
              {
                icon: Users,
                title: "Artist Insights",
                description: "Get to know your favorite artists with detailed information about their popularity and genres.",
                gradient: "from-pink-400 to-pink-600"
              },
              {
                icon: Clock,
                title: "Real-time Updates",
                description: "See what you're currently listening to and track your recent listening activity in real-time.",
                gradient: "from-yellow-400 to-orange-600"
              },
              {
                icon: Music,
                title: "Playlist Analysis",
                description: "Analyze your playlists and discover patterns in your music collection and preferences.",
                gradient: "from-indigo-400 to-indigo-600"
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                className="group relative overflow-hidden bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 hover:border-white/20 transition-all duration-300"
                whileHover={{ scale: 1.02, y: -5 }}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.2 + index * 0.1 }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <div className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl transition-shadow duration-300`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                
                <h3 className="text-xl font-bold mb-4 text-white group-hover:text-green-400 transition-colors duration-300">
                  {feature.title}
                </h3>
                
                <p className="text-gray-300 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            className="mt-24 p-8 bg-gradient-to-r from-green-500/10 to-blue-500/10 backdrop-blur-xl rounded-3xl border border-white/10 max-w-4xl mx-auto"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 1.8 }}
          >
            <h3 className="text-2xl font-bold mb-4 text-white">Ready to explore your music?</h3>
            <p className="text-gray-300 mb-6">
              Connect your Spotify account and discover insights about your listening habits you never knew existed.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-400">
              <span className="px-3 py-1 bg-white/10 rounded-full">✓ Secure OAuth2 Authentication</span>
              <span className="px-3 py-1 bg-white/10 rounded-full">✓ No Data Stored</span>
              <span className="px-3 py-1 bg-white/10 rounded-full">✓ Real-time Updates</span>
              <span className="px-3 py-1 bg-white/10 rounded-full">✓ Beautiful Visualizations</span>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
};