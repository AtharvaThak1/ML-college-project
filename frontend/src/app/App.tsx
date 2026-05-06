import { useState, useEffect } from "react";
import { motion } from "motion/react";
import Navbar from "./components/Navbar";
import Upload from "./components/Upload";
import Result from "./components/Result";
import { ThemeProvider } from "./components/ThemeProvider";
import { Toaster } from "./components/ui/sonner";
import { toast } from "sonner";

interface AnalysisResult {
  analysis: {
    grade: string;
    confidence: number;
    health_impact: string;
  };
  risks: {
    risk_words: string[];
    severity: string;
  };
  allergens: {
    detected: string[];
  };
  usage: {
    daily_recommendation: string;
  };
  personalized: {
    conditions: string[];
    advice: string[];
  };
  recommendations: string[];
  extracted_text?: string;
}

const MOCK_RESULT: AnalysisResult = {
  analysis: {
    grade: "C",
    confidence: 0.22,
    health_impact: "Moderate impact",
  },
  risks: {
    risk_words: ["sugar", "sodium"],
    severity: "medium",
  },
  allergens: {
    detected: [],
  },
  usage: {
    daily_recommendation: "Limit (2-3/week)",
  },
  personalized: {
    conditions: ["diabetes", "lactose_intolerance"],
    advice: ["Avoid high sugar due to diabetes"],
  },
  recommendations: ["Choose low-sugar alternatives"],
  extracted_text: "Nutrition Facts ...",
};

export default function App() {
  const [isDark, setIsDark] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [showHero, setShowHero] = useState(true);
  const [useMockData, setUseMockData] = useState(false);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  const handleAnalyze = async (file: File, conditions: string) => {
    setIsLoading(true);
    setShowHero(false);

    // Use mock data if enabled
    if (useMockData) {
      toast.loading("Analyzing (Demo Mode)...", { id: "analyzing" });
      await new Promise((resolve) => setTimeout(resolve, 1500));
      toast.dismiss("analyzing");
      setResult(MOCK_RESULT);
      toast.success("Analysis complete! (Demo data)");
      setIsLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("image", file);
      formData.append("health_conditions", conditions);

      toast.loading(
        "Analyzing... This may take a moment if the server is waking up.",
        { id: "analyzing" },
      );

      const response = await fetch("http://127.0.0.1:5000/analyze", {
        method: "POST",
        body: formData,
        mode: "cors",
      });

      toast.dismiss("analyzing");

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Analysis failed: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      setResult(data);
      toast.success("Analysis complete!");
    } catch (error) {
      toast.dismiss("analyzing");
      if (
        error instanceof TypeError &&
        error.message.includes("Failed to fetch")
      ) {
        toast.error(
          "Network error: Unable to reach server. Try enabling Demo Mode below.",
          { duration: 5000 },
        );
      } else {
        toast.error(
          `Failed to analyze image: ${error instanceof Error ? error.message : "Unknown error"}`,
        );
      }
      console.error("Analysis error:", error);
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
    <ThemeProvider theme={isDark ? "dark" : "light"}>
      <Toaster />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-green-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 transition-colors duration-300">
        <Navbar isDark={isDark} toggleTheme={toggleTheme} />

        <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {showHero && !result && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-16"
              >
                <h1 className="text-4xl sm:text-5xl md:text-6xl mb-4 bg-gradient-to-r from-slate-900 via-green-800 to-emerald-900 dark:from-white dark:via-green-400 dark:to-emerald-400 bg-clip-text text-transparent">
                  Know What's Inside Your Food
                </h1>
                <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-12">
                  Upload a photo of food packaging or ingredients and get
                  instant health insights tailored to your needs
                </p>
              </motion.div>
            )}

            {!result ? (
              <Upload onAnalyze={handleAnalyze} isLoading={isLoading} />
            ) : (
              <Result result={result} onReset={handleReset} />
            )}
          </div>
        </main>

        {/* Background Decorations */}
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 -left-48 w-96 h-96 bg-green-300 dark:bg-green-900 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl opacity-20 animate-blob" />
          <div className="absolute top-1/3 -right-48 w-96 h-96 bg-emerald-300 dark:bg-emerald-900 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
          <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-green-200 dark:bg-green-800 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
        </div>
      </div>
    </ThemeProvider>
  );
}
