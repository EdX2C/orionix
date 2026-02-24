'use client';
// ===== Login Page =====
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Logo from '@/components/ui/Logo';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Loader2 } from 'lucide-react';

export default function LoginPage() {
          const [email, setEmail] = useState('');
          const [password, setPassword] = useState('');
          const [showPw, setShowPw] = useState(false);
          const [loading, setLoading] = useState(false);
          const [quickLoading, setQuickLoading] = useState<string | null>(null);
          const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
          const { login } = useAuth();
          const { addToast } = useToast();
          const router = useRouter();

          const validate = () => {
                    const e: typeof errors = {};
                    if (!email.trim()) e.email = 'El correo es obligatorio';
                    else if (!email.includes('@')) e.email = 'Correo no válido';
                    if (!password) e.password = 'La contraseña es obligatoria';
                    else if (password.length < 4) e.password = 'Mínimo 4 caracteres';
                    setErrors(e);
                    return Object.keys(e).length === 0;
          };

          const handleSubmit = async (e: React.FormEvent) => {
                    e.preventDefault();
                    if (!validate()) return;
                    setLoading(true);
                    try {
                              const user = await login(email, password);
                              if (user) {
                                        addToast(`¡Bienvenido/a, ${user.name}!`, 'success');
                                        router.push('/app');
                              } else {
                                        addToast('Credenciales incorrectas. Intente con un correo registrado.', 'error');
                              }
                    } catch {
                              addToast('Error al iniciar sesión.', 'error');
                    } finally {
                              setLoading(false);
                    }
          };

          const quickLogin = async (demoEmail: string, role: string) => {
                    setQuickLoading(role);
                    try {
                              const user = await login(demoEmail, 'demo1234');
                              if (user) {
                                        addToast(`¡Bienvenido/a, ${user.name}! (${role})`, 'success');
                                        router.push('/app');
                              } else {
                                        addToast('Error al cargar cuenta demo.', 'error');
                              }
                    } catch {
                              addToast('Error al iniciar sesión.', 'error');
                    } finally {
                              setQuickLoading(null);
                    }
          };

          const demoAccounts = [
                    { role: 'Admin', email: 'admin@orionix.edu', icon: '🛡️', gradient: 'from-amber-500/20 to-amber-600/10', border: 'border-amber-500/30 hover:border-amber-400/50', text: 'text-amber-300', desc: 'Panel administrativo' },
                    { role: 'Docente', email: 'elena@orionix.edu', icon: '📚', gradient: 'from-nebula-500/20 to-nebula-600/10', border: 'border-nebula-500/30 hover:border-nebula-400/50', text: 'text-nebula-300', desc: 'Gestión de cursos' },
                    { role: 'Estudiante', email: 'ana@estudiante.edu', icon: '🎓', gradient: 'from-astral-500/20 to-astral-600/10', border: 'border-astral-500/30 hover:border-astral-400/50', text: 'text-astral-300', desc: 'Vista de estudiante' },
          ];

          return (
                    <div className="min-h-screen starfield flex items-center justify-center px-4 py-12">
                              <div className="w-full max-w-md">
                                        <div className="text-center mb-8">
                                                  <div className="flex justify-center mb-4"><Logo size="lg" /></div>
                                                  <h1 className="text-2xl font-display font-bold">Iniciar sesión</h1>
                                                  <p className="text-sm text-text-muted mt-1">Accede a tu cuenta para continuar</p>
                                        </div>

                                        {/* Quick demo login buttons */}
                                        <div className="mb-6">
                                                  <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3 text-center">⚡ Acceso rápido — clic para entrar</p>
                                                  <div className="grid grid-cols-3 gap-3">
                                                            {demoAccounts.map(d => (
                                                                      <button
                                                                                key={d.role}
                                                                                data-testid={`demo-login-${d.role.toLowerCase() === 'admin' ? 'admin' : d.role.toLowerCase() === 'docente' ? 'teacher' : 'student'}`}
                                                                                onClick={() => quickLogin(d.email, d.role)}
                                                                                disabled={!!quickLoading}
                                                                                className={`relative bg-gradient-to-br ${d.gradient} border ${d.border} rounded-xl p-4 text-center transition-all hover:scale-[1.03] hover:shadow-lg active:scale-[0.98] disabled:opacity-60 disabled:cursor-wait`}
                                                                      >
                                                                                {quickLoading === d.role && (
                                                                                          <div className="absolute inset-0 flex items-center justify-center bg-orion-950/50 rounded-xl">
                                                                                                    <Loader2 className="w-5 h-5 animate-spin text-text-primary" />
                                                                                          </div>
                                                                                )}
                                                                                <span className="text-2xl block mb-1">{d.icon}</span>
                                                                                <span className={`text-sm font-display font-semibold block ${d.text}`}>{d.role}</span>
                                                                                <span className="text-[10px] text-text-muted block mt-0.5">{d.desc}</span>
                                                                      </button>
                                                            ))}
                                                  </div>
                                        </div>

                                        <div className="flex items-center gap-3 mb-6">
                                                  <div className="flex-1 h-px bg-border-subtle" />
                                                  <span className="text-xs text-text-muted">o ingresa manualmente</span>
                                                  <div className="flex-1 h-px bg-border-subtle" />
                                        </div>

                                        <form onSubmit={handleSubmit} className="orionix-card p-8 space-y-5" style={{ transform: 'none' }}>
                                                  <div>
                                                            <label htmlFor="email" className="block text-xs font-semibold text-text-secondary mb-1.5">Correo electrónico</label>
                                                            <div className="relative">
                                                                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" aria-hidden="true" />
                                                                      <input
                                                                                id="email"
                                                                                name="email"
                                                                                data-testid="login-email"
                                                                                type="email"
                                                                                value={email}
                                                                                onChange={e => { setEmail(e.target.value); setErrors(p => ({ ...p, email: undefined })); }}
                                                                                className={`orionix-input pl-10 ${errors.email ? 'error' : ''}`}
                                                                                placeholder="tu@correo.com"
                                                                                autoComplete="email"
                                                                                aria-invalid={!!errors.email}
                                                                                aria-describedby={errors.email ? "email-error" : undefined}
                                                                      />
                                                            </div>
                                                            {errors.email && <p id="email-error" className="text-xs text-red-400 mt-1">{errors.email}</p>}
                                                  </div>
                                                  <div>
                                                            <label htmlFor="password" className="block text-xs font-semibold text-text-secondary mb-1.5">Contraseña</label>
                                                            <div className="relative">
                                                                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" aria-hidden="true" />
                                                                      <input
                                                                                id="password"
                                                                                name="password"
                                                                                data-testid="login-password"
                                                                                type={showPw ? 'text' : 'password'}
                                                                                value={password}
                                                                                onChange={e => { setPassword(e.target.value); setErrors(p => ({ ...p, password: undefined })); }}
                                                                                className={`orionix-input pl-10 pr-10 ${errors.password ? 'error' : ''}`}
                                                                                placeholder="••••••••"
                                                                                autoComplete="current-password"
                                                                                aria-invalid={!!errors.password}
                                                                                aria-describedby={errors.password ? "password-error" : undefined}
                                                                      />
                                                                      <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors" aria-label={showPw ? "Ocultar contraseña" : "Mostrar contraseña"}>
                                                                                {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                                      </button>
                                                            </div>
                                                            {errors.password && <p className="text-xs text-red-400 mt-1">{errors.password}</p>}
                                                  </div>
                                                  <div className="flex justify-end">
                                                            <Link href="/auth/forgot-password" className="text-xs text-nebula-400 hover:text-nebula-300 transition-colors">¿Olvidaste tu contraseña?</Link>
                                                  </div>
                                                  <button data-testid="login-submit" type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 py-3">
                                                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><span>Iniciar sesión</span><ArrowRight className="w-4 h-4" /></>}
                                                  </button>
                                        </form>
                                        <p className="text-center text-sm text-text-muted mt-6">
                                                  ¿No tienes cuenta?{' '}
                                                  <Link href="/auth/register" className="text-nebula-400 hover:text-nebula-300 font-medium transition-colors">Regístrate</Link>
                                        </p>
                              </div>
                    </div>
          );
}
