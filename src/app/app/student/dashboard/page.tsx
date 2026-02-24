'use client';
// ===== Student Dashboard — Smart & Contextual =====
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { courseService, assignmentService, reportService, notificationService } from '@/services';
import { activityService } from '@/services/activityService';
import { Course, Assignment, CourseProgress, Notification } from '@/types';
import { ActivityItem } from '@/components/ui/ActivityFeed';
import ActivityFeed from '@/components/ui/ActivityFeed';
import { useAuth } from '@/context/AuthContext';
import { DashboardSkeleton } from '@/components/ui/Skeleton';
import EmptyState from '@/components/ui/EmptyState';
import {
          BookOpen, ClipboardList, TrendingUp, Clock, ArrowRight, Calendar,
          Flame, Sparkles, Bell, Target, BookMarked
} from 'lucide-react';

function getGreeting(): string {
          const h = new Date().getHours();
          if (h < 12) return 'Buenos días';
          if (h < 18) return 'Buenas tardes';
          return 'Buenas noches';
}

export default function StudentDashboard() {
          const { user } = useAuth();
          const [courses, setCourses] = useState<Course[]>([]);
          const [assignments, setAssignments] = useState<Assignment[]>([]);
          const [progress, setProgress] = useState<CourseProgress[]>([]);
          const [activities, setActivities] = useState<ActivityItem[]>([]);
          const [notifications, setNotifications] = useState<Notification[]>([]);
          const [loading, setLoading] = useState(true);

          useEffect(() => {
                    if (!user) return;
                    Promise.all([
                              courseService.list(),
                              assignmentService.list(),
                              reportService.getProgress(user.id),
                              activityService.getRecent(5),
                              notificationService.list(user.id),
                    ]).then(([c, a, p, act, notif]) => {
                              setCourses(c.filter(x => x.status === 'published').slice(0, 3));
                              setAssignments(a.filter(x => x.status !== 'graded').slice(0, 4));
                              setProgress(p);
                              setActivities(act);
                              setNotifications(notif.filter(n => !n.isRead).slice(0, 3));
                              setLoading(false);
                    });
          }, [user]);

          if (loading) return <DashboardSkeleton />;

          const avgProgress = Math.round(progress.reduce((a, p) => a + p.percentage, 0) / (progress.length || 1));
          const pendingCount = assignments.filter(a => a.status === 'assigned').length;
          const nextDeadline = assignments.length > 0
                    ? new Date(assignments[0].deadline).toLocaleDateString('es', { day: 'numeric', month: 'short' })
                    : '—';

          const stats = [
                    { label: 'Cursos activos', value: progress.length, icon: BookOpen, color: 'text-nebula-400', bgColor: 'bg-nebula-500/10 border-nebula-500/20', accent: 'stat-accent-purple' },
                    { label: 'Tareas pendientes', value: pendingCount, icon: ClipboardList, color: 'text-astral-400', bgColor: 'bg-astral-500/10 border-astral-500/20', accent: 'stat-accent-cyan' },
                    { label: 'Progreso general', value: `${avgProgress}%`, icon: TrendingUp, color: 'text-emerald-400', bgColor: 'bg-emerald-500/10 border-emerald-500/20', accent: 'stat-accent-green' },
                    { label: 'Próxima entrega', value: nextDeadline, icon: Calendar, color: 'text-amber-400', bgColor: 'bg-amber-500/10 border-amber-500/20', accent: 'stat-accent-amber' },
          ];

          return (
                    <div className="space-y-8 animate-fade-in">
                              {/* ── Greeting ── */}
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                        <div>
                                                  <h1 className="text-2xl md:text-3xl font-display font-bold">
                                                            {getGreeting()}, <span className="text-gradient">{user?.name.split(' ')[0]}</span> 👋
                                                  </h1>
                                                  <p className="text-sm text-text-muted mt-1">
                                                            {pendingCount > 0
                                                                      ? `Tienes ${pendingCount} tarea${pendingCount > 1 ? 's' : ''} pendiente${pendingCount > 1 ? 's' : ''} por entregar.`
                                                                      : '¡Estás al día! No tienes tareas pendientes.'}
                                                  </p>
                                        </div>
                                        {avgProgress >= 70 && (
                                                  <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                                                            <Flame className="w-4 h-4 text-emerald-400" />
                                                            <span className="text-xs font-semibold text-emerald-400">¡Excelente racha!</span>
                                                  </div>
                                        )}
                              </div>

                              {/* ── KPI Stats ── */}
                              <div data-testid="dashboard-stats" className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                        {stats.map((s, i) => (
                                                  <div key={i} className={`stat-card-premium ${s.accent} flex items-center gap-4 group`}>
                                                            <div className={`w-11 h-11 rounded-xl ${s.bgColor} border flex items-center justify-center ${s.color} group-hover:scale-110 transition-transform`}>
                                                                      <s.icon className="w-5 h-5" strokeWidth={1.7} />
                                                            </div>
                                                            <div>
                                                                      <p className="text-xs text-text-muted">{s.label}</p>
                                                                      <p className="text-xl font-display font-bold">{s.value}</p>
                                                            </div>
                                                  </div>
                                        ))}
                              </div>

                              {/* ── Alerts / Notifications ── */}
                              {notifications.length > 0 && (
                                        <div className="orionix-card p-5 border-l-2 border-l-nebula-500" style={{ transform: 'none' }}>
                                                  <div className="flex items-center gap-2 mb-3">
                                                            <Bell className="w-4 h-4 text-nebula-400" />
                                                            <h3 className="text-sm font-semibold">Notificaciones recientes</h3>
                                                  </div>
                                                  <div className="space-y-2">
                                                            {notifications.map(n => (
                                                                      <div key={n.id} className="flex items-start gap-3 py-1.5">
                                                                                <div className="w-2 h-2 rounded-full bg-nebula-400 mt-1.5 shrink-0" />
                                                                                <div className="min-w-0">
                                                                                          <p className="text-sm text-text-primary">{n.title}</p>
                                                                                          <p className="text-xs text-text-muted line-clamp-1">{n.message}</p>
                                                                                </div>
                                                                      </div>
                                                            ))}
                                                  </div>
                                                  <Link href={`/app/student/notifications`} className="text-xs text-nebula-400 hover:text-nebula-300 flex items-center gap-1 mt-3">
                                                            Ver todas <ArrowRight className="w-3 h-3" />
                                                  </Link>
                                        </div>
                              )}

                              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                        {/* ── Progress Section (2 cols) ── */}
                                        <div className="lg:col-span-2 space-y-4">
                                                  <div className="flex items-center justify-between">
                                                            <h2 className="text-lg font-display font-semibold flex items-center gap-2">
                                                                      <Target className="w-5 h-5 text-nebula-400" /> Mi progreso
                                                            </h2>
                                                            <Link href="/app/student/progress" className="text-xs text-nebula-400 hover:text-nebula-300 flex items-center gap-1">Ver todo <ArrowRight className="w-3 h-3" /></Link>
                                                  </div>
                                                  {progress.length === 0 ? (
                                                            <EmptyState icon="book" title="Sin cursos activos" description="Inscríbete en un curso para comenzar a ver tu progreso." />
                                                  ) : (
                                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                                      {progress.map(p => (
                                                                                <div key={p.courseId} className="orionix-card p-5 group">
                                                                                          <h3 className="font-semibold text-sm mb-3 text-text-primary line-clamp-1">{p.courseName}</h3>
                                                                                          <div className="flex items-center justify-between text-xs text-text-muted mb-2">
                                                                                                    <span>{p.completedUnits}/{p.totalUnits} unidades</span>
                                                                                                    <span className="font-semibold text-text-primary">{p.percentage}%</span>
                                                                                          </div>
                                                                                          <div className="progress-track">
                                                                                                    <div className="progress-fill" style={{ width: `${p.percentage}%` }} />
                                                                                          </div>
                                                                                          <p className="text-[10px] text-text-muted mt-2">Último acceso: {new Date(p.lastAccessed).toLocaleDateString('es', { day: 'numeric', month: 'short' })}</p>
                                                                                </div>
                                                                      ))}
                                                            </div>
                                                  )}
                                        </div>

                                        {/* ── Activity Feed (1 col) ── */}
                                        <div>
                                                  <div className="flex items-center justify-between mb-4">
                                                            <h2 className="text-lg font-display font-semibold flex items-center gap-2">
                                                                      <Sparkles className="w-5 h-5 text-astral-400" /> Actividad
                                                            </h2>
                                                  </div>
                                                  <div className="orionix-card p-5" style={{ transform: 'none' }}>
                                                            <ActivityFeed activities={activities} maxItems={5} />
                                                  </div>
                                        </div>
                              </div>

                              {/* ── Upcoming Assignments ── */}
                              <div>
                                        <div className="flex items-center justify-between mb-4">
                                                  <h2 className="text-lg font-display font-semibold flex items-center gap-2">
                                                            <ClipboardList className="w-5 h-5 text-astral-400" /> Tareas próximas
                                                  </h2>
                                                  <Link href="/app/student/assignments" className="text-xs text-nebula-400 hover:text-nebula-300 flex items-center gap-1">Ver todas <ArrowRight className="w-3 h-3" /></Link>
                                        </div>
                                        {assignments.length === 0 ? (
                                                  <EmptyState icon="clipboard" title="Sin tareas pendientes" description="¡Estás al día con todas tus entregas!" />
                                        ) : (
                                                  <div className="space-y-3">
                                                            {assignments.map(a => {
                                                                      const statusColors: Record<string, string> = { assigned: 'badge-amber', in_progress: 'badge-cyan', submitted: 'badge-purple', graded: 'badge-green' };
                                                                      const statusLabels: Record<string, string> = { assigned: 'Asignada', in_progress: 'En progreso', submitted: 'Entregada', graded: 'Calificada' };
                                                                      const isUrgent = new Date(a.deadline).getTime() - Date.now() < 86400000 * 2;
                                                                      return (
                                                                                <div key={a.id} className={`orionix-card p-4 flex items-center gap-4 ${isUrgent ? 'border-l-2 border-l-amber-500' : ''}`}>
                                                                                          <div className="w-10 h-10 rounded-xl bg-surface-glass border border-border-subtle flex items-center justify-center shrink-0">
                                                                                                    <ClipboardList className="w-5 h-5 text-nebula-400" strokeWidth={1.5} />
                                                                                          </div>
                                                                                          <div className="flex-1 min-w-0">
                                                                                                    <p className="font-semibold text-sm text-text-primary truncate">{a.title}</p>
                                                                                                    <p className="text-xs text-text-muted">{a.courseName}</p>
                                                                                          </div>
                                                                                          <div className="flex items-center gap-3 shrink-0">
                                                                                                    <span className={`badge ${statusColors[a.status]}`}>{statusLabels[a.status]}</span>
                                                                                                    <div className="text-xs text-text-muted flex items-center gap-1 hide-mobile">
                                                                                                              <Clock className="w-3 h-3" /> {new Date(a.deadline).toLocaleDateString('es', { day: 'numeric', month: 'short' })}
                                                                                                    </div>
                                                                                          </div>
                                                                                </div>
                                                                      );
                                                            })}
                                                  </div>
                                        )}
                              </div>

                              {/* ── Recommended Courses ── */}
                              <div>
                                        <div className="flex items-center justify-between mb-4">
                                                  <h2 className="text-lg font-display font-semibold flex items-center gap-2">
                                                            <BookMarked className="w-5 h-5 text-nebula-400" /> Cursos recomendados
                                                  </h2>
                                                  <Link href="/app/student/courses" className="text-xs text-nebula-400 hover:text-nebula-300 flex items-center gap-1">Explorar todos <ArrowRight className="w-3 h-3" /></Link>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                  {courses.map(c => (
                                                            <Link key={c.id} href={`/app/student/courses/${c.id}`} className="orionix-card p-5 group">
                                                                      <div className="h-32 rounded-xl overflow-hidden border border-border-subtle mb-4 relative">
                                                                                {c.thumbnail ? (
                                                                                          <img src={c.thumbnail} alt={c.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                                                                ) : (
                                                                                          <div className="w-full h-full bg-gradient-to-br from-nebula-500/20 to-astral-500/10 flex items-center justify-center">
                                                                                                    <BookOpen className="w-10 h-10 text-nebula-400/50" strokeWidth={1} />
                                                                                          </div>
                                                                                )}
                                                                                <div className="absolute inset-0 bg-gradient-to-t from-orion-950/50 to-transparent" />
                                                                      </div>
                                                                      <div className="flex gap-2 mb-2">
                                                                                <span className="badge badge-purple">{c.level === 'beginner' ? 'Principiante' : c.level === 'intermediate' ? 'Intermedio' : 'Avanzado'}</span>
                                                                                <span className="badge badge-slate">{c.category}</span>
                                                                      </div>
                                                                      <h3 className="font-semibold text-sm text-text-primary mb-1 line-clamp-2">{c.title}</h3>
                                                                      <p className="text-xs text-text-muted mb-3 line-clamp-2">{c.shortDescription}</p>
                                                                      <div className="flex items-center justify-between text-xs text-text-muted">
                                                                                <span>{c.teacherName}</span>
                                                                                <span>{c.enrolled}/{c.capacity} inscritos</span>
                                                                      </div>
                                                            </Link>
                                                  ))}
                                        </div>
                              </div>
                    </div>
          );
}
