import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, Info, AlertTriangle, AlertCircle, X, Sparkles } from 'lucide-react';
import { useToast, ToastItem } from '../context/ToastContext';

interface ToastCardProps {
  toast: ToastItem;
  onDismiss: (id: string) => void;
}

const ToastCard: React.FC<ToastCardProps> = ({ toast, onDismiss }) => {
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (toast.duration <= 0) return;

    const intervalTime = 40;
    const step = (intervalTime / toast.duration) * 100;

    const interval = setInterval(() => {
      if (!isPaused) {
        setProgress(prev => {
          const next = prev - step;
          if (next <= 0) {
            clearInterval(interval);
            onDismiss(toast.id);
            return 0;
          }
          return next;
        });
      }
    }, intervalTime);

    return () => clearInterval(interval);
  }, [toast.id, toast.duration, isPaused, onDismiss]);

  const getTheme = () => {
    switch (toast.type) {
      case 'success':
        return {
          icon: <CheckCircle2 size={18} className="text-emerald-500 shrink-0" />,
          accentBg: 'bg-emerald-500/10',
          accentBorder: 'border-emerald-500/30',
          progressBar: 'bg-gradient-to-r from-emerald-500 to-[#C89B53]',
          defaultTitle: 'Aksi Berhasil'
        };
      case 'warning':
        return {
          icon: <AlertTriangle size={18} className="text-amber-500 shrink-0" />,
          accentBg: 'bg-amber-500/10',
          accentBorder: 'border-amber-500/30',
          progressBar: 'bg-amber-500',
          defaultTitle: 'Peringatan'
        };
      case 'error':
        return {
          icon: <AlertCircle size={18} className="text-rose-500 shrink-0" />,
          accentBg: 'bg-rose-500/10',
          accentBorder: 'border-rose-500/30',
          progressBar: 'bg-rose-500',
          defaultTitle: 'Terjadi Kendala'
        };
      case 'info':
      default:
        return {
          icon: <Sparkles size={18} className="text-[#C89B53] shrink-0" />,
          accentBg: 'bg-[#963824]/10',
          accentBorder: 'border-[#C89B53]/30',
          progressBar: 'bg-[#C89B53]',
          defaultTitle: 'Informasi'
        };
    }
  };

  const theme = getTheme();
  const displayTitle = toast.title || theme.defaultTitle;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -16, scale: 0.94 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: 24, scale: 0.95 }}
      transition={{ duration: 0.22, ease: 'easeOut' }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      role="alert"
      aria-live="polite"
      className={`relative w-full max-w-sm rounded-2xl bg-[#1C1917]/95 backdrop-blur-md text-[#FAF7F2] border ${theme.accentBorder} shadow-2xl overflow-hidden pointer-events-auto select-none`}
    >
      <div className="p-3.5 sm:p-4 flex items-start gap-3">
        {/* Leading Accent Badge */}
        <div className={`p-2 rounded-xl ${theme.accentBg} flex items-center justify-center shrink-0 mt-0.5`}>
          {theme.icon}
        </div>

        {/* Content Body */}
        <div className="flex-1 min-w-0 pr-1">
          <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
            <h4 className="font-serif font-bold text-xs sm:text-sm text-[#FAF7F2] tracking-wide">
              {displayTitle}
            </h4>
          </div>
          <p className="text-xs text-[#D5CABE] leading-relaxed break-words">
            {toast.message}
          </p>

          {/* Optional Action Button */}
          {toast.action && (
            <div className="mt-2.5">
              <button
                type="button"
                onClick={() => {
                  toast.action?.onClick();
                  onDismiss(toast.id);
                }}
                className="px-3 py-1 rounded-lg text-xs font-semibold bg-[#FAF7F2] text-[#1C1917] hover:bg-[#EAE4DC] transition-colors cursor-pointer"
              >
                {toast.action.label}
              </button>
            </div>
          )}
        </div>

        {/* Dismiss Button */}
        <button
          type="button"
          onClick={() => onDismiss(toast.id)}
          className="p-1 rounded-lg text-[#8C827A] hover:text-[#FAF7F2] hover:bg-white/10 transition-colors shrink-0 cursor-pointer min-h-[32px] min-w-[32px] flex items-center justify-center -mr-1 -mt-1"
          aria-label="Tutup notifikasi"
        >
          <X size={15} />
        </button>
      </div>

      {/* Timer Progress Bar */}
      {toast.duration > 0 && (
        <div className="h-0.5 w-full bg-white/10">
          <div
            className={`h-full ${theme.progressBar} transition-all duration-75 ease-linear`}
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </motion.div>
  );
};

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = useToast();

  return (
    <div
      aria-label="Notifikasi sistem"
      className="fixed top-20 right-3 sm:right-6 z-50 flex flex-col gap-2.5 max-w-sm w-[calc(100vw-24px)] sm:w-full pointer-events-none"
    >
      <AnimatePresence mode="popLayout">
        {toasts.map(toast => (
          <ToastCard key={toast.id} toast={toast} onDismiss={dismissToast} />
        ))}
      </AnimatePresence>
    </div>
  );
};
