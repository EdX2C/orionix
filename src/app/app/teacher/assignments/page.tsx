'use client';
// ===== Teacher: Assignments (Enhanced with Rubric & Grade Panel) =====
import React, { useEffect, useState } from 'react';
import { assignmentService } from '@/services';
import { useToast } from '@/context/ToastContext';
import { Assignment, Submission } from '@/types';
import { mockSubmissions } from '@/data/assignments';
import { DashboardSkeleton } from '@/components/ui/Skeleton';
import EmptyState from '@/components/ui/EmptyState';
import Link from 'next/link';
import {
          ClipboardList, Clock, Plus, X, Star, Loader2, Check, FileText,
          Users, CheckCircle, AlertCircle, Award, BarChart3, Calendar
} from 'lucide-react';

const statusLabels: Record<string, string> = { assigned: 'Asignada', in_progress: 'En progreso', submitted: 'Entregada', graded: 'Calificada' };
const statusColors: Record<string, string> = { assigned: 'badge-amber', in_progress: 'badge-cyan', submitted: 'badge-purple', graded: 'badge-green' };

const rubricCriteria = [
          { name: 'Funcionalidad', desc: 'El código cumple con los requisitos', weight: 40 },
          { name: 'Calidad de código', desc: 'Organización, nomenclatura y buenas prácticas', weight: 25 },
          { name: 'Documentación', desc: 'Comentarios y documentación del trabajo', weight: 20 },
          { name: 'Creatividad', desc: 'Soluciones originales y valor agregado', weight: 15 },
];

