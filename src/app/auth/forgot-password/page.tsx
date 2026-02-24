'use client';
// ===== Forgot Password Page =====
import React, { useState } from 'react';
import Link from 'next/link';
import Logo from '@/components/ui/Logo';
import { useToast } from '@/context/ToastContext';
import { Mail, ArrowLeft, Loader2, CheckCircle, Send } from 'lucide-react';

export default function ForgotPasswordPage() {
          const [email, setEmail] = useState('');
          const [loading, setLoading] = useState(false);
          const [sent, setSent] = useState(false);
          const [error, setError] = useState('');
          const { addToast } = useToast();

          const handleSubmit = async (e: React.FormEvent) => {
                    e.preventDefault();
                    if (!email.trim() || !email.includes('@')) { setError('Ingresa un correo válido'); return; }
                    setLoading(true);
                    setError('');
                    await new Promise(r => setTimeout(r, 800));
                    setSent(true);
                    setLoading(false);
                    addToast('Instrucciones enviadas al correo.', 'success');
          };

          return (
                    <div className="min-h-screen starfield flex items-center justify-center px-4 py-12">
                              <div className="w-full max-w-md">
                                        <div className="text-center mb-8">
                                                  <div className="flex justify-center mb-4"><Logo size="lg" /></div>
                                                  <h1 className="text-2xl font-display font-bold">Recuperar contraseña</h1>
                                                  <p className="text-sm text-text-muted mt-1">Te enviaremos instrucciones por correo</p>
                                        </div>

                                        {sent ? (
                                                  <div className="orionix-card p-8 text-center animate-fade-in" style={{ transform: 'none' }}>
                                                            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-5">
                                                                      <CheckCircle className="w-8 h-8 text-emerald-400" />
                                                            </div>
                                                            <h2 className="font-display font-semibold text-lg mb-2">¡Correo enviado!</h2>
                                                            <p className="text-sm text-text-secondary mb-6 max-w-xs mx-auto">
                                                                      Hemos enviado instrucciones para restablecer tu contraseña a <span className="text-text-primary font-medium">{email}</span>. Revisa tu bandeja de entrada y spam.
                                                            </p>
                                                            <Link href="/auth/login" className="btn-primary inline-flex items-center gap-2">
                                                                      <ArrowLeft className="w-4 h-4" /> Volver al inicio de sesión
                                                            </Link>
                                                  </div>
                                        ) : (
                                                  <form onSubmit={handleSubmit} className="orionix-card p-8 space-y-5" style={{ transform: 'none' }}>
                                                            <div>
                                                                      <label htmlFor="email" className="block text-xs font-semibold text-text-secondary mb-1.5">Correo electrónico</label>
                                                                      <div className="relative">
                                                                                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" aria-hidden="true" />
                                                                                <input
                                                                                          id="email"
                                                                                          name="email"
                                                                                          type="email"
                                                                                          value={email}
                                                                                          onChange={e => { setEmail(e.target.value); setError(''); }}
                                                                                          className={`orionix-input pl-10 ${error ? 'error' : ''}`}
                                                                                          placeholder="tu@correo.com"
                                                                                          aria-invalid={!!error}
                                                                                          aria-describedby={error ? "email-error" : undefined}
                                                                                />
                                                                      </div>
                                                                      {error && <p id="email-error" className="text-xs text-red-400 mt-1">{error}</p>}
                                                            </div>
                                                            <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 py-3">
                                                                      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Send className="w-4 h-4" /><span>Enviar instrucciones</span></>}
                                                            </button>
                                                  </form>
                                        )}
                                        <p className="text-center text-sm text-text-muted mt-6">
                                                  <Link href="/auth/login" className="text-nebula-400 hover:text-nebula-300 font-medium transition-colors inline-flex items-center gap-1">
                                                            <ArrowLeft className="w-3.5 h-3.5" /> Volver al inicio de sesión
                                                  </Link>
                                        </p>
                              </div>
                    </div>
          );
}
