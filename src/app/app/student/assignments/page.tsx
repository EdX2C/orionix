'use client';
// ===== Student: Assignments (Enhanced) =====
import React, { useEffect, useState } from 'react';
import { assignmentService } from '@/services';
import { useToast } from '@/context/ToastContext';
import { Assignment } from '@/types';
import { DashboardSkeleton } from '@/components/ui/Skeleton';
import EmptyState from '@/components/ui/EmptyState';
import {
          ClipboardList, Clock, Upload, X, Loader2, CheckCircle,
          AlertCircle, FileText, Star, Calendar, Award, BarChart3
} from 'lucide-react';

const statusOptions = ['Todas', 'assigned', 'in_progress', 'submitted', 'graded'];
const statusLabels: Record<string, string> = { assigned: 'Asignada', in_progress: 'En progreso', submitted: 'Entregada', graded: 'Calificada', Todas: 'Todas' };
const statusColors: Record<string, string> = { assigned: 'badge-amber', in_progress: 'badge-cyan', submitted: 'badge-purple', graded: 'badge-green' };
const statusIcons: Record<string, React.ReactNode> = {
          assigned: <AlertCircle className="w-4 h-4 text-amber-400" />,
          in_progress: <Clock className="w-4 h-4 text-cyan-400" />,
          submitted: <Upload className="w-4 h-4 text-purple-400" />,
          graded: <CheckCircle className="w-4 h-4 text-emerald-400" />,
};