export default function TeacherAssignmentsPage() {
          const [assignments, setAssignments] = useState<Assignment[]>([]);
          const [loading, setLoading] = useState(true);
          const [selectedAssignment, setSelectedAssignment] = useState<string | null>(null);
          const [submissions, setSubmissions] = useState<Submission[]>([]);
          const [gradeModal, setGradeModal] = useState<Submission | null>(null);
          const [score, setScore] = useState('');
          const [feedback, setFeedback] = useState('');
          const [grading, setGrading] = useState(false);

          useEffect(() => {
                    const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') setGradeModal(null); };
                    window.addEventListener('keydown', handleEsc);
                    return () => window.removeEventListener('keydown', handleEsc);
          }, []);
          const [showRubric, setShowRubric] = useState(false);
          const { addToast } = useToast();

          useEffect(() => { assignmentService.list().then(a => { setAssignments(a); setLoading(false); }); }, []);

          const viewSubmissions = (assignmentId: string) => {
                    setSelectedAssignment(assignmentId);
                    setSubmissions(mockSubmissions.filter(s => s.assignmentId === assignmentId));
          };

          const handleGrade = async () => {
                    if (!gradeModal || !score) return;
                    setGrading(true);
                    await assignmentService.grade(gradeModal.id, parseFloat(score), feedback);
                    addToast(`Calificación enviada a ${gradeModal.studentName}`, 'success');
                    setGrading(false);
                    setGradeModal(null);
                    setScore('');
                    setFeedback('');
          };

          if (loading) return <DashboardSkeleton />;

          const selectedAsgn = assignments.find(a => a.id === selectedAssignment);
          const submittedCount = submissions.filter(s => s.status === 'submitted').length;
          const gradedCount = submissions.filter(s => s.status === 'graded').length;

          return (
                    <div className="space-y-6 animate-fade-in">
                              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                        <div>
                                                  <h1 className="text-2xl font-display font-bold">Tareas</h1>
                                                  <p className="text-sm text-text-muted mt-1">Crea, revisa y califica tareas de tus cursos</p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                                  <button onClick={() => setShowRubric(!showRubric)}
                                                            className="btn-ghost text-xs flex items-center gap-1.5">
                                                            <BarChart3 className="w-3.5 h-3.5" /> Rúbrica
                                                  </button>
                                                  <button className="btn-primary flex items-center gap-2" onClick={() => addToast('Función disponible próximamente', 'info')}>
                                                            <Plus className="w-4 h-4" /> Crear tarea
                                                  </button>
                                        </div>
                              </div>

                              {/* Summary stats */}
                              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                        {[
                                                  { label: 'Total tareas', value: assignments.length, icon: ClipboardList, color: 'nebula' },
                                                  { label: 'Por revisar', value: assignments.reduce((a, x) => a + mockSubmissions.filter(s => s.assignmentId === x.id && s.status === 'submitted').length, 0), icon: AlertCircle, color: 'amber' },
                                                  { label: 'Calificadas', value: assignments.reduce((a, x) => a + mockSubmissions.filter(s => s.assignmentId === x.id && s.status === 'graded').length, 0), icon: CheckCircle, color: 'emerald' },
                                                  { label: 'Próxima fecha límite', value: assignments.length > 0 ? new Date(assignments.sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())[0].deadline).toLocaleDateString('es', { day: 'numeric', month: 'short' }) : '—', icon: Calendar, color: 'astral' },
                                        ].map((s, i) => (
                                                  <div key={i} className="glass rounded-xl p-3 flex items-center gap-3">
                                                            <div className={`w-9 h-9 rounded-lg bg-${s.color}-500/10 border border-${s.color}-500/20 flex items-center justify-center shrink-0`}>
                                                                      <s.icon className={`w-4 h-4 text-${s.color}-400`} />
                                                            </div>
                                                            <div>
                                                                      <p className="text-sm font-display font-bold text-text-primary">{s.value}</p>
                                                                      <p className="text-[10px] text-text-muted">{s.label}</p>
                                                            </div>
                                                  </div>
                                        ))}
                              </div>

                              {/* Rubric preview (collapsible) */}
                              {showRubric && (
                                        <div className="orionix-card p-5 animate-fade-in" style={{ transform: 'none' }}>
                                                  <h3 className="text-sm font-display font-semibold mb-3 flex items-center gap-2"><Award className="w-4 h-4 text-amber-400" /> Rúbrica de evaluación</h3>
                                                  <div className="space-y-3">
                                                            {rubricCriteria.map((c, i) => (
                                                                      <div key={i} className="flex items-center gap-4">
                                                                                <div className="flex-1">
                                                                                          <div className="flex items-center justify-between mb-1">
                                                                                                    <span className="text-xs font-medium text-text-secondary">{c.name}</span>
                                                                                                    <span className="text-[10px] text-text-muted">{c.weight}%</span>
                                                                                          </div>
                                                                                          <p className="text-[10px] text-text-muted">{c.desc}</p>
                                                                                </div>
                                                                                <div className="w-20 h-2 rounded-full bg-surface-glass overflow-hidden shrink-0">
                                                                                          <div className="h-full rounded-full bg-gradient-to-r from-amber-500 to-amber-400" style={{ width: `${c.weight}%` }} />
                                                                                </div>
                                                                      </div>
                                                            ))}
                                                  </div>
                                        </div>
                              )}

                              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        {/* Assignment list */}
                                        <div className="space-y-3">
                                                  <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wider">Tareas creadas</h2>
                                                  {assignments.map(a => {
                                                            const aSubmissions = mockSubmissions.filter(s => s.assignmentId === a.id);
                                                            const pending = aSubmissions.filter(s => s.status === 'submitted').length;
                                                            return (
                                                                      <button key={a.id} onClick={() => viewSubmissions(a.id)}
                                                                                className={`w-full text-left orionix-card p-4 transition-all ${selectedAssignment === a.id ? 'border-nebula-500/40 bg-nebula-500/5' : ''}`} style={{ transform: 'none' }}>
                                                                                <div className="flex items-center gap-3">
                                                                                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${pending > 0 ? 'bg-amber-500/10 border-amber-500/20' : 'bg-surface-glass border-border-subtle'
                                                                                                    }`}>
                                                                                                    <ClipboardList className={`w-5 h-5 ${pending > 0 ? 'text-amber-400' : 'text-nebula-400'}`} />
                                                                                          </div>
                                                                                          <div className="flex-1 min-w-0">
                                                                                                    <div className="flex items-center gap-2">
                                                                                                              <p className="font-semibold text-sm truncate">{a.title}</p>
                                                                                                              {pending > 0 && (
                                                                                                                        <span className="badge badge-amber text-[10px]">{pending} por revisar</span>
                                                                                                              )}
                                                                                                    </div>
                                                                                                    <p className="text-xs text-text-muted">{a.courseName}</p>
                                                                                          </div>
                                                                                          <div className="text-right shrink-0">
                                                                                                    <span className="text-xs text-text-muted flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(a.deadline).toLocaleDateString('es', { day: 'numeric', month: 'short' })}</span>
                                                                                                    <p className="text-[10px] text-text-muted mt-0.5">{aSubmissions.length} entrega{aSubmissions.length !== 1 ? 's' : ''}</p>
                                                                                          </div>
                                                                                </div>
                                                                      </button>
                                                            );
                                                  })}
                                        </div>

                                        {/* Submissions panel */}
                                        <div>
                                                  <div className="flex items-center justify-between mb-3">
                                                            <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wider">Entregas</h2>
                                                            {selectedAsgn && (
                                                                      <div className="flex items-center gap-3 text-[10px] text-text-muted">
                                                                                <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {submissions.length} total</span>
                                                                                {submittedCount > 0 && <span className="text-amber-400 font-medium">{submittedCount} pendiente{submittedCount > 1 ? 's' : ''}</span>}
                                                                                {gradedCount > 0 && <span className="text-emerald-400">{gradedCount} calificada{gradedCount > 1 ? 's' : ''}</span>}
                                                                      </div>
                                                            )}
                                                  </div>
                                                  {!selectedAssignment ? (
                                                            <EmptyState icon="file" title="Selecciona una tarea" description="Haz clic en una tarea para ver las entregas de los estudiantes." />
                                                  ) : submissions.length === 0 ? (
                                                            <EmptyState icon="inbox" title="Sin entregas" description="Aún no hay entregas para esta tarea." />
                                                  ) : (
                                                            <div className="space-y-3">
                                                                      {submissions.map(s => (
                                                                                <div key={s.id} className={`orionix-card p-4 ${s.status === 'submitted' ? 'border-l-2 border-l-amber-500/50' : ''}`} style={{ transform: 'none' }}>
                                                                                          <div className="flex items-center gap-3">
                                                                                                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-nebula-500/20 to-astral-500/10 flex items-center justify-center text-xs font-bold text-nebula-300 shrink-0">
                                                                                                              {s.studentName.charAt(0)}{s.studentName.split(' ')[1]?.charAt(0) || ''}
                                                                                                    </div>
                                                                                                    <div className="flex-1 min-w-0">
                                                                                                              <p className="font-semibold text-sm">{s.studentName}</p>
                                                                                                              <div className="flex items-center gap-2 mt-0.5">
                                                                                                                        {s.fileName && <p className="text-[10px] text-text-muted flex items-center gap-1"><FileText className="w-2.5 h-2.5" />{s.fileName}</p>}
                                                                                                                        {s.submittedAt && <span className="text-[10px] text-text-muted">· {new Date(s.submittedAt).toLocaleDateString('es', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>}
                                                                                                              </div>
                                                                                                    </div>
                                                                                                    <span className={`badge ${statusColors[s.status]}`}>{statusLabels[s.status]}</span>
                                                                                          </div>
                                                                                          {s.comment && <p className="text-xs text-text-secondary mt-2 ml-12 italic">&ldquo;{s.comment}&rdquo;</p>}
                                                                                          {s.status === 'graded' && (
                                                                                                    <div className="mt-3 ml-12 glass rounded-lg p-3 flex items-center gap-4">
                                                                                                              <div className="text-center">
                                                                                                                        <p className="text-lg font-display font-bold text-emerald-400">{s.score}</p>
                                                                                                                        <p className="text-[10px] text-text-muted">Nota</p>
                                                                                                              </div>
                                                                                                              {s.feedback && <p className="text-xs text-text-muted flex-1 border-l border-border-subtle pl-4">{s.feedback}</p>}
                                                                                                    </div>
                                                                                          )}
                                                                                          {s.status === 'submitted' && (
                                                                                                    <button onClick={() => { setGradeModal(s); setScore(''); setFeedback(''); }}
                                                                                                              className="btn-accent text-xs mt-3 ml-12 py-2 px-4 flex items-center gap-1.5 shadow-sm shadow-emerald-500/10">
                                                                                                              <Star className="w-3.5 h-3.5" /> Calificar
                                                                                                    </button>
                                                                                          )}
                                                                                </div>
                                                                      ))}
                                                            </div>
                                                  )}
                                        </div>
                              </div>

                              {/* Grade Modal */}
                              {gradeModal && (
                                        <div className="modal-overlay" onClick={() => setGradeModal(null)}>
                                                  <div className="modal-content max-w-lg" onClick={e => e.stopPropagation()}>
                                                            <div className="flex items-center justify-between mb-6">
                                                                      <h2 className="text-lg font-display font-semibold flex items-center gap-2"><Star className="w-5 h-5 text-amber-400" /> Calificar entrega</h2>
                                                                      <button onClick={() => setGradeModal(null)} className="text-text-muted hover:text-text-primary transition-colors"><X className="w-5 h-5" /></button>
                                                            </div>

                                                            {/* Student info */}
                                                            <div className="glass rounded-xl p-4 mb-5 flex items-center gap-3">
                                                                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-nebula-500/20 to-astral-500/10 flex items-center justify-center text-xs font-bold text-nebula-300">
                                                                                {gradeModal.studentName.charAt(0)}
                                                                      </div>
                                                                      <div>
                                                                                <p className="font-semibold text-sm text-text-primary">{gradeModal.studentName}</p>
                                                                                {gradeModal.fileName && <p className="text-[10px] text-text-muted flex items-center gap-1"><FileText className="w-2.5 h-2.5" />{gradeModal.fileName}</p>}
                                                                      </div>
                                                            </div>

                                                            {/* Rubric quick reference */}
                                                            <div className="mb-5">
                                                                      <p className="text-[10px] font-semibold text-text-muted uppercase tracking-wider mb-2">Referencia rúbrica</p>
                                                                      <div className="grid grid-cols-2 gap-2">
                                                                                {rubricCriteria.map((c, i) => (
                                                                                          <div key={i} className="glass rounded-lg px-3 py-2 text-center">
                                                                                                    <p className="text-[10px] font-medium text-text-secondary">{c.name}</p>
                                                                                                    <p className="text-[10px] text-text-muted">{c.weight}%</p>
                                                                                          </div>
                                                                                ))}
                                                                      </div>
                                                            </div>

                                                            <div className="space-y-4">
                                                                      <div>
                                                                                <label htmlFor="score" className="block text-xs font-semibold text-text-secondary mb-1.5">Calificación <span className="text-red-400">*</span></label>
                                                                                <div className="flex items-center gap-3">
                                                                                          <input id="score" name="score" type="number" value={score} onChange={e => setScore(e.target.value)}
                                                                                                    className="orionix-input flex-1" placeholder="0 - 100" min="0" max="100" />
                                                                                          {score && (
                                                                                                    <span className={`text-sm font-bold ${parseFloat(score) >= 70 ? 'text-emerald-400' : parseFloat(score) >= 50 ? 'text-amber-400' : 'text-red-400'}`}>
                                                                                                              {parseFloat(score) >= 90 ? 'Excelente' : parseFloat(score) >= 70 ? 'Bueno' : parseFloat(score) >= 50 ? 'Regular' : 'Insuficiente'}
                                                                                                    </span>
                                                                                          )}
                                                                                </div>
                                                                      </div>
                                                                      <div>
                                                                                <label htmlFor="feedback" className="block text-xs font-semibold text-text-secondary mb-1.5">Feedback para el estudiante</label>
                                                                                <textarea id="feedback" name="feedback" value={feedback} onChange={e => setFeedback(e.target.value)}
                                                                                          className="orionix-input min-h-[100px] resize-none" placeholder="Escribe un comentario detallado sobre el trabajo..." />
                                                                      </div>
                                                                      <button onClick={handleGrade} disabled={grading || !score}
                                                                                className="btn-primary w-full flex items-center justify-center gap-2 py-3 disabled:opacity-40">
                                                                                {grading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Check className="w-4 h-4" /> Enviar calificación</>}
                                                                      </button>
                                                            </div>
                                                  </div>
                                        </div>
                              )}
                    </div>
          );
}
