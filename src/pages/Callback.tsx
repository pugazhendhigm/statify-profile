import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore } from '../store/authStore';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';

export const Callback: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login, setError } = useAuthStore();

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get('code');
      const state = searchParams.get('state');
      const error = searchParams.get('error');
      const storedState = sessionStorage.getItem('spotify_auth_state');

      if (error) {
        setError(`Authentication error: ${error}`);
        navigate('/');
        return;
      }

      if (!code || !state || state !== storedState) {
        setError('Invalid authentication callback');
        navigate('/');
        return;
      }

      try {
        await login(code);
        sessionStorage.removeItem('spotify_auth_state');
        navigate('/dashboard');
      } catch (error) {
        console.error('Login failed:', error);
        navigate('/');
      }
    };

    handleCallback();
  }, [searchParams, navigate, login, setError]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-green-900 flex items-center justify-center">
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <LoadingSpinner size="lg" />
        <h2 className="text-2xl font-semibold text-white mt-6">
          Connecting to Spotify...
        </h2>
        <p className="text-gray-300 mt-2">
          Please wait while we authenticate your account.
        </p>
      </motion.div>
    </div>
  );
};