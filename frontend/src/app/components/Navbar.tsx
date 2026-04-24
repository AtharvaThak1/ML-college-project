import { Moon, Sun, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

interface NavbarProps {
  isDark: boolean;
  toggleTheme: () => void;
}

export default function Navbar({ isDark, toggleTheme }: NavbarProps) {
  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="fixed top-0 left-0 right-0 z-50 glass-card glass-noise border-b border-white/10"
      style={{
        background: 'rgba(10, 14, 26, 0.7)',
        backdropFilter: 'blur(24px)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-4"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-2xl blur-lg opacity-60 animate-glow-pulse" />
              <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center shadow-xl">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
            </div>
            <div>
              <span className="text-xl font-bold bg-gradient-to-r from-white to-emerald-400 bg-clip-text text-transparent tracking-tight">
                Food Analyzer
              </span>
              <div className="text-xs text-emerald-400/70 tracking-wider">Premium Health Insights</div>
            </div>
          </motion.div>

          <motion.button
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleTheme}
            className="relative w-14 h-14 rounded-2xl glass-card neumorphic-btn flex items-center justify-center group overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            {isDark ? (
              <Sun className="w-6 h-6 text-yellow-400 relative z-10" />
            ) : (
              <Moon className="w-6 h-6 text-slate-300 relative z-10" />
            )}
          </motion.button>
        </div>
      </div>
    </motion.nav>
  );
}
