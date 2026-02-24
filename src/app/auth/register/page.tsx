'use client';
// ===== Register Page =====
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Logo from '@/components/ui/Logo';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, Loader2, GraduationCap, BookOpen, Check } from 'lucide-react';

export default function RegisterPage() {
          const [name, setName] = useState('');
          const [email, setEmail] = useState('');
          const [password, setPassword] = useState('');
          const [confirmPw, setConfirmPw] = useState('');
          const [role, setRole] = useState<'student' | 'teacher'>('student');
          const [showPw, setShowPw] = useState(false);
          const [acceptTerms, setAcceptTerms] = useState(false);
          const [loading, setLoading] = useState(false);
          const [errors, setErrors] = useState<Record<string, string>>({});
          const { register } = useAuth();
          const { addToast } = useToast();
          const router = useRouter();

          const validate = () => {
                    const e: Record<string, string> = {};
                    if (!name.trim()) e.name = 'El nombre es obligatorio';
                    if (!email.trim()) e.email = 'El correo es obligatorio';
                    else if (!email.includes('@')) e.email = 'Correo no válido';
                    if (!password) e.password = 'La contraseña es obligatoria';
                    else if (password.length < 6) e.password = 'Mínimo 6 caracteres';
                    if (password !== confirmPw) e.confirmPw = 'Las contraseñas no coinciden';
                    if (!acceptTerms) e.terms = 'Debes aceptar los términos y condiciones';
                    setErrors(e);
                    return Object.keys(e).length === 0;
          };

          const handleSubmit = async (e: React.FormEvent) => {
                    e.preventDefault();
                    if (!validate()) return;
                    setLoading(true);
                    try {
                              await register(name, email, password, role);
                              addToast('¡Registro exitoso! Bienvenido/a a Orionix.', 'success');
                              router.push('/app');
                    } catch {
                              addToast('Error al registrarse.', 'error');
                    } finally {
                              setLoading(false);
                    }
          };

          return (
                    <div className="min-h-screen starfield flex items-center justify-center px-4 py-12">
                              <div className="w-full max-w-lg">
                                        <div className="text-center mb-8">
                                                  <div className="flex justify-center mb-4"><Logo size="lg" /></div>
                                                  <h1 className="text-2xl font-display font-bold">Crear cuenta</h1>
                                                  <p className="text-sm text-text-muted mt-1">Únete a Orionix y comienza tu viaje</p>
                                        </div>

                                        <form onSubmit={handleSubmit} className={`orionix-card p-8 space-y-5 transition-all duration-500 shadow-2xl ${role === 'student' ? 'shadow-nebula-500/5 ring-1 ring-nebula-500/10 text-nebula-400' : 'shadow-astral-500/5 ring-1 ring-astral-500/10 text-astral-400'}`} style={{ transform: 'none' }}>
                                                  {/* Role selector */}
                                                  <div>
                                                            <label className="block text-xs font-semibold text-text-secondary mb-2">Tipo de cuenta</label>
                                                            <div className="grid grid-cols-2 gap-3">
                                                                      {(['student', 'teacher'] as const).map(r => (
                                                                                <button
                                                                                          key={r}
                                                                                          type="button"
                                                                                          onClick={() => setRole(r)}
                                                                                          className={`flex items-center gap-3 p-4 rounded-xl border transition-all ${role === r
                                                                                                    ? (r === 'student' ? 'border-nebula-500 bg-nebula-500/10 text-text-primary' : 'border-astral-500 bg-astral-500/10 text-text-primary')
                                                                                                    : 'border-border-subtle bg-surface-glass text-text-secondary hover:border-border-default'
                                                                                                    }`}
                                                                                >
                                                                                          {r === 'student' ? <GraduationCap className="w-5 h-5" /> : <BookOpen className="w-5 h-5" />}
                                                                                          <div className="text-left">
                                                                                                    <p className="font-semibold text-sm">{r === 'student' ? 'Estudiante' : 'Docente'}</p>
                                                                                                    <p className="text-xs text-text-muted">{r === 'student' ? 'Aprende y crece' : 'Enseña y crea'}</p>
                                                                                          </div>
                                                                                </button>
                                                                      ))}
                                                            </div>
                                                  </div>

                                                  <div>
                                                            <label htmlFor="name" className="block text-xs font-semibold text-text-secondary mb-1.5">Nombre completo</label>
                                                            <div className="relative">
                                                                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" aria-hidden="true" />
                                                                      <input
                                                                                id="name"
                                                                                name="name"
                                                                                type="text"
                                                                                value={name}
                                                                                onChange={e => setName(e.target.value)}
                                                                                className={`orionix-input pl-10 ${errors.name ? 'error' : ''}`}
                                                                                placeholder="Tu nombre"
                                                                                aria-invalid={!!errors.name}
                                                                                aria-describedby={errors.name ? "name-error" : undefined}
                                                                      />
                                                            </div>
                                                            {errors.name && <p id="name-error" className="text-xs text-red-400 mt-1">{errors.name}</p>}
                                                  </div>

                                                  <div>
                                                            <label htmlFor="email" className="block text-xs font-semibold text-text-secondary mb-1.5">Correo electrónico</label>
                                                            <div className="relative">
                                                                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" aria-hidden="true" />
                                                                      <input
                                                                                id="email"
                                                                                name="email"
                                                                                type="email"
                                                                                value={email}
                                                                                onChange={e => setEmail(e.target.value)}
                                                                                className={`orionix-input pl-10 ${errors.email ? 'error' : ''}`}
                                                                                placeholder="tu@correo.com"
                                                                                aria-invalid={!!errors.email}
                                                                                aria-describedby={errors.email ? "email-error" : undefined}
                                                                      />
                                                            </div>
                                                            {errors.email && <p id="email-error" className="text-xs text-red-400 mt-1">{errors.email}</p>}
                                                  </div>

                                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                            <div>
                                                                      <label htmlFor="password" className="block text-xs font-semibold text-text-secondary mb-1.5">Contraseña</label>
                                                                      <div className="relative">
                                                                                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" aria-hidden="true" />
                                                                                <input
                                                                                          id="password"
                                                                                          name="password"
                                                                                          type={showPw ? 'text' : 'password'}
                                                                                          value={password}
                                                                                          onChange={e => setPassword(e.target.value)}
                                                                                          className={`orionix-input pl-10 ${errors.password ? 'error' : ''}`}
                                                                                          placeholder="••••••••"
                                                                                          aria-invalid={!!errors.password}
                                                                                          aria-describedby={errors.password ? "password-error" : undefined}
                                                                                />
                                                                      </div>
                                                                      {errors.password && <p id="password-error" className="text-xs text-red-400 mt-1">{errors.password}</p>}
                                                            </div>
                                                            <div>
                                                                      <label htmlFor="confirmPw" className="block text-xs font-semibold text-text-secondary mb-1.5">Confirmar</label>
                                                                      <div className="relative">
                                                                                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" aria-hidden="true" />
                                                                                <input
                                                                                          id="confirmPw"
                                                                                          name="confirmPw"
                                                                                          type={showPw ? 'text' : 'password'}
                                                                                          value={confirmPw}
                                                                                          onChange={e => setConfirmPw(e.target.value)}
                                                                                          className={`orionix-input pl-10 pr-10 ${errors.confirmPw ? 'error' : ''}`}
                                                                                          placeholder="••••••••"
                                                                                          aria-invalid={!!errors.confirmPw}
                                                                                          aria-describedby={errors.confirmPw ? "confirmPw-error" : undefined}
                                                                                />
                                                                                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors" aria-label={showPw ? "Ocultar contraseña" : "Mostrar contraseña"}>
                                                                                          {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                                                </button>
                                                                      </div>
                                                                      {errors.confirmPw && <p id="confirmPw-error" className="text-xs text-red-400 mt-1">{errors.confirmPw}</p>}
                                                            </div>
                                                  </div>

                                                  {/* Terms */}
                                                  <div className="flex items-start gap-3">
                                                            <button
                                                                      type="button"
                                                                      onClick={() => { setAcceptTerms(!acceptTerms); setErrors(p => { const { terms, ...rest } = p; return rest; }); }}
                                                                      className={`shrink-0 w-5 h-5 rounded-md border flex items-center justify-center transition-all mt-0.5 ${acceptTerms ? (role === 'student' ? 'bg-nebula-500 border-nebula-500' : 'bg-astral-500 border-astral-500') : 'border-border-default bg-transparent'
                                                                                }`}
                                                            >
                                                                      {acceptTerms && <Check className="w-3 h-3 text-white" />}
                                                            </button>
                                                            <span className="text-xs text-text-secondary leading-relaxed">
                                                                      Acepto los{' '}
                                                                      <Link href="/legal/terms" target="_blank" className={`hover:underline transition-colors ${role === 'student' ? 'text-nebula-400' : 'text-astral-400'}`}>Términos y Condiciones</Link>
                                                                      {' '}y la{' '}
                                                                      <Link href="/legal/privacy" target="_blank" className={`hover:underline transition-colors ${role === 'student' ? 'text-nebula-400' : 'text-astral-400'}`}>Política de Privacidad</Link>
                                                            </span>
                                                  </div>
                                                  {errors.terms && <p className="text-xs text-red-400 -mt-2">{errors.terms}</p>}

                                                  <button type="submit" disabled={loading} className={`${role === 'student' ? 'btn-primary' : 'btn-accent'} w-full flex items-center justify-center gap-2 py-3 transition-colors`}>
                                                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><span>Crear cuenta</span><ArrowRight className="w-4 h-4" /></>}
                                                  </button>
                                        </form>
                                        <p className="text-center text-sm text-text-muted mt-6">
                                                  ¿Ya tienes cuenta?{' '}
                                                  <Link href="/auth/login" className={`font-medium transition-colors ${role === 'student' ? 'text-nebula-400 hover:text-nebula-300' : 'text-astral-400 hover:text-astral-300'}`}>Inicia sesión</Link>
                                        </p>
                              </div>
                    </div>
          );
}
