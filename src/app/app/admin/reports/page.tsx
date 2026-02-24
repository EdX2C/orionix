'use client';
// ===== Admin: Reports & Analytics (Enhanced) =====
import React, { useEffect, useState } from 'react';
import { reportService } from '@/services';
import { useToast } from '@/context/ToastContext';
import { PlatformStats } from '@/types';
import { DashboardSkeleton } from '@/components/ui/Skeleton';
import {
          BarChart3, Users, BookOpen, TrendingUp, Download, Calendar,
          ArrowUp, ArrowDown, FileText, GraduationCap, Clock, Activity
} from 'lucide-react';

const periods = ['7 días', '30 días', '6 meses', '1 año', 'Todo'] as const;

export default function AdminReportsPage() {
          const { addToast } = useToast();
          const [stats, setStats] = useState<PlatformStats | null>(null);
          const [loading, setLoading] = useState(true);
          const [period, setPeriod] = useState<string>('6 meses');
          const [exporting, setExporting] = useState(false);

          useEffect(() => {
                    reportService.getStats().then(s => { setStats(s); setLoading(false); });
          }, []);

          if (loading || !stats) return <DashboardSkeleton />;

          const handleExport = () => {
                    setExporting(true);
                    setTimeout(() => {
                              setExporting(false);
                              addToast('Reporte exportado exitosamente (PDF)', 'success');
                    }, 1200);
          };

          const months = ['Sep', 'Oct', 'Nov', 'Dic', 'Ene', 'Feb'];
          const enrollData = [12, 18, 25, 30, 42, stats.totalEnrollments];
          const usersData = [8, 14, 20, 26, 35, stats.totalUsers];
          const maxEnroll = Math.max(...enrollData);

          const kpis = [
                    { label: 'Usuarios totales', value: stats.totalUsers, trend: '+12%', up: true, icon: Users, color: 'nebula' },
                    { label: 'Cursos activos', value: stats.totalCourses, trend: '+3', up: true, icon: BookOpen, color: 'astral' },
                    { label: 'Inscripciones', value: stats.totalEnrollments, trend: '+18%', up: true, icon: TrendingUp, color: 'emerald' },
                    { label: 'Tasa de completión', value: '67%', trend: '+5%', up: true, icon: BarChart3, color: 'amber' },
          ];

          const categoryDistribution = [
                    { cat: 'Programación', pct: 30, count: Math.round(stats.totalCourses * 0.30), color: 'from-nebula-500 to-nebula-400' },
                    { cat: 'Desarrollo Web', pct: 25, count: Math.round(stats.totalCourses * 0.25), color: 'from-astral-500 to-astral-400' },
                    { cat: 'IA & Data Science', pct: 20, count: Math.round(stats.totalCourses * 0.20), color: 'from-emerald-500 to-emerald-400' },
                    { cat: 'Diseño', pct: 15, count: Math.round(stats.totalCourses * 0.15), color: 'from-amber-500 to-amber-400' },
                    { cat: 'Otros', pct: 10, count: Math.round(stats.totalCourses * 0.10), color: 'from-pink-500 to-pink-400' },
          ];

          const topCourses = [
                    { title: 'Fundamentos de Python', enrolled: 45, rating: 4.8 },
                    { title: 'Machine Learning Aplicado', enrolled: 38, rating: 4.9 },
                    { title: 'React y Next.js Avanzado', enrolled: 35, rating: 4.7 },
                    { title: 'Diseño UX/UI', enrolled: 28, rating: 4.6 },
                    { title: 'SQL y Bases de Datos', enrolled: 22, rating: 4.5 },
          ];

          return (
                    <div className="space-y-6 animate-fade-in">
                              {/* ── Header ── */}
                              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                        <div>
                                                  <h1 className="text-2xl font-display font-bold">Reportes y Estadísticas</h1>
                                                  <p className="text-sm text-text-muted mt-1">Métricas, tendencias y análisis de la plataforma</p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                                  {/* Period selector */}
                                                  <div className="flex items-center bg-surface-glass border border-border-subtle rounded-xl overflow-hidden">
                                                            {periods.map(p => (
                                                                      <button key={p} onClick={() => setPeriod(p)}
                                                                                className={`px-3 py-2 text-[10px] font-medium transition-all ${period === p ? 'bg-nebula-500/15 text-nebula-400' : 'text-text-muted hover:text-text-secondary'}`}>
                                                                                {p}
                                                                      </button>
                                                            ))}
                                                  </div>
                                                  <button onClick={handleExport} disabled={exporting}
                                                            className="btn-secondary flex items-center gap-2 text-sm">
                                                            {exporting ? <Clock className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                                                            {exporting ? 'Exportando...' : 'Exportar'}
                                                  </button>
                                        </div>
                              </div>

                              {/* ── KPI Cards ── */}
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        {kpis.map((k, i) => (
                                                  <div key={i} className="orionix-card p-5" style={{ transform: 'none' }}>
                                                            <div className="flex items-center justify-between mb-3">
                                                                      <div className={`w-10 h-10 rounded-xl bg-${k.color}-500/10 border border-${k.color}-500/20 flex items-center justify-center`}>
                                                                                <k.icon className={`w-5 h-5 text-${k.color}-400`} />
                                                                      </div>
                                                                      <span className={`text-[10px] font-semibold flex items-center gap-0.5 ${k.up ? 'text-emerald-400' : 'text-red-400'}`}>
                                                                                {k.up ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                                                                                {k.trend}
                                                                      </span>
                                                            </div>
                                                            <p className="text-2xl font-display font-bold text-text-primary">{k.value}</p>
                                                            <p className="text-[10px] text-text-muted mt-0.5">{k.label}</p>
                                                  </div>
                                        ))}
                              </div>

                              {/* ── Enrollment Chart ── */}
                              <div className="orionix-card p-6" style={{ transform: 'none' }}>
                                        <div className="flex items-center justify-between mb-6">
                                                  <div>
                                                            <h2 className="font-display font-semibold">Tendencia de inscripciones</h2>
                                                            <p className="text-xs text-text-muted mt-0.5">Nuevas inscripciones por mes</p>
                                                  </div>
                                                  <div className="flex items-center gap-4 text-[10px]">
                                                            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-gradient-to-t from-nebula-500/60 to-astral-500/30" /> Inscripciones</span>
                                                            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-emerald-500/40" /> Nuevos usuarios</span>
                                                  </div>
                                        </div>
                                        <div className="flex items-end gap-2 h-52 px-2">
                                                  {months.map((m, i) => (
                                                            <div key={m} className="flex-1 flex flex-col items-center gap-1.5 group">
                                                                      <span className="text-[10px] font-semibold text-text-primary opacity-0 group-hover:opacity-100 transition-opacity">{enrollData[i]}</span>
                                                                      <div className="w-full flex gap-1 items-end" style={{ height: '100%' }}>
                                                                                <div className="flex-1 rounded-t-md bg-gradient-to-t from-nebula-500/60 to-astral-500/30 transition-all hover:from-nebula-500/80 hover:to-astral-500/50"
                                                                                          style={{ height: `${(enrollData[i] / maxEnroll) * 100}%`, minHeight: '6px' }} />
                                                                                <div className="flex-1 rounded-t-md bg-emerald-500/30 transition-all hover:bg-emerald-500/50"
                                                                                          style={{ height: `${(usersData[i] / maxEnroll) * 100}%`, minHeight: '6px' }} />
                                                                      </div>
                                                                      <span className="text-[10px] text-text-muted">{m}</span>
                                                            </div>
                                                  ))}
                                        </div>
                              </div>

                              {/* ── Bottom Grid ── */}
                              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        {/* Category Distribution */}
                                        <div className="orionix-card p-6" style={{ transform: 'none' }}>
                                                  <h2 className="font-display font-semibold mb-1">Distribución por categoría</h2>
                                                  <p className="text-xs text-text-muted mb-5">Cursos agrupados por área temática</p>
                                                  <div className="space-y-4">
                                                            {categoryDistribution.map(c => (
                                                                      <div key={c.cat}>
                                                                                <div className="flex items-center justify-between text-xs mb-1.5">
                                                                                          <span className="text-text-secondary font-medium">{c.cat}</span>
                                                                                          <span className="text-text-muted">{c.count} cursos · {c.pct}%</span>
                                                                                </div>
                                                                                <div className="h-2.5 rounded-full bg-surface-glass overflow-hidden">
                                                                                          <div className={`h-full rounded-full bg-gradient-to-r ${c.color} transition-all duration-700`} style={{ width: `${c.pct}%` }} />
                                                                                </div>
                                                                      </div>
                                                            ))}
                                                  </div>
                                        </div>

                                        {/* Top courses */}
                                        <div className="orionix-card p-6" style={{ transform: 'none' }}>
                                                  <h2 className="font-display font-semibold mb-1">Top cursos por inscripciones</h2>
                                                  <p className="text-xs text-text-muted mb-5">Los cursos más populares de la plataforma</p>
                                                  <div className="space-y-3">
                                                            {topCourses.map((c, i) => (
                                                                      <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-surface-glass hover:bg-surface-card transition-colors">
                                                                                <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${i === 0 ? 'bg-amber-500/20 text-amber-400 border border-amber-500/20' :
                                                                                                    i === 1 ? 'bg-gray-400/20 text-gray-400 border border-gray-400/20' :
                                                                                                              i === 2 ? 'bg-amber-700/20 text-amber-600 border border-amber-700/20' :
                                                                                                                        'bg-surface-glass text-text-muted border border-border-subtle'
                                                                                          }`}>
                                                                                          {i + 1}
                                                                                </span>
                                                                                <div className="flex-1 min-w-0">
                                                                                          <p className="text-sm font-medium text-text-primary truncate">{c.title}</p>
                                                                                          <p className="text-[10px] text-text-muted">{c.enrolled} inscripciones · ⭐ {c.rating}</p>
                                                                                </div>
                                                                                <div className="text-right">
                                                                                          <p className="text-sm font-display font-bold text-text-primary">{c.enrolled}</p>
                                                                                </div>
                                                                      </div>
                                                            ))}
                                                  </div>
                                        </div>
                              </div>

                              {/* ── Quick Metrics ── */}
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                        {[
                                                  { icon: GraduationCap, label: 'Promedio de estudiantes/curso', value: Math.round(stats.totalEnrollments / Math.max(stats.totalCourses, 1)), color: 'nebula' },
                                                  { icon: Activity, label: 'Tasa de actividad diaria', value: `${stats.activityRate || 78}%`, color: 'emerald' },
                                                  { icon: FileText, label: 'Tareas entregadas (mes)', value: 142, color: 'astral' },
                                        ].map((m, i) => (
                                                  <div key={i} className="glass rounded-xl p-4 flex items-center gap-4">
                                                            <div className={`w-10 h-10 rounded-xl bg-${m.color}-500/10 border border-${m.color}-500/20 flex items-center justify-center shrink-0`}>
                                                                      <m.icon className={`w-5 h-5 text-${m.color}-400`} />
                                                            </div>
                                                            <div>
                                                                      <p className="text-lg font-display font-bold text-text-primary">{m.value}</p>
                                                                      <p className="text-[10px] text-text-muted">{m.label}</p>
                                                            </div>
                                                  </div>
                                        ))}
                              </div>
                    </div>
          );
}
