'use client';
// ===== Admin Dashboard — Smart & Contextual =====
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { reportService, courseService } from '@/services';
import { activityService } from '@/services/activityService';
import { sessionService } from '@/services/sessionService';
import { useAuth } from '@/context/AuthContext';
import { PlatformStats, Course } from '@/types';
import { ActivityItem } from '@/components/ui/ActivityFeed';
import ActivityFeed from '@/components/ui/ActivityFeed';
import { DashboardSkeleton } from '@/components/ui/Skeleton';
import {
          Users, BookOpen, TrendingUp, Activity, ArrowRight, UserPlus, FileText,
          AlertTriangle, CheckCircle, Shield, Monitor, Sparkles, Eye, Settings
} from 'lucide-react';

function getGreeting(): string {
          const h = new Date().getHours();
          if (h < 12) return 'Buenos días';
          if (h < 18) return 'Buenas tardes';
          return 'Buenas noches';
}

export default function AdminDashboard() {
          const { user } = useAuth();
          const [stats, setStats] = useState<PlatformStats | null>(null);
          const [activities, setActivities] = useState<ActivityItem[]>([]);
          const [activeSessions, setActiveSessions] = useState(0);
          const [courses, setCourses] = useState<Course[]>([]);
          const [loading, setLoading] = useState(true);

          useEffect(() => {
                    Promise.all([
                              reportService.getStats(),
                              activityService.getRecent(8),
                              sessionService.listAll(),
                              courseService.list(),
                    ]).then(([s, act, sess, c]) => {
                              setStats(s);
                              setActivities(act);
                              setActiveSessions(sess.filter((s: { status: string }) => s.status === 'active').length);
                              setCourses(c);
                              setLoading(false);
                    });
          }, []);

          if (loading || !stats) return <DashboardSkeleton />;

          const pendingCourses = courses.filter(c => c.status === 'pending');
          const publishedCourses = courses.filter(c => c.status === 'published');

          const kpis = [
                    { label: 'Usuarios activos', value: stats.totalUsers, icon: Users, color: 'text-nebula-400', bgColor: 'bg-nebula-500/10 border-nebula-500/20', trend: '+12%', trendUp: true, accent: 'stat-accent-purple' },
                    { label: 'Cursos publicados', value: publishedCourses.length, icon: BookOpen, color: 'text-astral-400', bgColor: 'bg-astral-500/10 border-astral-500/20', trend: `+${publishedCourses.length}`, trendUp: true, accent: 'stat-accent-cyan' },
                    { label: 'Sesiones activas', value: activeSessions, icon: Monitor, color: 'text-emerald-400', bgColor: 'bg-emerald-500/10 border-emerald-500/20', trend: 'En tiempo real', trendUp: true, accent: 'stat-accent-green' },
                    { label: 'Actividad diaria', value: `${stats.activityRate || 87}%`, icon: Activity, color: 'text-amber-400', bgColor: 'bg-amber-500/10 border-amber-500/20', trend: '+5%', trendUp: true, accent: 'stat-accent-amber' },
          ];

          return (
                    <div className="space-y-8 animate-fade-in">
                              {/* ── Greeting ── */}
                              <div>
                                        <h1 className="text-2xl md:text-3xl font-display font-bold">
                                                  {getGreeting()}, <span className="text-gradient">{user?.name.split(' ')[0]}</span>
                                        </h1>
                                        <p className="text-sm text-text-muted mt-1">Panel de administración de Orionix</p>
                              </div>

                              {/* ── KPI Stats with trends ── */}
                              <div data-testid="dashboard-stats" className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                        {kpis.map((k, i) => (
                                                  <div key={i} className={`stat-card-premium ${k.accent} flex items-center gap-4 group`}>
                                                            <div className={`w-11 h-11 rounded-xl ${k.bgColor} border flex items-center justify-center ${k.color} group-hover:scale-110 transition-transform`}>
                                                                      <k.icon className="w-5 h-5" strokeWidth={1.7} />
                                                            </div>
                                                            <div className="flex-1">
                                                                      <p className="text-xs text-text-muted">{k.label}</p>
                                                                      <p className="text-xl font-display font-bold">{k.value}</p>
                                                                      <p className={`text-[10px] flex items-center gap-0.5 ${k.trendUp ? 'text-emerald-400' : 'text-red-400'}`}>
                                                                                {k.trendUp ? <TrendingUp className="w-3 h-3" /> : null} {k.trend}
                                                                      </p>
                                                            </div>
                                                  </div>
                                        ))}
                              </div>

                              {/* ── Pending Approvals ── */}
                              {pendingCourses.length > 0 && (
                                        <div className="orionix-card p-5 border-l-2 border-l-amber-500" style={{ transform: 'none' }}>
                                                  <div className="flex items-center gap-3 mb-3">
                                                            <AlertTriangle className="w-5 h-5 text-amber-400" />
                                                            <h3 className="text-sm font-semibold text-text-primary">
                                                                      {pendingCourses.length} curso{pendingCourses.length > 1 ? 's' : ''} pendiente{pendingCourses.length > 1 ? 's' : ''} de aprobación
                                                            </h3>
                                                  </div>
                                                  <div className="space-y-2">
                                                            {pendingCourses.map(c => (
                                                                      <div key={c.id} className="flex items-center gap-3 py-1.5">
                                                                                <div className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
                                                                                <p className="text-sm text-text-secondary flex-1 truncate">{c.title} — <span className="text-text-muted">{c.teacherName}</span></p>
                                                                                <Link href={`/app/admin/courses`} className="text-xs text-nebula-400 hover:text-nebula-300">Revisar</Link>
                                                                      </div>
                                                            ))}
                                                  </div>
                                        </div>
                              )}

                              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                        {/* ── Activity Feed (2 cols) ── */}
                                        <div className="lg:col-span-2">
                                                  <div className="flex items-center justify-between mb-4">
                                                            <h2 className="text-lg font-display font-semibold flex items-center gap-2">
                                                                      <Sparkles className="w-5 h-5 text-astral-400" /> Actividad del sistema
                                                            </h2>
                                                  </div>
                                                  <div className="orionix-card p-5" style={{ transform: 'none' }}>
                                                            <ActivityFeed activities={activities} maxItems={8} />
                                                  </div>
                                        </div>

                                        {/* ── Quick Actions (1 col) ── */}
                                        <div>
                                                  <h2 className="text-lg font-display font-semibold mb-4 flex items-center gap-2">
                                                            <Shield className="w-5 h-5 text-nebula-400" /> Panel de control
                                                  </h2>
                                                  <div className="space-y-3">
                                                            {[
                                                                      { href: '/app/admin/users', label: 'Gestionar usuarios', desc: `${stats.totalUsers} registrados`, icon: Users, color: 'text-nebula-400', bgColor: 'bg-nebula-500/10 border-nebula-500/20' },
                                                                      { href: '/app/admin/courses', label: 'Gestionar cursos', desc: `${courses.length} total`, icon: BookOpen, color: 'text-astral-400', bgColor: 'bg-astral-500/10 border-astral-500/20' },
                                                                      { href: '/app/admin/sessions', label: 'Sesiones activas', desc: `${activeSessions} conectados`, icon: Monitor, color: 'text-emerald-400', bgColor: 'bg-emerald-500/10 border-emerald-500/20' },
                                                                      { href: '/app/admin/reports', label: 'Reportes', desc: 'Ver estadísticas', icon: FileText, color: 'text-amber-400', bgColor: 'bg-amber-500/10 border-amber-500/20' },
                                                                      { href: '/app/admin/settings', label: 'Configuración', desc: 'Ajustes del sistema', icon: Settings, color: 'text-text-secondary', bgColor: 'bg-surface-glass border-border-subtle' },
                                                            ].map(item => (
                                                                      <Link key={item.href} href={item.href} className="orionix-card p-4 flex items-center gap-4 group" style={{ transform: 'none' }}>
                                                                                <div className={`w-10 h-10 rounded-xl ${item.bgColor} border flex items-center justify-center ${item.color} group-hover:scale-110 transition-transform`}>
                                                                                          <item.icon className="w-5 h-5" strokeWidth={1.5} />
                                                                                </div>
                                                                                <div className="flex-1">
                                                                                          <p className="text-sm font-semibold text-text-primary">{item.label}</p>
                                                                                          <p className="text-xs text-text-muted">{item.desc}</p>
                                                                                </div>
                                                                                <ArrowRight className="w-4 h-4 text-text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
                                                                      </Link>
                                                            ))}
                                                  </div>
                                        </div>
                              </div>

                              {/* ── Mini Stats (Bar Chart rows) ── */}
                              <div>
                                        <h2 className="text-lg font-display font-semibold mb-4 flex items-center gap-2">
                                                  <TrendingUp className="w-5 h-5 text-nebula-400" /> Distribución de usuarios
                                        </h2>
                                        <div className="orionix-card p-6" style={{ transform: 'none' }}>
                                                  {[
                                                            { label: 'Estudiantes', count: stats.studentCount || Math.round(stats.totalUsers * 0.7), pct: 70, color: 'bg-nebula-500' },
                                                            { label: 'Docentes', count: stats.teacherCount || Math.round(stats.totalUsers * 0.25), pct: 25, color: 'bg-astral-500' },
                                                            { label: 'Administradores', count: stats.adminCount || Math.round(stats.totalUsers * 0.05), pct: 5, color: 'bg-emerald-500' },
                                                  ].map(row => (
                                                            <div key={row.label} className="mb-4 last:mb-0">
                                                                      <div className="flex items-center justify-between text-sm mb-1.5">
                                                                                <span className="text-text-secondary">{row.label}</span>
                                                                                <span className="font-semibold text-text-primary">{row.count} <span className="text-text-muted font-normal text-xs">({row.pct}%)</span></span>
                                                                      </div>
                                                                      <div className="h-2 rounded-full bg-orion-800 overflow-hidden">
                                                                                <div className={`h-full rounded-full ${row.color} transition-all duration-700`} style={{ width: `${row.pct}%` }} />
                                                                      </div>
                                                            </div>
                                                  ))}
                                        </div>
                              </div>
                    </div>
          );
}
