'use client';
// ===== Student Academic Profile + Badges =====
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { reportService, courseService } from '@/services';
import { activityService } from '@/services/activityService';
import { CourseProgress, Course } from '@/types';
import { ActivityItem } from '@/components/ui/ActivityFeed';
import ActivityFeed from '@/components/ui/ActivityFeed';
import { DashboardSkeleton } from '@/components/ui/Skeleton';
import {
          User, Lock, Mail, Shield, Loader2, Save, Award, Target, BookOpen,
          TrendingUp, Star, Flame, Zap, Code, Palette, Brain, Trophy, Medal,
          GraduationCap
} from 'lucide-react';

interface Badge {
          id: string;
          name: string;
          description: string;
          icon: React.ElementType;
          color: string;
          bgColor: string;
          earned: boolean;
          earnedAt?: string;
}

const allBadges: Badge[] = [
          { id: 'b1', name: 'Primer paso', description: 'Completa tu primer curso', icon: GraduationCap, color: 'text-nebula-400', bgColor: 'bg-nebula-500/15 border-nebula-500/25', earned: true, earnedAt: '2024-09-15' },
          { id: 'b2', name: 'Estudiante activo', description: 'Inicia sesión 7 días seguidos', icon: Flame, color: 'text-amber-400', bgColor: 'bg-amber-500/15 border-amber-500/25', earned: true, earnedAt: '2024-10-01' },
          { id: 'b3', name: 'Nota perfecta', description: 'Obtén 100 en una tarea', icon: Star, color: 'text-emerald-400', bgColor: 'bg-emerald-500/15 border-emerald-500/25', earned: true, earnedAt: '2024-10-12' },
          { id: 'b4', name: 'Explorador', description: 'Inscríbete en 3 cursos', icon: Target, color: 'text-astral-400', bgColor: 'bg-astral-500/15 border-astral-500/25', earned: true, earnedAt: '2024-10-20' },
          { id: 'b5', name: 'Veloz', description: 'Entrega una tarea antes de la fecha', icon: Zap, color: 'text-yellow-400', bgColor: 'bg-yellow-500/15 border-yellow-500/25', earned: false },
          { id: 'b6', name: 'Programador', description: 'Completa un curso de programación', icon: Code, color: 'text-blue-400', bgColor: 'bg-blue-500/15 border-blue-500/25', earned: false },
          { id: 'b7', name: 'Creativo', description: 'Completa un curso de diseño', icon: Palette, color: 'text-pink-400', bgColor: 'bg-pink-500/15 border-pink-500/25', earned: false },
          { id: 'b8', name: 'Maestro IA', description: 'Completa un curso de inteligencia artificial', icon: Brain, color: 'text-purple-400', bgColor: 'bg-purple-500/15 border-purple-500/25', earned: false },
];

