import React, { createContext, useContext, useState, useCallback, useRef } from 'react';

export type ToastType = 'success' | 'info' | 'warning' | 'error';

export interface ToastAction {
  label: string;
  onClick: () => void;
}

export interface ToastItem {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  duration: number;
  action?: ToastAction;
  createdAt: number;
}

export interface ToastOptions {
  title?: string;
  duration?: number;
  action?: ToastAction;
}

export interface ToastContextValue {
  toasts: ToastItem[];
  showToast: (type: ToastType, message: string, options?: ToastOptions) => string;
  dismissToast: (id: string) => void;
  clearAllToasts: () => void;
  success: (message: string, options?: ToastOptions) => string;
  info: (message: string, options?: ToastOptions) => string;
  warning: (message: string, options?: ToastOptions) => string;
  error: (message: string, options?: ToastOptions) => string;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const toastCountRef = useRef(0);

  const dismissToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const clearAllToasts = useCallback(() => {
    setToasts([]);
  }, []);

  const showToast = useCallback((type: ToastType, message: string, options?: ToastOptions): string => {
    toastCountRef.current += 1;
    const id = `toast-${Date.now()}-${toastCountRef.current}`;
    const duration = options?.duration ?? 4000;

    const newToast: ToastItem = {
      id,
      type,
      title: options?.title,
      message,
      duration,
      action: options?.action,
      createdAt: Date.now()
    };

    setToasts(prev => {
      // Keep maximum 4 toasts on screen to prevent visual clutter
      const filtered = prev.length >= 4 ? prev.slice(prev.length - 3) : prev;
      return [...filtered, newToast];
    });

    return id;
  }, []);

  const success = useCallback((message: string, options?: ToastOptions) => {
    return showToast('success', message, options);
  }, [showToast]);

  const info = useCallback((message: string, options?: ToastOptions) => {
    return showToast('info', message, options);
  }, [showToast]);

  const warning = useCallback((message: string, options?: ToastOptions) => {
    return showToast('warning', message, options);
  }, [showToast]);

  const error = useCallback((message: string, options?: ToastOptions) => {
    return showToast('error', message, options);
  }, [showToast]);

  return (
    <ToastContext.Provider
      value={{
        toasts,
        showToast,
        dismissToast,
        clearAllToasts,
        success,
        info,
        warning,
        error
      }}
    >
      {children}
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextValue => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
