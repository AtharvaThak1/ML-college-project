import { motion } from 'motion/react';
import { AlertTriangle, Heart, CheckCircle, Info, RotateCcw, ChevronDown, ChevronUp, Activity, X, Check, Lightbulb, Sparkles, TrendingUp, Clock, Zap } from 'lucide-react';
import { useState } from 'react';

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

interface ResultProps {
  result: AnalysisResult;
  onReset: () => void;
}

export default function Result({ result, onReset }: ResultProps) {
  const [showText, setShowText] = useState(false);

  const getGradeColor = (grade: string) => {
    const colors: Record<string, { from: string; to: string; glow: string }> = {
      A: { from: '#10b981', to: '#059669', glow: 'rgba(16, 185, 129, 0.5)' },
      B: { from: '#84cc16', to: '#65a30d', glow: 'rgba(132, 204, 22, 0.5)' },
      C: { from: '#f59e0b', to: '#d97706', glow: 'rgba(245, 158, 11, 0.5)' },
      D: { from: '#f97316', to: '#ea580c', glow: 'rgba(249, 115, 22, 0.5)' },
      E: { from: '#ef4444', to: '#dc2626', glow: 'rgba(239, 68, 68, 0.5)' },
    };
    return colors[grade] || colors.C;
  };

  const getGradePercentage = (grade: string) => {
    const percentages: Record<string, number> = {
      A: 90, B: 75, C: 60, D: 40, E: 20,
    };
    return percentages[grade] || 50;
  };

  const getLevelPosition = (level: string) => {
    const positions: Record<string, number> = {
      'Safe': 100, 'Moderate': 60, 'Limit': 40, 'Avoid': 0,
    };
    return positions[level] || 50;
  };

  const gradePercentage = getGradePercentage(result.analysis.grade);
  const levelPosition = getLevelPosition(result.usage.level);
  const gradeColors = getGradeColor(result.analysis.grade);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full max-w-7xl mx-auto space-y-8"
    >
      {/* Header with Reset Button */}
      <div className="flex justify-end">
        <motion.button
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(16, 185, 129, 0.3)' }}
          whileTap={{ scale: 0.95 }}
          onClick={onReset}
          className="flex items-center gap-3 px-6 py-3 rounded-2xl glass-card neumorphic-btn border border-emerald-500/30 text-white hover:border-emerald-500 transition-all group"
          style={{ backdropFilter: 'blur(24px)' }}
        >
          <RotateCcw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
          Scan Again
        </motion.button>
      </div>

      {/* Grade Circle & Usage Guide */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Circular Grade Meter */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="rounded-3xl glass-card glass-noise border border-white/10 p-10 relative overflow-hidden group"
          style={{ background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(32px)' }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          <div className="relative">
            <div className="flex items-center gap-3 mb-8">
              <TrendingUp className="w-6 h-6 text-emerald-400" />
              <h3 className="text-2xl font-bold text-white tracking-tight">Health Score</h3>
            </div>

            <div className="flex flex-col items-center">
              <div className="relative w-56 h-56 mb-8">
                {/* Background glow */}
                <div
                  className="absolute inset-0 rounded-full blur-3xl opacity-50 animate-glow-pulse"
                  style={{ background: gradeColors.glow }}
                />

                {/* SVG Circle */}
                <svg className="w-56 h-56 transform -rotate-90 relative z-10">
                  <defs>
                    <linearGradient id={`gradeGradient-${result.analysis.grade}`} x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor={gradeColors.from} />
                      <stop offset="100%" stopColor={gradeColors.to} />
                    </linearGradient>
                    <filter id="glow">
                      <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                      <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                      </feMerge>
                    </filter>
                  </defs>
                  <circle
                    cx="112"
                    cy="112"
                    r="100"
                    stroke="rgba(255, 255, 255, 0.1)"
                    strokeWidth="16"
                    fill="none"
                  />
                  <motion.circle
                    cx="112"
                    cy="112"
                    r="100"
                    stroke={`url(#gradeGradient-${result.analysis.grade})`}
                    strokeWidth="16"
                    fill="none"
                    strokeLinecap="round"
                    filter="url(#glow)"
                    initial={{ strokeDashoffset: 628 }}
                    animate={{ strokeDashoffset: 628 - (628 * gradePercentage) / 100 }}
                    transition={{ duration: 2, ease: 'easeOut' }}
                    style={{ strokeDasharray: 628 }}
                  />
                </svg>

                {/* Center content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
                    className="text-7xl font-bold text-glow"
                    style={{ color: gradeColors.from }}
                  >
                    {result.analysis.grade}
                  </motion.span>
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                    className="text-sm text-slate-400 mt-2"
                  >
                    {Math.round(result.analysis.confidence * 100)}% confidence
                  </motion.span>
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="px-6 py-3 rounded-2xl glass-card border border-white/10"
                style={{ backdropFilter: 'blur(16px)' }}
              >
                <p className="text-center text-white font-medium">
                  {result.analysis.impact} Impact
                </p>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Consumption Guide */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="rounded-3xl glass-card glass-noise border border-white/10 p-10 relative overflow-hidden group"
          style={{ background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(32px)' }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          <div className="relative">
            <div className="flex items-center gap-3 mb-8">
              <Activity className="w-6 h-6 text-cyan-400" />
              <h3 className="text-2xl font-bold text-white tracking-tight">Consumption Guide</h3>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
              {[
                { label: 'Level', value: result.usage.level, icon: TrendingUp },
                { label: 'Frequency', value: result.usage.frequency, icon: Clock },
                { label: 'Quantity', value: result.usage.quantity, icon: Activity },
                { label: 'Impact', value: result.usage.impact, icon: Zap },
              ].map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  whileHover={{ scale: 1.03, boxShadow: '0 0 20px rgba(6, 182, 212, 0.3)' }}
                  className="p-5 rounded-2xl glass-card border border-white/10 group/card relative overflow-hidden"
                  style={{ backdropFilter: 'blur(16px)' }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity" />
                  <div className="relative">
                    <div className="flex items-center gap-2 mb-2">
                      <item.icon className="w-4 h-4 text-cyan-400" />
                      <p className="text-xs text-slate-400 uppercase tracking-wider">{item.label}</p>
                    </div>
                    <p className="font-semibold text-lg text-white">{item.value}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div>
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <p className="text-xs text-slate-400 uppercase tracking-wider font-medium">Recommendation Level</p>
              </div>
              <div className="relative mb-4">
                <div className="h-3 bg-gradient-to-r from-red-500 via-orange-400 via-yellow-400 to-green-500 rounded-full relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-50" />
                </div>
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.6, type: "spring", stiffness: 200, damping: 15 }}
                  className="absolute top-1/2 -translate-y-1/2 z-10"
                  style={{ left: `${levelPosition}%`, transform: 'translate(-50%, -50%)' }}
                >
                  <div className="relative">
                    <div className="absolute inset-0 w-6 h-6 bg-white rounded-full blur-lg opacity-80 animate-glow-pulse" />
                    <div className="relative w-6 h-6 bg-white rounded-full shadow-2xl ring-4 ring-white/30" />
                  </div>
                </motion.div>
              </div>
              <div className="flex justify-between px-1">
                <span className="text-xs text-slate-400">Avoid</span>
                <span className="text-xs text-slate-400">Moderate</span>
                <span className="text-xs text-slate-400">Safe</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Risks Section */}
      {result.risks.details.length > 0 && (
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="rounded-3xl glass-card glass-noise border border-orange-500/20 p-8 relative overflow-hidden group"
          style={{ background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(32px)' }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent opacity-50" />

          <div className="relative">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-xl bg-orange-500/20 border border-orange-500/30">
                <AlertTriangle className="w-6 h-6 text-orange-400" />
              </div>
              <h3 className="text-2xl font-bold text-white tracking-tight">Risk Factors</h3>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {result.risks.details.map((risk, index) => (
                <motion.div
                  key={index}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  whileHover={{ scale: 1.02, boxShadow: '0 0 30px rgba(245, 158, 11, 0.4)' }}
                  className="p-6 rounded-2xl glass-card border border-orange-500/30 relative overflow-hidden group/risk"
                  style={{ backdropFilter: 'blur(16px)' }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-transparent opacity-0 group-hover/risk:opacity-100 transition-opacity" />

                  <div className="relative">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="p-2 rounded-lg bg-orange-500/20 border border-orange-500/30 flex-shrink-0">
                        <AlertTriangle className="w-5 h-5 text-orange-400" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-orange-300 capitalize text-lg mb-2">
                          {risk.name}
                        </h4>
                        <p className="text-sm text-slate-300 mb-3 leading-relaxed">
                          {risk.description}
                        </p>
                        <div className="px-3 py-2 rounded-lg bg-orange-500/10 border border-orange-500/20">
                          <p className="text-xs text-orange-400">
                            Long-term: {risk.long_term}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Allergens Section */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="rounded-3xl glass-card glass-noise border border-white/10 p-8 relative overflow-hidden"
        style={{ background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(32px)' }}
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-xl bg-red-500/20 border border-red-500/30">
            <Heart className="w-6 h-6 text-red-400" />
          </div>
          <h3 className="text-2xl font-bold text-white tracking-tight">Allergens</h3>
        </div>

        {result.allergens.details.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-4">
            {result.allergens.details.map((allergen, index) => (
              <motion.div
                key={index}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                whileHover={{ scale: 1.02, boxShadow: '0 0 30px rgba(239, 68, 68, 0.4)' }}
                className="p-6 rounded-2xl glass-card border border-red-500/30 relative overflow-hidden group/allergen"
                style={{ backdropFilter: 'blur(16px)' }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 to-transparent opacity-0 group-hover/allergen:opacity-100 transition-opacity" />

                <div className="relative">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-red-500/20 border border-red-500/30 flex-shrink-0">
                      <Heart className="w-5 h-5 text-red-400" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-red-300 capitalize text-lg mb-2">
                        {allergen.name}
                      </h4>
                      <p className="text-sm text-slate-300 mb-2">
                        Symptoms: {allergen.symptoms}
                      </p>
                      <p className="text-xs text-slate-400">
                        {allergen.info}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex items-center gap-3 p-6 rounded-2xl glass-card border border-green-500/30"
            style={{ backdropFilter: 'blur(16px)', background: 'rgba(16, 185, 129, 0.1)' }}
          >
            <CheckCircle className="w-6 h-6 text-green-400" />
            <p className="text-green-300 font-medium text-lg">No allergens detected</p>
          </motion.div>
        )}
      </motion.div>

      {/* Recommendations Section */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="rounded-3xl glass-card glass-noise border border-white/10 p-8 relative overflow-hidden"
        style={{ background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(32px)' }}
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-xl bg-purple-500/20 border border-purple-500/30">
            <Lightbulb className="w-6 h-6 text-purple-400" />
          </div>
          <h3 className="text-2xl font-bold text-white tracking-tight">Recommendations</h3>
        </div>

        {/* Overall */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mb-8 p-6 rounded-2xl glass-card border border-purple-500/30 relative overflow-hidden group"
          style={{ backdropFilter: 'blur(16px)' }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-transparent opacity-50" />
          <div className="relative flex items-start gap-3">
            <Sparkles className="w-6 h-6 text-purple-400 flex-shrink-0 mt-1" />
            <p className="text-lg text-white font-medium leading-relaxed">
              {result.recommendations.overall}
            </p>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Do */}
          {result.recommendations.do.length > 0 && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="p-6 rounded-2xl glass-card border border-green-500/30 relative overflow-hidden group"
              style={{ backdropFilter: 'blur(16px)' }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent opacity-50" />

              <div className="relative">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-1.5 rounded-lg bg-green-500/20 border border-green-500/30">
                    <Check className="w-4 h-4 text-green-400" />
                  </div>
                  <h4 className="font-bold text-green-300 text-lg">Do</h4>
                </div>
                <ul className="space-y-3">
                  {result.recommendations.do.map((item, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-slate-300">
                      <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          )}

          {/* Avoid */}
          {result.recommendations.avoid.length > 0 && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="p-6 rounded-2xl glass-card border border-red-500/30 relative overflow-hidden group"
              style={{ backdropFilter: 'blur(16px)' }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-transparent opacity-50" />

              <div className="relative">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-1.5 rounded-lg bg-red-500/20 border border-red-500/30">
                    <X className="w-4 h-4 text-red-400" />
                  </div>
                  <h4 className="font-bold text-red-300 text-lg">Avoid</h4>
                </div>
                <ul className="space-y-3">
                  {result.recommendations.avoid.map((item, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-slate-300">
                      <X className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          )}

          {/* Alternatives */}
          {result.recommendations.alternatives.length > 0 && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="p-6 rounded-2xl glass-card border border-cyan-500/30 relative overflow-hidden group"
              style={{ backdropFilter: 'blur(16px)' }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent opacity-50" />

              <div className="relative">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-1.5 rounded-lg bg-cyan-500/20 border border-cyan-500/30">
                    <Zap className="w-4 h-4 text-cyan-400" />
                  </div>
                  <h4 className="font-bold text-cyan-300 text-lg">Alternatives</h4>
                </div>
                <ul className="space-y-3">
                  {result.recommendations.alternatives.map((item, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-slate-300">
                      <Info className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Detailed Insight */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="rounded-3xl glass-card glass-noise border border-indigo-500/20 p-8 relative overflow-hidden group"
        style={{ background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(32px)' }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent opacity-50" />

        <div className="relative">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-xl bg-indigo-500/20 border border-indigo-500/30">
              <Info className="w-6 h-6 text-indigo-400" />
            </div>
            <h3 className="text-2xl font-bold text-white tracking-tight">Detailed Insight</h3>
          </div>
          <p className="text-slate-300 leading-relaxed text-lg">
            {result.ai_explanation}
          </p>
        </div>
      </motion.div>

      {/* Extracted Text (Collapsible) */}
      {result.extracted_text && (
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="rounded-3xl glass-card glass-noise border border-white/10 overflow-hidden"
          style={{ background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(32px)' }}
        >
          <button
            onClick={() => setShowText(!showText)}
            className="w-full p-6 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Info className="w-5 h-5 text-slate-400" />
              <h3 className="text-xl font-semibold text-white">View Extracted Text</h3>
            </div>
            {showText ? (
              <ChevronUp className="w-5 h-5 text-slate-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-slate-400" />
            )}
          </button>
          {showText && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="px-6 pb-6"
            >
              <pre className="text-sm text-slate-300 whitespace-pre-wrap font-mono bg-black/30 p-6 rounded-2xl max-h-64 overflow-y-auto border border-white/5 leading-relaxed">
                {result.extracted_text}
              </pre>
            </motion.div>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}
