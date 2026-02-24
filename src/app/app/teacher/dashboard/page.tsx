'use client';
// ===== Teacher Dashboard — Smart & Contextual =====
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { courseService, assignmentService } from '@/services';
import { activityService } from '@/services/activityService';
import { useAuth } from '@/context/AuthContext';
import { Course, Assignment, Submission } from '@/types';
import { ActivityItem } from '@/components/ui/ActivityFeed';
import ActivityFeed from '@/components/ui/ActivityFeed';
import { mockSubmissions } from '@/data/assignments';
import { DashboardSkeleton } from '@/components/ui/Skeleton';
import EmptyState from '@/components/ui/EmptyState';
import {
          BookOpen, ClipboardList, Users, TrendingUp, ArrowRight, Plus, Clock, Star,
          Sparkles, Award, FileText, AlertCircle
} from 'lucide-react';

function getGreeting(): string {
          const h = new Date().getHours();
          if (h < 12) return 'Buenos días';
          if (h < 18) return 'Buenas tardes';
          return 'Buenas noches';
}

export default function TeacherDashboard() {
          const { user } = useAuth();
          const [courses, setCourses] = useState<Course[]>([]);
          const [assignments, setAssignments] = useState<Assignment[]>([]);
          const [activities, setActivities] = useState<ActivityItem[]>([]);
          const [loading, setLoading] = useState(true);

          useEffect(() => {
                    Promise.all([courseService.list(), assignmentService.list(), activityService.getRecent(5)]).then(([c, a, act]) => {
                              setCourses(c);
                              setAssignments(a);
                              setActivities(act);
                              setLoading(false);
                    });
          }, []);

          if (loading) return <DashboardSkeleton />;

          const pendingReviews = mockSubmissions.filter(s => s.status === 'submitted');
          const totalStudents = courses.reduce((acc, c) => acc + c.enrolled, 0);
          const publishedCount = courses.filter(c => c.status === 'published').length;
          const draftCount = courses.filter(c => c.status === 'draft' || c.status === 'pending').length;
          const avgRating = courses.filter(c => c.rating).reduce((a, c) => a + (c.rating || 0), 0) / (courses.filter(c => c.rating).length || 1);

          const stats = [
                    { label: 'Cursos publicados', value: publishedCount, icon: BookOpen, color: 'text-nebula-400', bgColor: 'bg-nebula-500/10 border-nebula-500/20', accent: 'stat-accent-purple' },
                    { label: 'Estudiantes totales', value: totalStudents, icon: Users, color: 'text-astral-400', bgColor: 'bg-astral-500/10 border-astral-500/20', accent: 'stat-accent-cyan' },
                    { label: 'Entregas pendientes', value: pendingReviews.length, icon: ClipboardList, color: 'text-amber-400', bgColor: 'bg-amber-500/10 border-amber-500/20', accent: 'stat-accent-amber' },
                    { label: 'Rating promedio', value: avgRating.toFixed(1), icon: Star, color: 'text-emerald-400', bgColor: 'bg-emerald-500/10 border-emerald-500/20', accent: 'stat-accent-green' },
          ];

          return (
                    <div className="space-y-8 animate-fade-in">
                              {/* ── Greeting ── */}
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                        <div>
                                                  <h1 className="text-2xl md:text-3xl font-display font-bold">
                                                            {getGreeting()}, <span className="text-gradient">{user?.name.split(' ')[0]}</span>
                                                  </h1>
                                                  <p className="text-sm text-text-muted mt-1">
                                                            {pendingReviews.length > 0
                                                                      ? `Tienes ${pendingReviews.length} entrega${pendingReviews.length > 1 ? 's' : ''} pendiente${pendingReviews.length > 1 ? 's' : ''} de revisión.`
                                                                      : 'No hay entregas pendientes. ¡Todo al día!'}
                                                  </p>
                                        </div>
                                        <Link href="/app/teacher/courses/new" className="btn-primary flex items-center gap-2 shrink-0">
                                                  <Plus className="w-4 h-4" /> Crear curso
                                        </Link>
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

                              {/* ── Draft Alert ── */}
                              {draftCount > 0 && (
                                        <div className="orionix-card p-4 flex items-center gap-4 border-l-2 border-l-amber-500" style={{ transform: 'none' }}>
                                                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                                                            <AlertCircle className="w-5 h-5 text-amber-400" />
                                                  </div>
                                                  <div className="flex-1">
                                                            <p className="text-sm font-semibold text-text-primary">Tienes {draftCount} curso{draftCount > 1 ? 's' : ''} en borrador</p>
                                                            <p className="text-xs text-text-muted">Completa y publica para que tus estudiantes puedan inscribirse.</p>
                                                  </div>
                                                  <Link href="/app/teacher/courses" className="btn-sm btn-secondary">Ir a cursos</Link>
                                        </div>
                              )}

                              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                        {/* ── Pending Reviews (2 cols) ── */}
                                        <div className="lg:col-span-2">
                                                  <div className="flex items-center justify-between mb-4">
                                                            <h2 className="text-lg font-display font-semibold flex items-center gap-2">
                                                                      <ClipboardList className="w-5 h-5 text-amber-400" /> Entregas pendientes
                                                            </h2>
                                                            <Link href="/app/teacher/assignments" className="text-xs text-nebula-400 hover:text-nebula-300 flex items-center gap-1">Ver todas <ArrowRight className="w-3 h-3" /></Link>
                                                  </div>
                                                  {pendingReviews.length === 0 ? (
                                                            <EmptyState icon="clipboard" title="Sin entregas pendientes" description="No hay entregas esperando revisión. ¡Excelente!" />
                                                  ) : (
                                                            <div className="space-y-2">
                                                                      {pendingReviews.slice(0, 5).map(s => (
                                                                                <div key={s.id} className="orionix-card p-4 flex items-center gap-4" style={{ transform: 'none' }}>
                                                                                          <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                                                                                                    <ClipboardList className="w-4 h-4 text-amber-400" />
                                                                                          </div>
                                                                                          <div className="flex-1 min-w-0">
                                                                                                    <p className="font-semibold text-sm truncate text-text-primary">{s.studentName}</p>
                                                                                                    <p className="text-xs text-text-muted">{s.fileName || 'Entrega sin archivo'}</p>
                                                                                          </div>
                                                                                          <span className="badge badge-amber">Pendiente</span>
                                                                                          <span className="text-xs text-text-muted hide-mobile">{s.submittedAt ? new Date(s.submittedAt).toLocaleDateString('es', { day: 'numeric', month: 'short' }) : ''}</span>
                                                                                </div>
                                                                      ))}
                                                            </div>
                                                  )}
                                        </div>

                                        {/* ── Activity Feed (1 col) ── */}
                                        <div>
                                                  <div className="flex items-center justify-between mb-4">
                                                            <h2 className="text-lg font-display font-semibold flex items-center gap-2">
                                                                      <Sparkles className="w-5 h-5 text-astral-400" /> Actividad reciente
                                                            </h2>
                                                  </div>
                                                  <div className="orionix-card p-5" style={{ transform: 'none' }}>
                                                            <ActivityFeed activities={activities} maxItems={5} />
                                                  </div>
                                        </div>
                              </div>

                              {/* ── Quick Actions ── */}
                              <div>
                                        <h2 className="text-lg font-display font-semibold mb-4 flex items-center gap-2">
                                                  <TrendingUp className="w-5 h-5 text-nebula-400" /> Acciones rápidas
                                        </h2>
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                                  <Link href="/app/teacher/courses/new" className="orionix-card p-5 flex items-center gap-4 group">
                                                            <div className="w-11 h-11 rounded-xl bg-nebula-500/10 border border-nebula-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                                                                      <Plus className="w-5 h-5 text-nebula-400" />
                                                            </div>
                                                            <div>
                                                                      <p className="font-semibold text-sm text-text-primary">Nuevo curso</p>
                                                                      <p className="text-xs text-text-muted">Crear y publicar contenido</p>
                                                            </div>
                                                  </Link>
                                                  <Link href="/app/teacher/assignments" className="orionix-card p-5 flex items-center gap-4 group">
                                                            <div className="w-11 h-11 rounded-xl bg-astral-500/10 border border-astral-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                                                                      <FileText className="w-5 h-5 text-astral-400" />
                                                            </div>
                                                            <div>
                                                                      <p className="font-semibold text-sm text-text-primary">Revisar tareas</p>
                                                                      <p className="text-xs text-text-muted">{pendingReviews.length} pendientes</p>
                                                            </div>
                                                  </Link>
                                                  <Link href="/app/teacher/students" className="orionix-card p-5 flex items-center gap-4 group">
                                                            <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                                                                      <Users className="w-5 h-5 text-emerald-400" />
                                                            </div>
                                                            <div>
                                                                      <p className="font-semibold text-sm text-text-primary">Mis estudiantes</p>
                                                                      <p className="text-xs text-text-muted">{totalStudents} inscritos</p>
                                                            </div>
                                                  </Link>
                                        </div>
                              </div>

                              {/* ── My Courses ── */}
                              <div>
                                        <div className="flex items-center justify-between mb-4">
                                                  <h2 className="text-lg font-display font-semibold flex items-center gap-2">
                                                            <BookOpen className="w-5 h-5 text-nebula-400" /> Mis cursos
                                                  </h2>
                                                  <Link href="/app/teacher/courses" className="text-xs text-nebula-400 hover:text-nebula-300 flex items-center gap-1">Ver todos <ArrowRight className="w-3 h-3" /></Link>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                  {courses.slice(0, 3).map(c => {
                                                            const statusLabels: Record<string, string> = { draft: 'Borrador', pending: 'Pendiente', published: 'Publicado', archived: 'Archivado' };
                                                            const statusColors: Record<string, string> = { draft: 'badge-slate', pending: 'badge-amber', published: 'badge-green', archived: 'badge-red' };
                                                            return (
                                                                      <Link key={c.id} href={`/app/teacher/courses/${c.id}`} className="orionix-card p-5 group">
                                                                                <div className="flex items-center gap-2 mb-3">
                                                                                          <span className={`badge ${statusColors[c.status]}`}>{statusLabels[c.status]}</span>
                                                                                          <span className="badge badge-purple">{c.level === 'beginner' ? 'Principiante' : c.level === 'intermediate' ? 'Intermedio' : 'Avanzado'}</span>
                                                                                </div>
                                                                                <h3 className="font-semibold text-sm text-text-primary mb-1 line-clamp-2">{c.title}</h3>
                                                                                <p className="text-xs text-text-muted mb-3 line-clamp-2">{c.shortDescription}</p>
                                                                                <div className="flex items-center justify-between text-xs text-text-muted">
                                                                                          <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {c.enrolled}/{c.capacity}</span>
                                                                                          {c.rating && <span className="flex items-center gap-1"><Star className="w-3 h-3 text-amber-400" /> {c.rating}</span>}
                                                                                </div>
                                                                      </Link>
                                                            );
                                                  })}
                                        </div>
                              </div>
                    </div>
          );
}
