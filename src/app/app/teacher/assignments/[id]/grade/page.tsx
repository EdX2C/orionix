'use client';
// ===== Teacher: Grading Console Mock (Split View) =====
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { assignmentService } from '@/services';
import { mockSubmissions } from '@/data/assignments';
import { Assignment, Submission } from '@/types';
import Logo from '@/components/ui/Logo';
import { useToast } from '@/context/ToastContext';
import {
          ArrowLeft, ChevronLeft, ChevronRight, Check, X,
          FileText, Award, Maximize2, Download, MessageSquare, Star
} from 'lucide-react';

const rubricCriteria = [
          { name: 'Funcionalidad', desc: 'El código cumple con los requisitos', weight: 40 },
          { name: 'Calidad de código', desc: 'Organización, nomenclatura y buenas prácticas', weight: 25 },
          { name: 'Documentación', desc: 'Comentarios y documentación del trabajo', weight: 20 },
          { name: 'Creatividad', desc: 'Soluciones originales y valor agregado', weight: 15 },
];

export default function GradingConsolePage() {
          const params = useParams();
          const router = useRouter();
          const { addToast } = useToast();
          const assignmentId = params.id as string;

          const [assignment, setAssignment] = useState<Assignment | null>(null);
          const [submissions, setSubmissions] = useState<Submission[]>([]);
          const [currentIndex, setCurrentIndex] = useState(0);
          const [loading, setLoading] = useState(true);

          // Grade Form State
          const [score, setScore] = useState('');
          const [feedback, setFeedback] = useState('');
          const [rubricScores, setRubricScores] = useState<Record<number, string>>({});

          useEffect(() => {
                    // In a real app, we'd fetch the assignment and its submissions
                    const loadData = async () => {
                              const list = await assignmentService.list();
                              const asgn = list.find(a => a.id === assignmentId);
                              setAssignment(asgn || null);

                              const subs = mockSubmissions.filter(s => s.assignmentId === assignmentId);
                              setSubmissions(subs);
                              setLoading(false);
                    };
                    loadData();
          }, [assignmentId]);

          if (loading) {
                    return (
                              <div className="fixed inset-0 bg-orion-950 flex items-center justify-center z-[100]">
                                        <div className="w-8 h-8 rounded-full border-2 border-nebula-500 border-t-transparent animate-spin" />
                              </div>
                    );
          }

          if (!assignment || submissions.length === 0) {
                    return (
                              <div className="p-10 text-center">
                                        <p className="text-text-secondary mb-4">No se encontraron entregas para esta tarea.</p>
                                        <button onClick={() => router.push('/app/teacher/assignments')} className="btn-secondary">Volver</button>
                              </div>
                    );
          }

          const currentSubmission = submissions[currentIndex];
          const isGraded = currentSubmission.status === 'graded';

          const handleNext = () => {
                    if (currentIndex < submissions.length - 1) {
                              setCurrentIndex(prev => prev + 1);
                              resetForm();
                    }
          };

          const handlePrev = () => {
                    if (currentIndex > 0) {
                              setCurrentIndex(prev => prev - 1);
                              resetForm();
                    }
          };

          const resetForm = () => {
                    setScore('');
                    setFeedback('');
                    setRubricScores({});
          };

          const handleGrade = () => {
                    addToast(`Calificación procesada para ${currentSubmission.studentName}`, 'success');
                    // Mock updating state locally for visual feedback
                    setSubmissions(prev => prev.map((s, i) =>
                              i === currentIndex ? { ...s, status: 'graded', score: parseFloat(score) || 100 } : s
                    ));
                    setTimeout(() => handleNext(), 1500); // auto advance
          };

          // Helper to calculate total score from rubric
          const handleRubricChange = (index: number, val: string) => {
                    const newScores = { ...rubricScores, [index]: val };
                    setRubricScores(newScores);

                    // Auto calculate total if all filled out
                    const allFilled = rubricCriteria.every((_, i) => newScores[i] !== undefined);
                    if (allFilled) {
                              let total = 0;
                              rubricCriteria.forEach((c, i) => {
                                        const valNum = parseFloat(newScores[i]) || 0;
                                        // Assume valNum is out of 100 per criteria, weight it
                                        total += (valNum * c.weight) / 100;
                              });
                              setScore(Math.round(total).toString());
                    }
          };

          return (
                    <div className="fixed inset-0 bg-orion-950 text-text-primary flex flex-col z-[100] animate-fade-in">

                              {/* ── Top Header Bar ── */}
                              <header className="h-14 bg-surface-base border-b border-border-subtle flex items-center justify-between px-4 shrink-0">
                                        <div className="flex items-center gap-4">
                                                  <button
                                                            onClick={() => router.push('/app/teacher/assignments')}
                                                            className="flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary transition-colors py-1 px-2 rounded-lg hover:bg-surface-glass"
                                                  >
                                                            <ArrowLeft className="w-4 h-4" /> <span className="hidden sm:inline">Regresar</span>
                                                  </button>
                                                  <div className="h-6 w-px bg-border-subtle" />
                                                  <div>
                                                            <h1 className="font-semibold text-sm leading-tight text-white">{assignment.title}</h1>
                                                            <p className="text-[10px] text-text-muted">{assignment.courseName}</p>
                                                  </div>
                                        </div>

                                        {/* Student Navigator */}
                                        <div className="flex items-center gap-3 bg-orion-900 border border-border-subtle rounded-xl p-1">
                                                  <button
                                                            onClick={handlePrev}
                                                            disabled={currentIndex === 0}
                                                            className="p-1.5 rounded-lg hover:bg-surface-glass disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                                                  >
                                                            <ChevronLeft className="w-5 h-5 text-text-secondary" />
                                                  </button>
                                                  <div className="text-center min-w-[140px]">
                                                            <p className="text-xs font-semibold text-white truncate max-w-[130px]">{currentSubmission.studentName}</p>
                                                            <p className="text-[10px] text-text-muted">{currentIndex + 1} de {submissions.length}</p>
                                                  </div>
                                                  <button
                                                            onClick={handleNext}
                                                            disabled={currentIndex === submissions.length - 1}
                                                            className="p-1.5 rounded-lg hover:bg-surface-glass disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                                                  >
                                                            <ChevronRight className="w-5 h-5 text-text-secondary" />
                                                  </button>
                                        </div>
                              </header>

                              {/* ── Main Split View ── */}
                              <div className="flex-1 flex overflow-hidden">

                                        {/* Left pane: Document Previewer Mock */}
                                        <main className="flex-1 bg-black relative flex flex-col">
                                                  {/* Top toolbar for previewer */}
                                                  <div className="h-12 bg-orion-900/50 border-b border-border-subtle flex items-center justify-between px-4 shrink-0">
                                                            <div className="flex items-center gap-2 text-sm text-text-secondary">
                                                                      <FileText className="w-4 h-4" />
                                                                      <span>{currentSubmission.fileName || `tarea_${currentSubmission.studentName.split(' ')[0].toLowerCase()}.pdf`}</span>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                      <button className="p-2 text-text-muted hover:text-text-primary rounded-lg hover:bg-surface-glass transition-colors" title="Descargar original">
                                                                                <Download className="w-4 h-4" />
                                                                      </button>
                                                                      <button className="p-2 text-text-muted hover:text-text-primary rounded-lg hover:bg-surface-glass transition-colors lg:hidden" title="Pantalla completa">
                                                                                <Maximize2 className="w-4 h-4" />
                                                                      </button>
                                                            </div>
                                                  </div>

                                                  {/* Fake Document Canvas */}
                                                  <div className="flex-1 bg-orion-950 p-4 sm:p-8 overflow-y-auto custom-scrollbar flex justify-center">
                                                            {/* Fake PDF Paper */}
                                                            <div className="w-full max-w-3xl bg-white shadow-2xl rounded opacity-90 min-h-[1056px] relative overflow-hidden">
                                                                      <div className="absolute inset-0 mesh-gradient mix-blend-multiply opacity-20 pointer-events-none" />

                                                                      <div className="p-12 text-black/80">
                                                                                <h1 className="text-2xl font-serif font-bold mb-6 border-b pb-4">{assignment.title} - Entrega</h1>
                                                                                <p className="font-serif mb-8"><strong>Alumno:</strong> {currentSubmission.studentName}</p>

                                                                                {/* Fake Content Skeleton */}
                                                                                <div className="space-y-4 opacity-40">
                                                                                          <div className="w-full h-4 bg-black/20 rounded" />
                                                                                          <div className="w-full h-4 bg-black/20 rounded" />
                                                                                          <div className="w-5/6 h-4 bg-black/20 rounded" />
                                                                                          <div className="w-full h-4 bg-black/20 rounded mt-8" />
                                                                                          <div className="w-4/6 h-4 bg-black/20 rounded" />
                                                                                          <div className="w-full h-[200px] bg-black/10 rounded mt-8 flex items-center justify-center font-mono text-sm">(Código fuente adjunto)</div>
                                                                                          {currentSubmission.comment && (
                                                                                                    <div className="mt-8 p-4 bg-yellow-100/50 border-l-4 border-yellow-400">
                                                                                                              <p className="text-sm italic">Comentario del alumno: "{currentSubmission.comment}"</p>
                                                                                                    </div>
                                                                                          )}
                                                                                </div>
                                                                      </div>
                                                            </div>
                                                  </div>
                                        </main>

                                        {/* Right pane: Grading Panel Tools */}
                                        <aside className="w-full max-w-[400px] bg-surface-base border-l border-border-subtle flex flex-col shrink-0 overflow-y-auto custom-scrollbar">

                                                  {/* Student details header */}
                                                  <div className="p-5 border-b border-border-subtle bg-surface-glass">
                                                            <div className="flex items-center gap-3 mb-3">
                                                                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-nebula-500/20 to-astral-500/10 flex items-center justify-center text-lg font-bold text-nebula-300 shadow-inner">
                                                                                {currentSubmission.studentName.charAt(0)}
                                                                      </div>
                                                                      <div>
                                                                                <h2 className="font-semibold text-white">{currentSubmission.studentName}</h2>
                                                                                <span className={`text-[10px] font-medium uppercase tracking-wider ${isGraded ? 'text-emerald-400' : 'text-amber-400'}`}>
                                                                                          {isGraded ? 'Calificado' : 'Pendiente de revisión'}
                                                                                </span>
                                                                      </div>
                                                            </div>

                                                            {isGraded && currentSubmission.score && (
                                                                      <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 flex items-center justify-between mt-4">
                                                                                <div className="flex flex-col">
                                                                                          <span className="text-xs text-text-secondary uppercase">Nota final</span>
                                                                                          <span className="text-2xl font-display font-bold text-emerald-400">{currentSubmission.score}/100</span>
                                                                                </div>
                                                                                <Award className="w-8 h-8 text-emerald-400/50" />
                                                                      </div>
                                                            )}
                                                  </div>

                                                  <div className="p-5 flex-1 space-y-6">

                                                            {/* Rubric Evaluator */}
                                                            {!isGraded && (
                                                                      <div>
                                                                                <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                                                                                          <Star className="w-4 h-4 text-amber-400" /> Rúbrica
                                                                                </h3>
                                                                                <div className="space-y-3">
                                                                                          {rubricCriteria.map((c, i) => (
                                                                                                    <div key={i} className="bg-orion-900 border border-border-subtle rounded-xl p-3">
                                                                                                              <div className="flex items-center justify-between mb-2">
                                                                                                                        <span className="text-xs font-semibold text-text-primary">{c.name}</span>
                                                                                                                        <span className="text-[10px] text-text-muted bg-surface-glass px-2 py-0.5 rounded-full">{c.weight}% pts</span>
                                                                                                              </div>
                                                                                                              <input
                                                                                                                        type="number"
                                                                                                                        placeholder="Nota (0-100)"
                                                                                                                        min="0" max="100"
                                                                                                                        value={rubricScores[i] || ''}
                                                                                                                        onChange={(e) => handleRubricChange(i, e.target.value)}
                                                                                                                        className="orionix-input text-xs py-1.5"
                                                                                                              />
                                                                                                    </div>
                                                                                          ))}
                                                                                </div>
                                                                      </div>
                                                            )}

                                                            {/* Direct Grade & Feedback */}
                                                            <div className="border-t border-border-subtle pt-6">
                                                                      <h3 className="text-sm font-semibold text-white mb-4">Nota Global y Feedback</h3>

                                                                      <div className="space-y-4">
                                                                                {!isGraded && (
                                                                                          <div>
                                                                                                    <label className="block text-xs text-text-secondary mb-1.5">Calificación (0-100)</label>
                                                                                                    <input
                                                                                                              type="number"
                                                                                                              value={score}
                                                                                                              onChange={e => setScore(e.target.value)}
                                                                                                              className="orionix-input text-lg font-bold text-white bg-orion-950"
                                                                                                              placeholder="Ej. 95"
                                                                                                              min="0" max="100"
                                                                                                    />
                                                                                          </div>
                                                                                )}

                                                                                <div>
                                                                                          <label className="block text-xs text-text-secondary mb-1.5">Comentarios para el alumno</label>
                                                                                          <div className="relative">
                                                                                                    <MessageSquare className="absolute top-3 left-3 w-4 h-4 text-text-muted" />
                                                                                                    <textarea
                                                                                                              value={isGraded ? (currentSubmission.feedback || 'Sin comentarios') : feedback}
                                                                                                              onChange={e => setFeedback(e.target.value)}
                                                                                                              disabled={isGraded}
                                                                                                              className="orionix-input min-h-[120px] resize-none pl-9 py-2.5 text-sm disabled:opacity-50"
                                                                                                              placeholder="Escribe recomendaciones, puntos fuertes y áreas de mejora..."
                                                                                                    />
                                                                                          </div>
                                                                                </div>

                                                                                {!isGraded && (
                                                                                          <button
                                                                                                    onClick={handleGrade}
                                                                                                    disabled={!score}
                                                                                                    className="btn-primary w-full flex items-center justify-center gap-2 mt-4 py-3 shadow-lg shadow-nebula-500/20 disabled:shadow-none"
                                                                                          >
                                                                                                    <Check className="w-5 h-5" /> Enviar Calificación
                                                                                          </button>
                                                                                )}
                                                                      </div>
                                                            </div>

                                                  </div>
                                        </aside>
                              </div>
                    </div>
          );
}
