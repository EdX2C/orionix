'use client';
// ===== Teacher: Professional Profile Page =====
import React, { useState, useEffect } from 'react';
import { ActivityItem } from '@/components/ui/ActivityFeed';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { courseService } from '@/services';
import { Course } from '@/types';
import { DashboardSkeleton } from '@/components/ui/Skeleton';
import { activityService } from '@/services/activityService';
import ActivityFeed from '@/components/ui/ActivityFeed';
import {
          User, Mail, Calendar, BookOpen, Users, Star, TrendingUp,
          Edit3, Save, X, Award, BarChart3, GraduationCap, Sparkles
} from 'lucide-react';

export default function TeacherProfilePage() {
          const { user } = useAuth();
          const { addToast } = useToast();
          const [courses, setCourses] = useState<Course[]>([]);
          const [loading, setLoading] = useState(true);
          const [editing, setEditing] = useState(false);
          const [bio, setBio] = useState('Docente apasionado por la enseñanza y la tecnología. Comprometido con la formación de la próxima generación de profesionales.');
          const [editBio, setEditBio] = useState('');
          const [recentActivities, setRecentActivities] = useState<ActivityItem[]>([]);

          useEffect(() => {
                    courseService.list().then(c => {
                              setCourses(c);
                              setLoading(false);
                    });
                    activityService.getRecent(5).then(setRecentActivities);
          }, []);

          if (loading || !user) return <DashboardSkeleton />;

          const myCourses = courses.filter(c => c.teacherId === user.id || c.teacherName === user.name);
          const published = myCourses.filter(c => c.status === 'published');
          const drafts = myCourses.filter(c => c.status === 'draft');
          const totalStudents = published.reduce((a, c) => a + c.enrolled, 0);
          const avgRating = published.filter(c => c.rating).length > 0
                    ? (published.reduce((a, c) => a + (c.rating || 0), 0) / published.filter(c => c.rating).length).toFixed(1)
                    : '—';


          const handleSaveBio = () => {
                    setBio(editBio);
                    setEditing(false);
                    addToast('Biografía actualizada', 'success');
          };

          const stats = [
                    { icon: BookOpen, label: 'Cursos publicados', value: published.length, color: 'text-nebula-400', bg: 'bg-nebula-500/10 border-nebula-500/20' },
                    { icon: Users, label: 'Estudiantes totales', value: totalStudents, color: 'text-astral-400', bg: 'bg-astral-500/10 border-astral-500/20' },
                    { icon: Star, label: 'Rating promedio', value: avgRating, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
                    { icon: TrendingUp, label: 'Borradores activos', value: drafts.length, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
          ];

          return (
                    <div className="space-y-6 animate-fade-in">
                              {/* ── Profile Header Card ── */}
                              <div className="orionix-card p-0 overflow-hidden" style={{ transform: 'none' }}>
                                        <div className="h-32 bg-gradient-to-r from-nebula-600/30 via-astral-600/20 to-nebula-600/10 relative">
                                                  <div className="absolute inset-0 opacity-[0.03]" style={{
                                                            backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
                                                            backgroundSize: '24px 24px'
                                                  }} />
                                        </div>
                                        <div className="px-6 pb-6 -mt-12 relative">
                                                  <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
                                                            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-nebula-500 to-astral-500 flex items-center justify-center border-4 border-[var(--color-surface-card)] shadow-xl">
                                                                      <span className="text-3xl font-display font-bold text-white">{user.name.charAt(0)}</span>
                                                            </div>
                                                            <div className="flex-1">
                                                                      <div className="flex items-center gap-2 mb-1">
                                                                                <h1 className="text-xl font-display font-bold text-text-primary">{user.name}</h1>
                                                                                <span className="badge badge-nebula flex items-center gap-1"><GraduationCap className="w-3 h-3" /> Docente</span>
                                                                      </div>
                                                                      <p className="text-sm text-text-muted flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" /> {user.email}</p>
                                                            </div>
                                                            <div className="text-xs text-text-muted flex items-center gap-1.5">
                                                                      <Calendar className="w-3.5 h-3.5" />
                                                                      Miembro desde {new Date(user.createdAt).toLocaleDateString('es', { month: 'long', year: 'numeric' })}
                                                            </div>
                                                  </div>
                                        </div>
                              </div>

                              {/* ── Teaching Stats ── */}
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        {stats.map((s, i) => (
                                                  <div key={i} className="orionix-card p-4 text-center" style={{ transform: 'none' }}>
                                                            <div className={`w-10 h-10 rounded-xl ${s.bg} border flex items-center justify-center mx-auto mb-3`}>
                                                                      <s.icon className={`w-5 h-5 ${s.color}`} />
                                                            </div>
                                                            <p className="text-xl font-display font-bold text-text-primary">{s.value}</p>
                                                            <p className="text-[10px] text-text-muted mt-0.5">{s.label}</p>
                                                  </div>
                                        ))}
                              </div>

                              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                        {/* ── Left Column: Bio + Badges ── */}
                                        <div className="lg:col-span-2 space-y-6">
                                                  {/* Bio */}
                                                  <div className="orionix-card p-6" style={{ transform: 'none' }}>
                                                            <div className="flex items-center justify-between mb-4">
                                                                      <h2 className="font-display font-semibold flex items-center gap-2"><User className="w-4 h-4 text-nebula-400" /> Biografía</h2>
                                                                      {!editing && (
                                                                                <button onClick={() => { setEditBio(bio); setEditing(true); }} className="btn-ghost text-xs flex items-center gap-1">
                                                                                          <Edit3 className="w-3.5 h-3.5" /> Editar
                                                                                </button>
                                                                      )}
                                                            </div>
                                                            {editing ? (
                                                                      <div className="space-y-3">
                                                                                <textarea value={editBio} onChange={e => setEditBio(e.target.value)}
                                                                                          className="orionix-input min-h-[100px] resize-none text-sm" placeholder="Escribe tu biografía..." />
                                                                                <div className="flex gap-2 justify-end">
                                                                                          <button onClick={() => setEditing(false)} className="btn-ghost text-xs flex items-center gap-1"><X className="w-3.5 h-3.5" /> Cancelar</button>
                                                                                          <button onClick={handleSaveBio} className="btn-primary text-xs flex items-center gap-1"><Save className="w-3.5 h-3.5" /> Guardar</button>
                                                                                </div>
                                                                      </div>
                                                            ) : (
                                                                      <p className="text-sm text-text-secondary leading-relaxed">{bio}</p>
                                                            )}
                                                  </div>

                                                  {/* Teaching Achievements */}
                                                  <div className="orionix-card p-6" style={{ transform: 'none' }}>
                                                            <h2 className="font-display font-semibold flex items-center gap-2 mb-4"><Award className="w-4 h-4 text-amber-400" /> Logros docentes</h2>
                                                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                                                      {[
                                                                                { name: 'Primer curso', desc: 'Creó su primer curso', icon: BookOpen, earned: myCourses.length > 0, color: 'emerald' },
                                                                                { name: 'Publicador', desc: 'Publicó un curso', icon: Sparkles, earned: published.length > 0, color: 'nebula' },
                                                                                { name: 'Popular', desc: '10+ estudiantes', icon: Users, earned: totalStudents >= 10, color: 'astral' },
                                                                                { name: 'Estrella', desc: 'Rating 4.5+', icon: Star, earned: parseFloat(avgRating) >= 4.5, color: 'amber' },
                                                                                { name: 'Prolífico', desc: '5+ cursos', icon: BarChart3, earned: myCourses.length >= 5, color: 'pink' },
                                                                                { name: 'Mentor', desc: '50+ estudiantes', icon: GraduationCap, earned: totalStudents >= 50, color: 'purple' },
                                                                      ].map((b, i) => (
                                                                                <div key={i} className={`rounded-xl p-3 text-center border transition-all ${b.earned
                                                                                          ? `bg-${b.color}-500/10 border-${b.color}-500/20`
                                                                                          : 'bg-surface-glass border-border-subtle opacity-40'
                                                                                          }`}>
                                                                                          <b.icon className={`w-6 h-6 mx-auto mb-1.5 ${b.earned ? `text-${b.color}-400` : 'text-text-muted'}`} strokeWidth={1.2} />
                                                                                          <p className="text-xs font-semibold text-text-primary">{b.name}</p>
                                                                                          <p className="text-[10px] text-text-muted">{b.desc}</p>
                                                                                </div>
                                                                      ))}
                                                            </div>
                                                  </div>

                                                  {/* My Courses Quick List */}
                                                  <div className="orionix-card p-6" style={{ transform: 'none' }}>
                                                            <h2 className="font-display font-semibold flex items-center gap-2 mb-4"><BookOpen className="w-4 h-4 text-astral-400" /> Mis cursos</h2>
                                                            {myCourses.length === 0 ? (
                                                                      <p className="text-sm text-text-muted">Aún no has creado ningún curso.</p>
                                                            ) : (
                                                                      <div className="space-y-2">
                                                                                {myCourses.slice(0, 5).map(c => (
                                                                                          <div key={c.id} className="flex items-center gap-3 p-3 rounded-xl bg-surface-glass hover:bg-surface-card transition-colors">
                                                                                                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-nebula-500/20 to-astral-500/10 border border-border-subtle flex items-center justify-center shrink-0">
                                                                                                              <BookOpen className="w-4 h-4 text-nebula-400" strokeWidth={1.2} />
                                                                                                    </div>
                                                                                                    <div className="flex-1 min-w-0">
                                                                                                              <p className="text-sm font-medium text-text-primary truncate">{c.title}</p>
                                                                                                              <p className="text-[10px] text-text-muted">{c.enrolled} estudiantes · {c.category}</p>
                                                                                                    </div>
                                                                                                    <span className={`badge ${c.status === 'published' ? 'badge-green' : c.status === 'draft' ? 'badge-slate' : 'badge-amber'} text-[10px]`}>
                                                                                                              {c.status === 'published' ? 'Publicado' : c.status === 'draft' ? 'Borrador' : 'Pendiente'}
                                                                                                    </span>
                                                                                          </div>
                                                                                ))}
                                                                      </div>
                                                            )}
                                                  </div>
                                        </div>

                                        {/* ── Right Column: Activity ── */}
                                        <div className="space-y-6">
                                                  <div className="orionix-card p-6" style={{ transform: 'none' }}>
                                                            <h2 className="font-display font-semibold flex items-center gap-2 mb-4"><TrendingUp className="w-4 h-4 text-emerald-400" /> Actividad reciente</h2>
                                                            <ActivityFeed activities={recentActivities} />
                                                  </div>
                                        </div>
                              </div>
                    </div>
          );
}
