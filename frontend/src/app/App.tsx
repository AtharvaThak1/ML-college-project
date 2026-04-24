import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import Navbar from './components/Navbar';
import Upload from './components/Upload';
import Result from './components/Result';
import ParticleBackground from './components/ParticleBackground';
import { ThemeProvider } from './components/ThemeProvider';
import { Toaster } from './components/ui/sonner';
import { toast } from 'sonner';

interface AnalysisResult {
  analysis: {
    grade: string;
    confidence: number;
    impact: string;
  };
  usage: {
    frequency: string;
    impact: string;
    level: string;
    quantity: string;
  };
  risks: {
    list: string[];
    details: Array<{
      name: string;
      description: string;
      long_term: string;
    }>;
  };
  allergens: {
    list: string[];
    details: Array<{
      name: string;
      symptoms: string;
      info: string;
    }>;
  };
  recommendations: {
    overall: string;
    do: string[];
    avoid: string[];
    alternatives: string[];
  };
  ai_explanation: string;
  extracted_text?: string;
}

export default function App() {
  const [isDark, setIsDark] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [showHero, setShowHero] = useState(true);

  useEffect(() => {
    document.documentElement.classList.add('dark');
    document.body.style.background = '#0a0e1a';
  }, []);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  const handleAnalyze = async (file: File, conditions: string) => {
    setIsLoading(true);
    setShowHero(false);

    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('health_conditions', conditions);

      toast.loading('Analyzing... Please wait ⏳', { id: 'analyzing' });

      const response = await fetch('https://ml-college-project-1.onrender.com/analyze', {
        method: 'POST',
        body: formData,
        mode: 'cors',
      });

      toast.dismiss('analyzing');

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Analysis failed: ${response.status} - ${errorText}`);
      }

      const data: AnalysisResult = await response.json();

      setResult(data);
      toast.success('Analysis complete 💚');
    } catch (error) {
      toast.dismiss('analyzing');

      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        toast.error('Server unreachable 😒 (maybe sleeping or CORS issue)', {
          duration: 5000,
        });
      } else {
        toast.error(
          `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
        );
      }

      console.error('Analysis error:', error);
      setShowHero(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setShowHero(true);
  };

  return (
    <ThemeProvider theme="dark">
      <Toaster />
      <div className="min-h-screen bg-[#0a0e1a] text-slate-100 transition-colors duration-300">
        <ParticleBackground />
        <Navbar isDark={isDark} toggleTheme={toggleTheme} />

        <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {showHero && !result && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-16"
              >
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-4xl sm:text-5xl md:text-7xl mb-6 font-bold tracking-tight"
                  style={{
                    background:
                      'linear-gradient(135deg, #ffffff 0%, #10b981 50%, #06b6d4 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    letterSpacing: '-0.02em',
                  }}
                >
                  Know What's Inside Your Food
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-12 tracking-wide"
                >
                  Upload a photo of food packaging or ingredients and get instant health insights tailored to your needs
                </motion.p>
              </motion.div>
            )}

            {!result ? (
              <Upload onAnalyze={handleAnalyze} isLoading={isLoading} />
            ) : (
              <Result result={result} onReset={handleReset} />
            )}
          </div>
        </main>
      </div>
    </ThemeProvider>
  );
}