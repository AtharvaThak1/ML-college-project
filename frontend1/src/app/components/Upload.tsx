import { useState, useRef } from 'react';
import { Upload as UploadIcon, Image as ImageIcon, Loader2, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

interface UploadProps {
  onAnalyze: (file: File, conditions: string) => void;
  isLoading: boolean;
}

export default function Upload({ onAnalyze, isLoading }: UploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [conditions, setConditions] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    if (file.type.startsWith('image/')) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    if (selectedFile) {
      onAnalyze(selectedFile, conditions);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative cursor-pointer rounded-3xl transition-all duration-300 glass-noise overflow-hidden group ${
          dragActive
            ? 'border-2 border-emerald-500 shadow-[0_0_40px_rgba(16,185,129,0.5)]'
            : 'border-2 border-dashed border-white/20 hover:border-emerald-500/50'
        }`}
        style={{
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(24px)',
        }}
      >
        {/* Animated gradient border glow */}
        <div className={`absolute inset-0 rounded-3xl transition-opacity duration-300 ${dragActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'}`}>
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 via-cyan-500 to-emerald-500 opacity-30 blur-xl animate-rotate-slow" />
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleChange}
          className="hidden"
        />

        <div className="relative p-12">
          {preview ? (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="relative"
            >
              <img
                src={preview}
                alt="Preview"
                className="w-full h-72 object-contain rounded-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-2xl" />
            </motion.div>
          ) : (
            <div className="text-center py-8">
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="relative inline-block mb-6"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-3xl blur-2xl opacity-60 animate-glow-pulse" />
                <div className="relative w-24 h-24 rounded-3xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-emerald-500/30 flex items-center justify-center backdrop-blur-xl">
                  <ImageIcon className="w-12 h-12 text-emerald-400" />
                </div>
              </motion.div>
              <h3 className="text-2xl font-semibold text-white mb-3 tracking-tight">
                Drop your food image here
              </h3>
              <p className="text-slate-400 tracking-wide">
                or click to browse
              </p>
              <div className="mt-6 flex items-center justify-center gap-2 text-sm text-emerald-400">
                <Sparkles className="w-4 h-4" />
                <span>Supports JPG, PNG, WEBP</span>
              </div>
            </div>
          )}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="rounded-3xl glass-card glass-noise p-8 border border-white/10"
        style={{
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(24px)',
        }}
      >
        <label className="block mb-3 text-white font-medium tracking-wide">
          Health Conditions <span className="text-slate-400 font-normal">(Optional)</span>
        </label>
        <input
          type="text"
          value={conditions}
          onChange={(e) => setConditions(e.target.value)}
          placeholder="e.g., diabetes, lactose intolerance"
          className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all backdrop-blur-xl"
        />
      </motion.div>

      <motion.button
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleSubmit}
        disabled={!selectedFile || isLoading}
        className="relative w-full py-5 px-8 rounded-2xl font-semibold text-white text-lg tracking-wide overflow-hidden neumorphic-btn disabled:opacity-50 disabled:cursor-not-allowed group"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-cyan-500" />
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <div className="relative flex items-center justify-center gap-3">
          {isLoading ? (
            <>
              <Loader2 className="w-6 h-6 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <UploadIcon className="w-6 h-6" />
              Analyze Food
            </>
          )}
        </div>
      </motion.button>
    </div>
  );
}
