'use client';
// ===== Orionix Toast System =====
import React, { createContext, useContext, useState, useCallback } from 'react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
          id: string;
          message: string;
          type: ToastType;
}

interface ToastContextType {
          toasts: Toast[];
          addToast: (message: string, type?: ToastType) => void;
          removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
          const [toasts, setToasts] = useState<Toast[]>([]);

          const addToast = useCallback((message: string, type: ToastType = 'info') => {
                    const id = `toast-${Date.now()}`;
                    setToasts(prev => [...prev, { id, message, type }]);
                    setTimeout(() => {
                              setToasts(prev => prev.filter(t => t.id !== id));
                    }, 4000);
          }, []);

          const removeToast = useCallback((id: string) => {
                    setToasts(prev => prev.filter(t => t.id !== id));
          }, []);

          return (
                    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
                              {children}
                              {/* Toast Container */}
                              <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
                                        {toasts.map(toast => (
                                                  <div
                                                            key={toast.id}
                                                            className={`pointer-events-auto px-5 py-3.5 rounded-xl shadow-2xl backdrop-blur-xl border text-sm font-medium animate-slide-up flex items-center gap-3 min-w-[300px] max-w-[420px]
              ${toast.type === 'success' ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-200' : ''}
              ${toast.type === 'error' ? 'bg-red-500/20 border-red-500/30 text-red-200' : ''}
              ${toast.type === 'info' ? 'bg-cyan-500/20 border-cyan-500/30 text-cyan-200' : ''}
              ${toast.type === 'warning' ? 'bg-amber-500/20 border-amber-500/30 text-amber-200' : ''}
            `}
                                                  >
                                                            <span className={`w-2 h-2 rounded-full shrink-0
              ${toast.type === 'success' ? 'bg-emerald-400' : ''}
              ${toast.type === 'error' ? 'bg-red-400' : ''}
              ${toast.type === 'info' ? 'bg-cyan-400' : ''}
              ${toast.type === 'warning' ? 'bg-amber-400' : ''}
            `} />
                                                            <span className="flex-1">{toast.message}</span>
                                                            <button
                                                                      onClick={() => removeToast(toast.id)}
                                                                      className="ml-2 opacity-60 hover:opacity-100 transition-opacity text-current"
                                                            >
                                                                      ✕
                                                            </button>
                                                  </div>
                                        ))}
                              </div>
                    </ToastContext.Provider>
          );
}

export function useToast() {
          const ctx = useContext(ToastContext);
          if (!ctx) throw new Error('useToast must be used within ToastProvider');
          return ctx;
}
