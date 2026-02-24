'use client';
// ===== Student: Progress =====
import React, { useEffect, useState } from 'react';
import { reportService } from '@/services';
import { useAuth } from '@/context/AuthContext';
import { CourseProgress } from '@/types';
import { DashboardSkeleton } from '@/components/ui/Skeleton';
import { TrendingUp, Clock, BookOpen } from 'lucide-react';

export default function StudentProgressPage() {
          const { user } = useAuth();
          const [progress, setProgress] = useState<CourseProgress[]>([]);
          const [loading, setLoading] = useState(true);
          useEffect(() => { if (user) reportService.getProgress(user.id).then(p => { setProgress(p); setLoading(false); }); }, [user]);
          if (loading) return <DashboardSkeleton />;

          const avg = Math.round(progress.reduce((a, p) => a + p.percentage, 0) / (progress.length || 1));

          return (
                    <div className="space-y-8 animate-fade-in">
                              <div>
                                        <h1 className="text-2xl font-display font-bold">Mi Progreso</h1>
                                        <p className="text-sm text-text-muted mt-1">Seguimiento detallado de tu avance académico</p>
                              </div>

                              {/* Overall Summary */}
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                        <div className="stat-card flex items-center gap-4">
                                                  <div className="w-11 h-11 rounded-xl bg-nebula-500/10 border border-nebula-500/20 flex items-center justify-center">
                                                            <BookOpen className="w-5 h-5 text-nebula-400" />
                                                  </div>
                                                  <div><p className="text-xs text-text-muted">Cursos activos</p><p className="text-xl font-display font-bold">{progress.length}</p></div>
                                        </div>
                                        <div className="stat-card flex items-center gap-4">
                                                  <div className="w-11 h-11 rounded-xl bg-astral-500/10 border border-astral-500/20 flex items-center justify-center">
                                                            <TrendingUp className="w-5 h-5 text-astral-400" />
                                                  </div>
                                                  <div><p className="text-xs text-text-muted">Promedio general</p><p className="text-xl font-display font-bold">{avg}%</p></div>
                                        </div>
                                        <div className="stat-card flex items-center gap-4">
                                                  <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                                                            <Clock className="w-5 h-5 text-emerald-400" />
                                                  </div>
                                                  <div><p className="text-xs text-text-muted">Unidades completadas</p><p className="text-xl font-display font-bold">{progress.reduce((a, p) => a + p.completedUnits, 0)}</p></div>
                                        </div>
                              </div>

                              {/* Per-course progress */}
                              <div className="space-y-4">
                                        <h2 className="text-lg font-display font-semibold">Progreso por curso</h2>
                                        {progress.map(p => (
                                                  <div key={p.courseId} className="orionix-card p-6" style={{ transform: 'none' }}>
                                                            <div className="flex items-center justify-between mb-4">
                                                                      <div>
                                                                                <h3 className="font-semibold text-text-primary">{p.courseName}</h3>
                                                                                <p className="text-xs text-text-muted mt-0.5">Último acceso: {new Date(p.lastAccessed).toLocaleDateString('es', { day: 'numeric', month: 'long' })}</p>
                                                                      </div>
                                                                      {/* Circular progress indicator */}
                                                                      <div className="relative w-16 h-16">
                                                                                <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
                                                                                          <circle cx="32" cy="32" r="28" fill="none" stroke="rgba(108,92,231,0.1)" strokeWidth="5" />
                                                                                          <circle cx="32" cy="32" r="28" fill="none" stroke="url(#progressGrad)" strokeWidth="5" strokeLinecap="round"
                                                                                                    strokeDasharray={`${p.percentage * 1.76} 176`} />
                                                                                          <defs>
                                                                                                    <linearGradient id="progressGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                                                                                                              <stop offset="0%" stopColor="#6c5ce7" />
                                                                                                              <stop offset="100%" stopColor="#00cec9" />
                                                                                                    </linearGradient>
                                                                                          </defs>
                                                                                </svg>
                                                                                <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-text-primary">{p.percentage}%</span>
                                                                      </div>
                                                            </div>
                                                            <div className="flex items-center gap-4 text-xs text-text-muted mb-2">
                                                                      <span>{p.completedUnits} de {p.totalUnits} unidades completadas</span>
                                                            </div>
                                                            <div className="progress-track h-2">
                                                                      <div className="progress-fill" style={{ width: `${p.percentage}%` }} />
                                                            </div>
                                                  </div>
                                        ))}
                              </div>
                    </div>
          );
}
