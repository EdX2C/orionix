'use client';
import React from 'react';
import { AlertOctagon, RotateCcw, Home } from 'lucide-react';
import Link from 'next/link';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
          return (
                    <div className="min-h-screen flex items-center justify-center px-6 starfield" style={{ background: 'var(--color-orion-950)' }}>
                              <div className="text-center max-w-lg relative z-10 animate-fade-in">
                                        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full bg-red-500/8 blur-[100px] pointer-events-none" />

                                        <div className="relative w-24 h-24 mx-auto mb-8">
                                                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-red-500/20 to-red-600/10 border border-red-500/20" />
                                                  <div className="absolute inset-0 flex items-center justify-center">
                                                            <AlertOctagon className="w-10 h-10 text-red-400" strokeWidth={1.2} />
                                                  </div>
                                        </div>

                                        <p className="text-sm font-semibold text-red-400 tracking-widest uppercase mb-3">Error 500</p>
                                        <h1 className="text-4xl md:text-5xl font-display font-bold mb-4 text-text-primary">
                                                  Algo salió mal
                                        </h1>
                                        <p className="text-text-secondary mb-8 max-w-sm mx-auto leading-relaxed">
                                                  Ha ocurrido un error inesperado. Nuestro equipo ha sido notificado. Por favor intenta de nuevo.
                                        </p>

                                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                                  <button onClick={reset} className="btn-primary flex items-center justify-center gap-2">
                                                            <RotateCcw className="w-4 h-4" /> Intentar de nuevo
                                                  </button>
                                                  <Link href="/" className="btn-secondary flex items-center justify-center gap-2">
                                                            <Home className="w-4 h-4" /> Ir al inicio
                                                  </Link>
                                        </div>

                                        {error?.digest && (
                                                  <p className="mt-8 text-xs text-text-muted">Código de error: {error.digest}</p>
                                        )}
                              </div>
                    </div>
          );
}
