import { createContext, useContext, useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, AlertCircle, Info } from 'lucide-react';
import { cn } from '../../utils';

const ToastContext = createContext(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}

const ICONS = {
  success: Check,
  error: AlertCircle,
  info: Info,
};

const STYLES = {
  success: 'bg-surface border-accent/40 text-foreground',
  error: 'bg-surface border-red-500/40 text-foreground',
  info: 'bg-surface border-border text-foreground',
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const idRef = useRef(1);

  const addToast = useCallback((type, message, duration = 4500) => {
    const id = idRef.current++;
    setToasts((prev) => [...prev, { id, type, message }]);
    if (duration > 0) {
      setTimeout(() => removeToast(id), duration);
    }
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const api = {
    success: (msg, dur) => addToast('success', msg, dur),
    error: (msg, dur) => addToast('error', msg, dur),
    info: (msg, dur) => addToast('info', msg, dur),
  };

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div
        className="fixed top-20 right-4 z-[100] flex flex-col gap-3 pointer-events-none"
        aria-live="polite"
        aria-atomic="true"
      >
        <AnimatePresence>
          {toasts.map((t) => {
            const Icon = ICONS[t.type];
            return (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, x: 60, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 60, scale: 0.9 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className={cn(
                  'pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl border shadow-card min-w-[280px] max-w-sm backdrop-blur-sm',
                  STYLES[t.type]
                )}
                role={t.type === 'error' ? 'alert' : 'status'}
              >
                <Icon
                  size={18}
                  className={cn(
                    'flex-shrink-0',
                    t.type === 'success' && 'text-accent',
                    t.type === 'error' && 'text-red-400',
                    t.type === 'info' && 'text-muted'
                  )}
                  aria-hidden="true"
                />
                <span className="text-sm font-sans flex-1">{t.message}</span>
                <button
                  onClick={() => removeToast(t.id)}
                  className="text-muted hover:text-foreground transition-colors"
                  aria-label="Dismiss notification"
                >
                  <X size={14} />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}