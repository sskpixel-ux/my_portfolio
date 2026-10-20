import { useState, type FC, type FormEvent } from 'react';
import { motion } from 'framer-motion';
import { Lock, User, Eye, EyeOff, ArrowLeft, ShieldAlert } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface AdminLoginProps {
  onBackToSite: () => void;
}

const AdminLogin: FC<AdminLoginProps> = ({ onBackToSite }) => {
  const { login } = useAuth();
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    setTimeout(() => {
      const success = login(username, password);
      setIsLoading(false);
      if (!success) {
        setError('Invalid username or password. Please verify your credentials.');
      }
    }, 400);
  };

  return (
    <div className="min-h-screen bg-[#0A111E] text-white flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      {/* Background motif */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        <div className="grid grid-cols-6 h-full w-full">
          {[...Array(36)].map((_, i) => (
            <div key={i} className="border-r border-b border-luxury-gold/30"></div>
          ))}
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Back Link */}
        <button
          onClick={onBackToSite}
          className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-luxury-gold hover:text-luxury-gold-light mb-8 transition-colors cursor-pointer group"
        >
          <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
          <span>Return to Public Website</span>
        </button>

        {/* Card */}
        <div className="bg-[#0D1626] border border-luxury-gold/30 rounded-sm p-8 sm:p-10 shadow-2xl backdrop-blur-xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-luxury-gold/15 border border-luxury-gold/40 flex items-center justify-center text-luxury-gold shadow-lg shadow-luxury-gold/10">
              <Lock size={24} />
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight text-white">
              Admin Portal
            </h1>
            <p className="text-xs uppercase tracking-[0.25em] text-luxury-gold mt-1 font-mono">
              Deepak Dhumak Photography
            </p>
            <p className="text-xs text-white/50 mt-3 font-light leading-relaxed">
              Authenticate with your credentials to edit selected works, upload photographs, and update gallery albums.
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-3 bg-red-500/10 border border-red-500/30 rounded-sm text-red-400 text-xs flex items-center gap-2"
            >
              <ShieldAlert size={16} className="flex-shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-luxury-gold mb-1.5">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-white/40">
                  <User size={16} />
                </div>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  className="w-full pl-10 pr-4 py-2.5 bg-[#070c16] border border-white/10 rounded-sm text-sm text-white focus:outline-none focus:border-luxury-gold transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-luxury-gold mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-white/40">
                  <Lock size={16} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter administrator password"
                  className="w-full pl-10 pr-11 py-2.5 bg-[#070c16] border border-white/10 rounded-sm text-sm text-white focus:outline-none focus:border-luxury-gold transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-white/40 hover:text-white transition-colors cursor-pointer"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Quick credentials hint */}
            <div className="p-3 bg-luxury-gold/5 border border-luxury-gold/15 rounded-sm">
              <span className="text-[10px] uppercase font-mono text-luxury-gold block mb-1">
                Default Credentials:
              </span>
              <div className="text-[11px] text-white/70 space-y-0.5">
                <p>Username: <code className="text-luxury-gold font-mono">admin</code></p>
                <p>Password: <code className="text-luxury-gold font-mono">deepak@123</code></p>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-gold !py-3 text-xs uppercase tracking-widest font-bold cursor-pointer disabled:opacity-50 mt-2 shadow-xl"
            >
              {isLoading ? 'Verifying...' : 'Sign In to Studio'}
            </button>
          </form>
        </div>

        <p className="text-center text-[11px] text-white/40 mt-8">
          Deepak Dhumak Photography • Secure Management Console
        </p>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
