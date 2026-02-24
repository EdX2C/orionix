'use client';
import React from 'react';
import Link from 'next/link';
import { Compass, ArrowLeft, Home } from 'lucide-react';

export default function NotFound() {
          return (
                    <div className="min-h-screen flex items-center justify-center px-6 starfield" style={{ background: 'var(--color-orion-950)' }}>
                              <div className="text-center max-w-lg relative z-10 animate-fade-in">
                                        {/* Glow orb */}
                                        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full bg-nebula-500/10 blur-[100px] pointer-events-none" />

                                        <div className="relative w-24 h-24 mx-auto mb-8">
                                                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-nebula-500/20 to-astral-500/10 border border-border-default animate-pulse-glow" />
                                                  <div className="absolute inset-0 flex items-center justify-center">
                                                            <Compass className="w-10 h-10 text-nebula-400" strokeWidth={1.2} style={{ animation: 'spin-slow 8s linear infinite' }} />
                                                  </div>
                                        </div>

                                        <p className="text-sm font-semibold text-nebula-400 tracking-widest uppercase mb-3">Error 404</p>
                                        <h1 className="text-4xl md:text-5xl font-display font-bold mb-4 text-text-primary">
                                                  Página no encontrada
                                        </h1>
                                        <p className="text-text-secondary mb-8 max-w-sm mx-auto leading-relaxed">
                                                  La ruta que buscas no existe en el universo de Orionix. Puede que haya sido movida o eliminada.
                                        </p>

                                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                                  <Link href="/" className="btn-primary flex items-center justify-center gap-2">
                                                            <Home className="w-4 h-4" /> Ir al inicio
                                                  </Link>
                                                  <button onClick={() => typeof window !== 'undefined' && window.history.back()} className="btn-secondary flex items-center justify-center gap-2">
                                                            <ArrowLeft className="w-4 h-4" /> Volver atrás
                                                  </button>
                                        </div>
                              </div>
                    </div>
          );
}
