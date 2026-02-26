'use client';
// ===== Student: Course Detail =====
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { courseService } from '@/services';
import { useToast } from '@/context/ToastContext';
import { useAuth } from '@/context/AuthContext';
import { Course, Module, Material, Announcement, Assignment } from '@/types';
import { getModulesByCourse, getMaterialsByCourse, getAnnouncementsByCourse } from '@/data/modules';
import { getAssignmentsByCourse } from '@/data/assignments';
import { DashboardSkeleton } from '@/components/ui/Skeleton';
import { BookOpen, ChevronDown, ChevronRight, FileText, Video, Link2, Clock, Star, Users, Calendar, Download, Megaphone, ClipboardList, ArrowLeft, CheckCircle, Circle, PlayCircle } from 'lucide-react';

export default function CourseDetailPage() {
          const params = useParams();
          const id = params.id as string;
          const { user } = useAuth();
          const [course, setCourse] = useState<Course | null>(null);
          const [modules, setModules] = useState<Module[]>([]);
          const [materials, setMaterials] = useState<Material[]>([]);
          const [announcements, setAnnouncements] = useState<Announcement[]>([]);
          const [assignments, setAssignments] = useState<Assignment[]>([]);
          const [loading, setLoading] = useState(true);
          const [openModules, setOpenModules] = useState<Set<string>>(new Set());
          const [tab, setTab] = useState<'content' | 'announcements' | 'assignments' | 'reviews'>('content');
          const [mockReviews] = useState([
                    { id: 1, author: 'Ana López', rating: 5, date: 'Hace 2 días', content: 'Excelente curso, muy bien explicado y con ejemplos prácticos. Totalmente recomendado para principiantes.' },
                    { id: 2, author: 'Carlos Méndez', rating: 4, date: 'Hace 1 semana', content: 'Buen contenido, aunque me gustaría que las lecciones del módulo 3 fueran más detalladas. Aún así, aprendí bastante.' },
                    { id: 3, author: 'Sofía Castro', rating: 5, date: 'Hace 2 semanas', content: 'Me encantó la dinámica del profesor. Los materiales adicionales son súper útiles para repasar los temas.' }
          ]);
          const { addToast } = useToast();

          useEffect(() => {
                    courseService.getById(id).then(c => {
                              setCourse(c || null);
                              setModules(getModulesByCourse(id));
                              setMaterials(getMaterialsByCourse(id));
                              setAnnouncements(getAnnouncementsByCourse(id));
                              setAssignments(getAssignmentsByCourse(id));
                              setLoading(false);
                    });
          }, [id]);

          const toggleModule = (mId: string) => {
                    setOpenModules(prev => {
                              const n = new Set(prev);
                              n.has(mId) ? n.delete(mId) : n.add(mId);
                              return n;
                    });
          };

          if (loading) return <DashboardSkeleton />;
          if (!course) return <div className="text-center py-20 text-text-muted">Curso no encontrado</div>;

          const typeIcons: Record<string, React.ReactNode> = {
                    pdf: <FileText className="w-4 h-4 text-red-400" />,
                    video: <Video className="w-4 h-4 text-astral-400" />,
                    link: <Link2 className="w-4 h-4 text-nebula-400" />,
                    document: <FileText className="w-4 h-4 text-amber-400" />,
          };

          return (
                    <div className="space-y-6 animate-fade-in">
                              <Link href="/app/student/courses" className="inline-flex items-center gap-1 text-sm text-text-muted hover:text-text-primary transition-colors">
                                        <ArrowLeft className="w-4 h-4" /> Volver a cursos
                              </Link>

                              {/* Course header */}
                              <div className="orionix-card p-6 md:p-8" style={{ transform: 'none' }}>
                                        <div className="flex flex-col md:flex-row gap-6">
                                                  <div className="w-full md:w-64 h-40 rounded-xl bg-gradient-to-br from-nebula-500/20 to-astral-500/10 border border-border-subtle flex items-center justify-center shrink-0">
                                                            <BookOpen className="w-14 h-14 text-nebula-400/40" strokeWidth={1} />
                                                  </div>
                                                  <div className="flex-1">
                                                            <div className="flex flex-wrap gap-2 mb-3">
                                                                      <span className="badge badge-purple">{course.level === 'beginner' ? 'Principiante' : course.level === 'intermediate' ? 'Intermedio' : 'Avanzado'}</span>
                                                                      <span className="badge badge-slate">{course.category}</span>
                                                                      {course.tags.map(t => <span key={t} className="badge badge-cyan">{t}</span>)}
                                                            </div>
                                                            <h1 className="text-2xl font-display font-bold mb-2">{course.title}</h1>
                                                            <p className="text-sm text-text-secondary mb-4">{course.description}</p>
                                                            <div className="flex flex-wrap gap-4 text-xs text-text-muted">
                                                                      <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {course.teacherName}</span>
                                                                      {course.rating && <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5 text-amber-400" /> {course.rating}</span>}
                                                                      <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {new Date(course.startDate).toLocaleDateString('es', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                                                      <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {course.enrolled}/{course.capacity} inscritos</span>
                                                            </div>
                                                            <div className="flex items-center gap-3 mt-5">
                                                                      <Link href={`/app/student/courses/${id}/learn`} className="btn-primary flex items-center gap-2">
                                                                                <PlayCircle className="w-4 h-4" /> Continuar Aprendiendo
                                                                      </Link>
                                                                      <button onClick={async () => { if (!user) return; const res = await courseService.enroll(id, user.id, user.name); if (res.success) addToast('¡Inscripción exitosa!', 'success'); else addToast(res.error || 'Error al inscribir', 'error'); }} className="btn-secondary">Inscribirme</button>
                                                            </div>
                                                  </div>
                                        </div>
                              </div>

                              {/* Tabs */}
                              <div className="flex gap-1 border-b border-border-subtle">
                                        {[
                                                  { key: 'content', label: 'Contenido', icon: BookOpen },
                                                  { key: 'announcements', label: 'Anuncios', icon: Megaphone },
                                                  { key: 'assignments', label: 'Tareas', icon: ClipboardList },
                                                  { key: 'reviews', label: 'Reseñas', icon: Star },
                                        ].map(t => (
                                                  <button key={t.key} onClick={() => setTab(t.key as typeof tab)}
                                                            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${tab === t.key ? 'border-nebula-500 text-text-primary' : 'border-transparent text-text-muted hover:text-text-secondary'}`}>
                                                            <t.icon className="w-4 h-4" /> {t.label}
                                                  </button>
                                        ))}
                              </div>

                              {/* Tab content */}
                              {tab === 'content' && (
                                        <div className="space-y-3">
                                                  {modules.length === 0 ? (
                                                            <div className="text-center py-12 text-text-muted text-sm">Este curso aún no tiene módulos publicados.</div>
                                                  ) : modules.map(m => (
                                                            <div key={m.id} className="orionix-card overflow-hidden" style={{ transform: 'none' }}>
                                                                      <button onClick={() => toggleModule(m.id)} className="w-full flex items-center gap-3 p-5 text-left hover:bg-surface-card-hover transition-colors">
                                                                                {openModules.has(m.id) ? <ChevronDown className="w-4 h-4 text-nebula-400" /> : <ChevronRight className="w-4 h-4 text-text-muted" />}
                                                                                <div className="flex-1">
                                                                                          <p className="font-semibold text-sm">Módulo {m.order}: {m.title}</p>
                                                                                          <p className="text-xs text-text-muted mt-0.5">{m.units.length} unidades · {m.description}</p>
                                                                                </div>
                                                                                <span className="text-xs text-text-muted">{m.units.filter(u => u.isCompleted).length}/{m.units.length}</span>
                                                                      </button>
                                                                      {openModules.has(m.id) && (
                                                                                <div className="border-t border-border-subtle">
                                                                                          {m.units.map(u => (
                                                                                                    <div key={u.id} className="flex items-center gap-3 px-5 py-3 hover:bg-surface-glass transition-colors border-b border-border-subtle last:border-0">
                                                                                                              {u.isCompleted ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : <Circle className="w-4 h-4 text-text-muted" />}
                                                                                                              <div className="flex-1">
                                                                                                                        <p className="text-sm text-text-secondary">{u.title}</p>
                                                                                                              </div>
                                                                                                              <span className="badge badge-slate text-[10px]">{u.type === 'lesson' ? 'Lección' : u.type === 'quiz' ? 'Quiz' : 'Actividad'}</span>
                                                                                                              {u.duration && <span className="text-xs text-text-muted flex items-center gap-1"><Clock className="w-3 h-3" /> {u.duration}</span>}
                                                                                                    </div>
                                                                                          ))}
                                                                                          {/* Materials for this module */}
                                                                                          {materials.filter(mat => mat.moduleId === m.id).length > 0 && (
                                                                                                    <div className="px-5 py-3 border-t border-border-subtle bg-surface-glass">
                                                                                                              <p className="text-xs font-semibold text-text-muted mb-2">Materiales</p>
                                                                                                              {materials.filter(mat => mat.moduleId === m.id).map(mat => (
                                                                                                                        <div key={mat.id} className="flex items-center gap-2 py-1.5 text-sm text-text-secondary">
                                                                                                                                  {typeIcons[mat.type]}
                                                                                                                                  <span className="flex-1">{mat.title}</span>
                                                                                                                                  {mat.size && <span className="text-xs text-text-muted">{mat.size}</span>}
                                                                                                                                  <button aria-label="Descargar material" className="text-nebula-400 hover:text-nebula-300"><Download className="w-3.5 h-3.5" aria-hidden="true" /></button>
                                                                                                                        </div>
                                                                                                              ))}
                                                                                                    </div>
                                                                                          )}
                                                                                </div>
                                                                      )}
                                                            </div>
                                                  ))}
                                        </div>
                              )}

                              {tab === 'announcements' && (
                                        <div className="space-y-4">
                                                  {announcements.length === 0 ? (
                                                            <div className="text-center py-12 text-text-muted text-sm">No hay anuncios para este curso.</div>
                                                  ) : announcements.map(a => (
                                                            <div key={a.id} className="orionix-card p-5" style={{ transform: 'none' }}>
                                                                      <div className="flex items-center gap-2 mb-2">
                                                                                <Megaphone className="w-4 h-4 text-amber-400" />
                                                                                <h3 className="font-semibold text-sm">{a.title}</h3>
                                                                      </div>
                                                                      <p className="text-sm text-text-secondary mb-2">{a.content}</p>
                                                                      <p className="text-xs text-text-muted">{a.authorName} · {new Date(a.createdAt).toLocaleDateString('es', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                                                            </div>
                                                  ))}
                                        </div>
                              )}

                              {tab === 'assignments' && (
                                        <div className="space-y-3">
                                                  {assignments.length === 0 ? (
                                                            <div className="text-center py-12 text-text-muted text-sm">No hay tareas asignadas en este curso.</div>
                                                  ) : assignments.map(a => {
                                                            const statusColors: Record<string, string> = { assigned: 'badge-amber', in_progress: 'badge-cyan', submitted: 'badge-purple', graded: 'badge-green' };
                                                            const statusLabels: Record<string, string> = { assigned: 'Asignada', in_progress: 'En progreso', submitted: 'Entregada', graded: 'Calificada' };
                                                            return (
                                                                      <div key={a.id} className="orionix-card p-5 flex items-center gap-4" style={{ transform: 'none' }}>
                                                                                <ClipboardList className="w-5 h-5 text-nebula-400 shrink-0" />
                                                                                <div className="flex-1 min-w-0">
                                                                                          <p className="font-semibold text-sm truncate">{a.title}</p>
                                                                                          <p className="text-xs text-text-muted">Puntaje máximo: {a.maxScore}</p>
                                                                                </div>
                                                                                <span className={`badge ${statusColors[a.status]}`}>{statusLabels[a.status]}</span>
                                                                                <span className="text-xs text-text-muted flex items-center gap-1 hide-mobile">
                                                                                          <Clock className="w-3 h-3" /> {new Date(a.deadline).toLocaleDateString('es', { day: 'numeric', month: 'short' })}
                                                                                </span>
                                                                      </div>
                                                            );
                                                  })}
                                        </div>
                              )}

                              {tab === 'reviews' && (
                                        <div className="space-y-4">
                                                  {mockReviews.length === 0 ? (
                                                            <div className="text-center py-12 text-text-muted text-sm">Este curso aún no tiene reseñas.</div>
                                                  ) : mockReviews.map(r => (
                                                            <div key={r.id} className="orionix-card p-5" style={{ transform: 'none' }}>
                                                                      <div className="flex items-center justify-between mb-3">
                                                                                <div className="flex items-center gap-3">
                                                                                          <div className="w-8 h-8 rounded-full bg-nebula-500/20 flex items-center justify-center text-xs font-bold text-nebula-400">
                                                                                                    {r.author.charAt(0)}
                                                                                          </div>
                                                                                          <div>
                                                                                                    <h3 className="font-semibold text-sm text-text-primary">{r.author}</h3>
                                                                                                    <p className="text-[10px] text-text-muted">{r.date}</p>
                                                                                          </div>
                                                                                </div>
                                                                                <div className="flex items-center gap-1 text-amber-400">
                                                                                          {Array.from({ length: 5 }).map((_, i) => (
                                                                                                    <Star key={i} className={`w-3.5 h-3.5 ${i < r.rating ? 'fill-current' : 'text-text-muted/30'}`} strokeWidth={i < r.rating ? 0 : 2} />
                                                                                          ))}
                                                                                </div>
                                                                      </div>
                                                                      <p className="text-sm text-text-secondary leading-relaxed">{r.content}</p>
                                                            </div>
                                                  ))}
                                        </div>
                              )}
                    </div>
          );
}