function getDaysUntil(deadline: string): { text: string; urgent: boolean } {
          const days = Math.ceil((new Date(deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
          if (days < 0) return { text: `Venció hace ${Math.abs(days)} día${Math.abs(days) !== 1 ? 's' : ''}`, urgent: true };
          if (days === 0) return { text: 'Vence hoy', urgent: true };
          if (days === 1) return { text: 'Vence mañana', urgent: true };
          if (days <= 3) return { text: `Vence en ${days} días`, urgent: true };
          return { text: `Vence en ${days} días`, urgent: false };
}

export default function StudentAssignmentsPage() {
          const [assignments, setAssignments] = useState<Assignment[]>([]);
          const [loading, setLoading] = useState(true);
          const [filter, setFilter] = useState('Todas');
          const [submitModal, setSubmitModal] = useState<string | null>(null);
          const [submitting, setSubmitting] = useState(false);
          const [fileName, setFileName] = useState('');
          const [comment, setComment] = useState('');
          const { addToast } = useToast();

          useEffect(() => {
                    const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') setSubmitModal(null); };
                    window.addEventListener('keydown', handleEsc);
                    return () => window.removeEventListener('keydown', handleEsc);
          }, []);

          useEffect(() => {
                    assignmentService.list().then(a => { setAssignments(a); setLoading(false); });
          }, []);

          const filtered = filter === 'Todas' ? assignments : assignments.filter(a => a.status === filter);
          const counts = statusOptions.reduce((acc, s) => {
                    acc[s] = s === 'Todas' ? assignments.length : assignments.filter(a => a.status === s).length;
                    return acc;
          }, {} as Record<string, number>);

          const handleSubmit = async () => {
                    if (!submitModal) return;
                    setSubmitting(true);
                    await assignmentService.submit(submitModal, fileName, comment);
                    addToast('¡Tarea entregada exitosamente!', 'success');
                    setSubmitting(false);
                    setSubmitModal(null);
                    setFileName('');
                    setComment('');
          };

          if (loading) return <DashboardSkeleton />;

          // Calculate summary stats
          const totalGraded = assignments.filter(a => a.status === 'graded').length;
          const pending = assignments.filter(a => a.status === 'assigned' || a.status === 'in_progress').length;

          return (
                    <div className="space-y-6 animate-fade-in">
                              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                        <div>
                                                  <h1 className="text-2xl font-display font-bold">Mis Tareas</h1>
                                                  <p className="text-sm text-text-muted mt-1">Gestiona tus entregas y revisa calificaciones</p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                                  <div className="glass rounded-xl px-3 py-2 flex items-center gap-2">
                                                            <BarChart3 className="w-3.5 h-3.5 text-emerald-400" />
                                                            <span className="text-xs text-text-secondary"><strong className="text-text-primary">{totalGraded}</strong> calificadas</span>
                                                  </div>
                                                  <div className="glass rounded-xl px-3 py-2 flex items-center gap-2">
                                                            <Clock className="w-3.5 h-3.5 text-amber-400" />
                                                            <span className="text-xs text-text-secondary"><strong className="text-text-primary">{pending}</strong> pendientes</span>
                                                  </div>
                                        </div>
                              </div>

                              {/* Status filter chips with counts */}
                              <div className="flex flex-wrap gap-2">
                                        {statusOptions.map(s => (
                                                  <button key={s} onClick={() => setFilter(s)}
                                                            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${filter === s
                                                                                ? 'bg-nebula-500/20 text-nebula-300 border border-nebula-500/30'
                                                                                : 'bg-surface-glass border border-border-subtle text-text-muted hover:text-text-secondary'
                                                                      }`}>
                                                            {statusLabels[s]}
                                                            <span className={`text-[10px] px-1.5 py-0.5 rounded-md ${filter === s ? 'bg-nebula-500/20' : 'bg-surface-card'
                                                                      }`}>{counts[s]}</span>
                                                  </button>
                                        ))}
                              </div>

                              {/* Assignment cards */}
                              {filtered.length === 0 ? (
                                        <EmptyState icon="clipboard" title="Sin tareas" description={`No tienes tareas ${filter !== 'Todas' ? `con estado "${statusLabels[filter]}"` : ''}.`} />
                              ) : (
                                        <div className="space-y-3">
                                                  {filtered.map(a => {
                                                            const deadline = getDaysUntil(a.deadline);
                                                            return (
                                                                      <div key={a.id} className="orionix-card p-5 group" style={{ transform: 'none' }}>
                                                                                <div className="flex items-start gap-4">
                                                                                          {/* Status icon with colored ring */}
                                                                                          <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 mt-0.5 border ${a.status === 'graded' ? 'bg-emerald-500/10 border-emerald-500/20' :
                                                                                                              a.status === 'submitted' ? 'bg-purple-500/10 border-purple-500/20' :
                                                                                                                        a.status === 'in_progress' ? 'bg-cyan-500/10 border-cyan-500/20' :
                                                                                                                                  'bg-amber-500/10 border-amber-500/20'
                                                                                                    }`}>
                                                                                                    {statusIcons[a.status]}
                                                                                          </div>

                                                                                          <div className="flex-1 min-w-0">
                                                                                                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                                                                                                              <h3 className="font-semibold text-sm text-text-primary">{a.title}</h3>
                                                                                                              <span className={`badge ${statusColors[a.status]}`}>{statusLabels[a.status]}</span>
                                                                                                    </div>
                                                                                                    <p className="text-xs text-text-muted mb-2 flex items-center gap-1.5">
                                                                                                              <FileText className="w-3 h-3" /> {a.courseName}
                                                                                                    </p>
                                                                                                    <p className="text-sm text-text-secondary mb-3 line-clamp-2">{a.description}</p>

                                                                                                    {/* Meta row */}
                                                                                                    <div className="flex flex-wrap items-center gap-4 text-xs text-text-muted">
                                                                                                              <span className={`flex items-center gap-1 ${deadline.urgent && a.status !== 'graded' && a.status !== 'submitted' ? 'text-red-400 font-semibold' : ''}`}>
                                                                                                                        <Calendar className="w-3 h-3" />
                                                                                                                        {deadline.text}
                                                                                                              </span>
                                                                                                              <span className="flex items-center gap-1"><Award className="w-3 h-3" /> Máx: {a.maxScore} pts</span>
                                                                                                              {a.status === 'graded' && (
                                                                                                                        <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                                                                                                                                  <Star className="w-3 h-3" /> {Math.round(a.maxScore * 0.85)}/{a.maxScore} pts
                                                                                                                        </span>
                                                                                                              )}
                                                                                                    </div>

                                                                                                    {/* Grade bar for graded assignments */}
                                                                                                    {a.status === 'graded' && (
                                                                                                              <div className="mt-3 flex items-center gap-3">
                                                                                                                        <div className="flex-1 h-2 rounded-full bg-surface-glass overflow-hidden max-w-[200px]">
                                                                                                                                  <div className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400" style={{ width: '85%' }} />
                                                                                                                        </div>
                                                                                                                        <span className="text-xs font-bold text-emerald-400">85%</span>
                                                                                                              </div>
                                                                                                    )}
                                                                                          </div>

                                                                                          <div className="shrink-0">
                                                                                                    {(a.status === 'assigned' || a.status === 'in_progress') && (
                                                                                                              <button onClick={() => setSubmitModal(a.id)} className="btn-primary text-xs py-2.5 px-5 flex items-center gap-1.5 shadow-lg shadow-nebula-500/10">
                                                                                                                        <Upload className="w-3.5 h-3.5" /> Entregar
                                                                                                              </button>
                                                                                                    )}
                                                                                                    {a.status === 'submitted' && (
                                                                                                              <div className="text-center glass rounded-xl px-3 py-2">
                                                                                                                        <Clock className="w-4 h-4 text-purple-400 mx-auto mb-0.5" />
                                                                                                                        <span className="text-[10px] text-purple-400 font-medium">En revisión</span>
                                                                                                              </div>
                                                                                                    )}
                                                                                                    {a.status === 'graded' && (
                                                                                                              <div className="text-center glass rounded-xl px-3 py-2">
                                                                                                                        <CheckCircle className="w-4 h-4 text-emerald-400 mx-auto mb-0.5" />
                                                                                                                        <span className="text-[10px] text-emerald-400 font-medium">Calificada</span>
                                                                                                              </div>
                                                                                                    )}
                                                                                          </div>
                                                                                </div>
                                                                      </div>
                                                            );
                                                  })}
                                        </div>
                              )}

                              {/* Submit modal */}
                              {submitModal && (
                                        <div className="modal-overlay" onClick={() => setSubmitModal(null)}>
                                                  <div className="modal-content" onClick={e => e.stopPropagation()}>
                                                            <div className="flex items-center justify-between mb-6">
                                                                      <h2 className="text-lg font-display font-semibold flex items-center gap-2"><Upload className="w-5 h-5 text-nebula-400" /> Entregar tarea</h2>
                                                                      <button onClick={() => setSubmitModal(null)} className="text-text-muted hover:text-text-primary transition-colors"><X className="w-5 h-5" /></button>
                                                            </div>
                                                            <div className="space-y-4">
                                                                      <div>
                                                                                <label className="block text-xs font-semibold text-text-secondary mb-1.5">Archivo</label>
                                                                                <div
                                                                                          className="orionix-input flex items-center gap-3 cursor-pointer hover:border-nebula-500/30 transition-colors"
                                                                                          onClick={() => setFileName('mi_entrega.pdf')}
                                                                                >
                                                                                          <div className="w-9 h-9 rounded-lg bg-nebula-500/10 border border-nebula-500/20 flex items-center justify-center shrink-0">
                                                                                                    <Upload className="w-4 h-4 text-nebula-400" />
                                                                                          </div>
                                                                                          <span className="text-text-muted text-sm">{fileName || 'Haz clic para seleccionar archivo'}</span>
                                                                                </div>
                                                                                {fileName && <p className="text-xs text-emerald-400 mt-1.5 flex items-center gap-1"><CheckCircle className="w-3 h-3" /> {fileName}</p>}
                                                                      </div>
                                                                      <div>
                                                                                <label className="block text-xs font-semibold text-text-secondary mb-1.5">Comentario (opcional)</label>
                                                                                <textarea value={comment} onChange={e => setComment(e.target.value)} className="orionix-input min-h-[80px] resize-none" placeholder="Agrega un comentario sobre tu entrega..." />
                                                                      </div>
                                                                      <button onClick={handleSubmit} disabled={submitting} className="btn-primary w-full flex items-center justify-center gap-2 py-3">
                                                                                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Upload className="w-4 h-4" /> Enviar entrega</>}
                                                                      </button>
                                                            </div>
                                                  </div>
                                        </div>
                              )}
                    </div>
          );
}