export default function ProfilePage() {
          const { user } = useAuth();
          const { addToast } = useToast();
          const [name, setName] = useState(user?.name || '');
          const [bio, setBio] = useState(user?.bio || '');
          const [saving, setSaving] = useState(false);
          const [changingPw, setChangingPw] = useState(false);
          const [progress, setProgress] = useState<CourseProgress[]>([]);
          const [activities, setActivities] = useState<ActivityItem[]>([]);
          const [activeTab, setActiveTab] = useState<'profile' | 'academic' | 'badges'>('profile');
          const [loading, setLoading] = useState(true);

          useEffect(() => {
                    if (!user) return;
                    Promise.all([
                              reportService.getProgress(user.id),
                              activityService.getRecent(5),
                    ]).then(([p, act]) => {
                              setProgress(p);
                              setActivities(act);
                              setLoading(false);
                    });
          }, [user]);

          const handleSave = async () => {
                    setSaving(true);
                    await new Promise(r => setTimeout(r, 600));
                    addToast('Perfil actualizado correctamente.', 'success');
                    setSaving(false);
          };

          const handleChangePw = async () => {
                    setChangingPw(true);
                    await new Promise(r => setTimeout(r, 600));
                    addToast('Contraseña actualizada correctamente.', 'success');
                    setChangingPw(false);
          };

          if (!user) return null;
          if (loading) return <DashboardSkeleton />;

          const avgProgress = Math.round(progress.reduce((a, p) => a + p.percentage, 0) / (progress.length || 1));
          const earnedBadges = allBadges.filter(b => b.earned);
          const roleLabels: Record<string, string> = { student: 'Estudiante', teacher: 'Docente', admin: 'Administrador' };
          const tabs = [
                    { id: 'profile' as const, label: 'Perfil', icon: User },
                    { id: 'academic' as const, label: 'Académico', icon: TrendingUp },
                    { id: 'badges' as const, label: `Badges (${earnedBadges.length})`, icon: Award },
          ];

          return (
                    <div className="space-y-6 animate-fade-in">
                              {/* ── Header Card ── */}
                              <div className="orionix-card p-6" style={{ transform: 'none' }}>
                                        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
                                                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-nebula-500/30 to-astral-500/20 border border-border-default flex items-center justify-center text-3xl font-display font-bold text-nebula-300 shrink-0">
                                                            {user.name.charAt(0)}
                                                  </div>
                                                  <div className="text-center sm:text-left flex-1">
                                                            <h1 className="text-2xl font-display font-bold text-text-primary">{user.name}</h1>
                                                            <p className="text-sm text-text-muted">{user.email}</p>
                                                            <div className="flex flex-wrap gap-2 mt-2 justify-center sm:justify-start">
                                                                      <span className="badge badge-purple">{roleLabels[user.role]}</span>
                                                                      <span className="badge badge-slate">{progress.length} cursos</span>
                                                                      <span className="badge badge-green">{avgProgress}% progreso</span>
                                                            </div>
                                                  </div>
                                                  {/* Mini stats */}
                                                  <div className="flex gap-4 shrink-0">
                                                            <div className="text-center">
                                                                      <p className="text-xl font-display font-bold text-nebula-400">{earnedBadges.length}</p>
                                                                      <p className="text-[10px] text-text-muted">Badges</p>
                                                            </div>
                                                            <div className="text-center">
                                                                      <p className="text-xl font-display font-bold text-astral-400">{progress.length}</p>
                                                                      <p className="text-[10px] text-text-muted">Cursos</p>
                                                            </div>
                                                            <div className="text-center">
                                                                      <p className="text-xl font-display font-bold text-emerald-400">{avgProgress}%</p>
                                                                      <p className="text-[10px] text-text-muted">Progreso</p>
                                                            </div>
                                                  </div>
                                        </div>
                              </div>

                              {/* ── Tabs ── */}
                              <div className="flex gap-1 p-1 rounded-xl bg-surface-glass border border-border-subtle w-fit">
                                        {tabs.map(tab => (
                                                  <button
                                                            key={tab.id}
                                                            onClick={() => setActiveTab(tab.id)}
                                                            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold transition-all ${activeTab === tab.id
                                                                      ? 'bg-nebula-500 text-white shadow-lg shadow-nebula-500/25'
                                                                      : 'text-text-secondary hover:text-text-primary'
                                                                      }`}
                                                  >
                                                            <tab.icon className="w-3.5 h-3.5" /> {tab.label}
                                                  </button>
                                        ))}
                              </div>

                              {/* ── Profile Tab ── */}
                              {activeTab === 'profile' && (
                                        <div className="max-w-2xl space-y-6">
                                                  <div className="orionix-card p-6 space-y-5" style={{ transform: 'none' }}>
                                                            <h3 className="font-display font-semibold flex items-center gap-2"><User className="w-4 h-4 text-nebula-400" /> Información personal</h3>
                                                            <div>
                                                                      <label htmlFor="name" className="block text-xs font-semibold text-text-secondary mb-1.5">Nombre completo</label>
                                                                      <input id="name" name="name" type="text" value={name} onChange={e => setName(e.target.value)} className="orionix-input" />
                                                            </div>
                                                            <div>
                                                                      <label htmlFor="email" className="block text-xs font-semibold text-text-secondary mb-1.5">Correo electrónico</label>
                                                                      <div className="relative">
                                                                                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" aria-hidden="true" />
                                                                                <input id="email" name="email" type="email" value={user.email} disabled className="orionix-input pl-10 opacity-60 cursor-not-allowed" />
                                                                      </div>
                                                            </div>
                                                            <div>
                                                                      <label htmlFor="bio" className="block text-xs font-semibold text-text-secondary mb-1.5">Biografía</label>
                                                                      <textarea id="bio" name="bio" value={bio} onChange={e => setBio(e.target.value)} className="orionix-input min-h-[80px] resize-none" placeholder="Cuéntanos sobre ti..." />
                                                            </div>
                                                            <button onClick={handleSave} disabled={saving} className="btn-primary flex items-center gap-2">
                                                                      {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Guardar cambios
                                                            </button>
                                                  </div>

                                                  <div className="orionix-card p-6 space-y-5" style={{ transform: 'none' }}>
                                                            <h3 className="font-display font-semibold flex items-center gap-2"><Shield className="w-4 h-4 text-astral-400" /> Seguridad</h3>
                                                            <div>
                                                                      <label htmlFor="currentPassword" className="block text-xs font-semibold text-text-secondary mb-1.5">Contraseña actual</label>
                                                                      <input id="currentPassword" name="currentPassword" type="password" className="orionix-input" placeholder="••••••••" />
                                                            </div>
                                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                                      <div>
                                                                                <label htmlFor="newPassword" className="block text-xs font-semibold text-text-secondary mb-1.5">Nueva contraseña</label>
                                                                                <input id="newPassword" name="newPassword" type="password" className="orionix-input" placeholder="••••••••" />
                                                                      </div>
                                                                      <div>
                                                                                <label htmlFor="confirmPassword" className="block text-xs font-semibold text-text-secondary mb-1.5">Confirmar</label>
                                                                                <input id="confirmPassword" name="confirmPassword" type="password" className="orionix-input" placeholder="••••••••" />
                                                                      </div>
                                                            </div>
                                                            <button onClick={handleChangePw} disabled={changingPw} className="btn-secondary flex items-center gap-2">
                                                                      {changingPw ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />} Cambiar contraseña
                                                            </button>
                                                  </div>
                                        </div>
                              )}

                              {/* ── Academic Tab ── */}
                              {activeTab === 'academic' && (
                                        <div className="space-y-6">
                                                  {/* Progress overview */}
                                                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                                            <div className="stat-card text-center">
                                                                      <TrendingUp className="w-6 h-6 text-nebula-400 mx-auto mb-2" />
                                                                      <p className="text-2xl font-display font-bold">{avgProgress}%</p>
                                                                      <p className="text-xs text-text-muted">Progreso general</p>
                                                            </div>
                                                            <div className="stat-card text-center">
                                                                      <BookOpen className="w-6 h-6 text-astral-400 mx-auto mb-2" />
                                                                      <p className="text-2xl font-display font-bold">{progress.length}</p>
                                                                      <p className="text-xs text-text-muted">Cursos inscritos</p>
                                                            </div>
                                                            <div className="stat-card text-center">
                                                                      <Trophy className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
                                                                      <p className="text-2xl font-display font-bold">{progress.filter(p => p.percentage === 100).length}</p>
                                                                      <p className="text-xs text-text-muted">Cursos completados</p>
                                                            </div>
                                                  </div>

                                                  {/* Course progress */}
                                                  <div className="orionix-card p-6" style={{ transform: 'none' }}>
                                                            <h3 className="font-display font-semibold mb-4 flex items-center gap-2"><Target className="w-4 h-4 text-nebula-400" /> Progreso por curso</h3>
                                                            {progress.length === 0 ? (
                                                                      <p className="text-sm text-text-muted text-center py-4">No hay cursos inscritos aún</p>
                                                            ) : (
                                                                      <div className="space-y-4">
                                                                                {progress.map(p => (
                                                                                          <div key={p.courseId}>
                                                                                                    <div className="flex items-center justify-between text-sm mb-1.5">
                                                                                                              <span className="text-text-primary font-medium truncate">{p.courseName}</span>
                                                                                                              <span className="font-semibold text-text-primary shrink-0 ml-2">{p.percentage}%</span>
                                                                                                    </div>
                                                                                                    <div className="progress-track">
                                                                                                              <div className="progress-fill" style={{ width: `${p.percentage}%` }} />
                                                                                                    </div>
                                                                                                    <div className="flex justify-between text-[10px] text-text-muted mt-1">
                                                                                                              <span>{p.completedUnits}/{p.totalUnits} unidades</span>
                                                                                                              <span>Último acceso: {new Date(p.lastAccessed).toLocaleDateString('es', { day: 'numeric', month: 'short' })}</span>
                                                                                                    </div>
                                                                                          </div>
                                                                                ))}
                                                                      </div>
                                                            )}
                                                  </div>

                                                  {/* Activity */}
                                                  <div className="orionix-card p-6" style={{ transform: 'none' }}>
                                                            <h3 className="font-display font-semibold mb-4 flex items-center gap-2"><Flame className="w-4 h-4 text-amber-400" /> Actividad reciente</h3>
                                                            <ActivityFeed activities={activities} maxItems={5} />
                                                  </div>
                                        </div>
                              )}

                              {/* ── Badges Tab ── */}
                              {activeTab === 'badges' && (
                                        <div className="space-y-8">
                                                  {/* Earned */}
                                                  <div>
                                                            <h3 className="text-lg font-display font-semibold mb-4 flex items-center gap-2">
                                                                      <Trophy className="w-5 h-5 text-amber-400" /> Badges obtenidos ({earnedBadges.length})
                                                            </h3>
                                                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                                                      {earnedBadges.map(badge => (
                                                                                <div key={badge.id} className="orionix-card p-5 text-center group">
                                                                                          <div className={`w-14 h-14 rounded-2xl ${badge.bgColor} border flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform`}>
                                                                                                    <badge.icon className={`w-7 h-7 ${badge.color}`} />
                                                                                          </div>
                                                                                          <p className="font-semibold text-sm text-text-primary">{badge.name}</p>
                                                                                          <p className="text-[10px] text-text-muted mt-1">{badge.description}</p>
                                                                                          {badge.earnedAt && <p className="text-[10px] text-nebula-400 mt-2">🏅 {new Date(badge.earnedAt).toLocaleDateString('es', { day: 'numeric', month: 'short', year: 'numeric' })}</p>}
                                                                                </div>
                                                                      ))}
                                                            </div>
                                                  </div>

                                                  {/* Locked */}
                                                  <div>
                                                            <h3 className="text-lg font-display font-semibold mb-4 flex items-center gap-2">
                                                                      <Medal className="w-5 h-5 text-text-muted" /> Badges por obtener
                                                            </h3>
                                                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                                                      {allBadges.filter(b => !b.earned).map(badge => (
                                                                                <div key={badge.id} className="orionix-card p-5 text-center opacity-50 grayscale">
                                                                                          <div className="w-14 h-14 rounded-2xl bg-surface-glass border border-border-subtle flex items-center justify-center mx-auto mb-3">
                                                                                                    <badge.icon className="w-7 h-7 text-text-muted" />
                                                                                          </div>
                                                                                          <p className="font-semibold text-sm text-text-secondary">{badge.name}</p>
                                                                                          <p className="text-[10px] text-text-muted mt-1">{badge.description}</p>
                                                                                          <p className="text-[10px] text-text-muted mt-2">🔒 Bloqueado</p>
                                                                                </div>
                                                                      ))}
                                                            </div>
                                                  </div>
                                        </div>
                              )}

                              {/* Privacy notice */}
                              <div className="glass rounded-xl p-4 text-xs text-text-muted">
                                        <p>🔒 Tu información está protegida según nuestra <a href="/legal/privacy" className="text-nebula-400 hover:underline">Política de Privacidad</a>. Solo tú y los administradores autorizados pueden ver tu perfil completo.</p>
                              </div>
                    </div>
          );
}
