'use client';
// ===== Teacher: Course Management =====
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { courseService } from '@/services';
import { useToast } from '@/context/ToastContext';
import { Course, Module, Material, Announcement } from '@/types';
import { getModulesByCourse, getMaterialsByCourse, getAnnouncementsByCourse } from '@/data/modules';
import { DashboardSkeleton } from '@/components/ui/Skeleton';
import Link from 'next/link';
import { ArrowLeft, BookOpen, ChevronDown, ChevronRight, FileText, Video, Link2, Megaphone, Plus, Settings, Eye, Globe, Users, Calendar, Star, Loader2 } from 'lucide-react';

export default function TeacherCourseDetailPage() {
          const params = useParams();
          const id = params.id as string;
          const router = useRouter();
          const { addToast } = useToast();
          const [course, setCourse] = useState<Course | null>(null);
          const [modules, setModules] = useState<Module[]>([]);
          const [materials, setMaterials] = useState<Material[]>([]);
          const [announcements, setAnnouncements] = useState<Announcement[]>([]);
          const [loading, setLoading] = useState(true);
          const [publishing, setPublishing] = useState(false);
          const [openModules, setOpenModules] = useState<Set<string>>(new Set());
          const [tab, setTab] = useState<'modules' | 'announcements' | 'settings'>('modules');

          useEffect(() => {
                    courseService.getById(id).then(c => {
                              setCourse(c || null);
                              setModules(getModulesByCourse(id));
                              setMaterials(getMaterialsByCourse(id));
                              setAnnouncements(getAnnouncementsByCourse(id));
                              setLoading(false);
                    });
          }, [id]);

          const handlePublish = async () => {
                    setPublishing(true);
                    await courseService.publish(id);
                    addToast('¡Curso publicado exitosamente!', 'success');
                    setCourse(prev => prev ? { ...prev, status: 'published' } : prev);
                    setPublishing(false);
          };

          const toggleModule = (mId: string) => {
                    setOpenModules(prev => { const n = new Set(prev); n.has(mId) ? n.delete(mId) : n.add(mId); return n; });
          };

          if (loading) return <DashboardSkeleton />;
          if (!course) return <div className="text-center py-20 text-text-muted">Curso no encontrado</div>;

          const statusLabels: Record<string, string> = { draft: 'Borrador', pending: 'Pendiente', published: 'Publicado', archived: 'Archivado' };
          const statusColors: Record<string, string> = { draft: 'badge-slate', pending: 'badge-amber', published: 'badge-green', archived: 'badge-red' };
          const typeIcons: Record<string, React.ReactNode> = { pdf: <FileText className="w-4 h-4 text-red-400" />, video: <Video className="w-4 h-4 text-astral-400" />, link: <Link2 className="w-4 h-4 text-nebula-400" />, document: <FileText className="w-4 h-4 text-amber-400" /> };

          return (
                    <div className="space-y-6 animate-fade-in">
                              <button onClick={() => router.back()} className="text-sm text-text-muted hover:text-text-primary flex items-center gap-1"><ArrowLeft className="w-4 h-4" /> Volver</button>

                              <div className="orionix-card p-6 md:p-8" style={{ transform: 'none' }}>
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                                  <div>
                                                            <div className="flex items-center gap-2 mb-2">
                                                                      <span className={`badge ${statusColors[course.status]}`}>{statusLabels[course.status]}</span>
                                                                      <span className="badge badge-purple">{course.category}</span>
                                                            </div>
                                                            <h1 className="text-2xl font-display font-bold">{course.title}</h1>
                                                            <p className="text-sm text-text-secondary mt-1">{course.shortDescription}</p>
                                                            <div className="flex flex-wrap gap-4 text-xs text-text-muted mt-3">
                                                                      <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {course.enrolled}/{course.capacity} inscritos</span>
                                                                      <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {course.startDate} — {course.endDate}</span>
                                                                      {course.rating && <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5 text-amber-400" /> {course.rating}</span>}
                                                            </div>
                                                  </div>
                                                  <div className="flex gap-2 shrink-0">
                                                            {course.status !== 'published' && (
                                                                      <button onClick={handlePublish} disabled={publishing} className="btn-accent flex items-center gap-2">
                                                                                {publishing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Globe className="w-4 h-4" />} Publicar
                                                                      </button>
                                                            )}
                                                  </div>
                                        </div>
                              </div>

                              <div className="flex gap-1 border-b border-border-subtle">
                                        {[
                                                  { key: 'modules', label: 'Módulos y materiales', icon: BookOpen },
                                                  { key: 'announcements', label: 'Anuncios', icon: Megaphone },
                                                  { key: 'settings', label: 'Configuración', icon: Settings },
                                        ].map(t => (
                                                  <button key={t.key} onClick={() => setTab(t.key as typeof tab)}
                                                            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${tab === t.key ? 'border-nebula-500 text-text-primary' : 'border-transparent text-text-muted hover:text-text-secondary'}`}>
                                                            <t.icon className="w-4 h-4" /> <span className="hide-mobile">{t.label}</span>
                                                  </button>
                                        ))}
                              </div>

                              {tab === 'modules' && (
                                        <div className="space-y-3">
                                                  <div className="flex items-center justify-between">
                                                            <h2 className="text-lg font-display font-semibold">{modules.length} módulo{modules.length !== 1 ? 's' : ''}</h2>
                                                            <Link href={`/app/teacher/courses/${id}/builder`} className="btn-secondary text-xs flex items-center gap-1"><Settings className="w-3 h-3" /> Editar Plan de Estudios</Link>
                                                  </div>
                                                  {modules.map(m => (
                                                            <div key={m.id} className="orionix-card overflow-hidden" style={{ transform: 'none' }}>
                                                                      <button onClick={() => toggleModule(m.id)} className="w-full flex items-center gap-3 p-5 text-left hover:bg-surface-card-hover transition-colors">
                                                                                {openModules.has(m.id) ? <ChevronDown className="w-4 h-4 text-nebula-400" /> : <ChevronRight className="w-4 h-4 text-text-muted" />}
                                                                                <div className="flex-1"><p className="font-semibold text-sm">Módulo {m.order}: {m.title}</p><p className="text-xs text-text-muted mt-0.5">{m.units.length} unidades</p></div>
                                                                      </button>
                                                                      {openModules.has(m.id) && (
                                                                                <div className="border-t border-border-subtle">
                                                                                          {m.units.map(u => (
                                                                                                    <div key={u.id} className="flex items-center gap-3 px-5 py-3 border-b border-border-subtle last:border-0 text-sm text-text-secondary">
                                                                                                              <span className="badge badge-slate text-[10px]">{u.type === 'lesson' ? 'Lección' : u.type === 'quiz' ? 'Quiz' : 'Actividad'}</span>
                                                                                                              <span className="flex-1">{u.title}</span>
                                                                                                              {u.duration && <span className="text-xs text-text-muted">{u.duration}</span>}
                                                                                                    </div>
                                                                                          ))}
                                                                                          {materials.filter(mat => mat.moduleId === m.id).map(mat => (
                                                                                                    <div key={mat.id} className="flex items-center gap-2 px-5 py-2 bg-surface-glass text-sm text-text-secondary">
                                                                                                              {typeIcons[mat.type]} <span className="flex-1">{mat.title}</span> {mat.size && <span className="text-xs text-text-muted">{mat.size}</span>}
                                                                                                    </div>
                                                                                          ))}
                                                                                </div>
                                                                      )}
                                                            </div>
                                                  ))}
                                        </div>
                              )}

                              {tab === 'announcements' && (
                                        <div className="space-y-4">
                                                  <button className="btn-secondary text-xs flex items-center gap-1" onClick={() => addToast('Función disponible próximamente', 'info')}><Plus className="w-3 h-3" /> Nuevo anuncio</button>
                                                  {announcements.map(a => (
                                                            <div key={a.id} className="orionix-card p-5" style={{ transform: 'none' }}>
                                                                      <h3 className="font-semibold text-sm flex items-center gap-2"><Megaphone className="w-4 h-4 text-amber-400" /> {a.title}</h3>
                                                                      <p className="text-sm text-text-secondary mt-2">{a.content}</p>
                                                                      <p className="text-xs text-text-muted mt-2">{new Date(a.createdAt).toLocaleDateString('es')}</p>
                                                            </div>
                                                  ))}
                                        </div>
                              )}

                              {tab === 'settings' && (
                                        <div className="orionix-card p-6 space-y-5" style={{ transform: 'none' }}>
                                                  <div><label className="block text-xs font-semibold text-text-secondary mb-1.5">Título</label><input className="orionix-input" defaultValue={course.title} /></div>
                                                  <div><label className="block text-xs font-semibold text-text-secondary mb-1.5">Descripción corta</label><input className="orionix-input" defaultValue={course.shortDescription} /></div>
                                                  <div><label className="block text-xs font-semibold text-text-secondary mb-1.5">Descripción</label><textarea className="orionix-input min-h-[100px] resize-none" defaultValue={course.description} /></div>
                                                  <div className="grid grid-cols-2 gap-4">
                                                            <div><label className="block text-xs font-semibold text-text-secondary mb-1.5">Cupo</label><input className="orionix-input" type="number" defaultValue={course.capacity} /></div>
                                                            <div><label className="block text-xs font-semibold text-text-secondary mb-1.5">Categoría</label><input className="orionix-input" defaultValue={course.category} /></div>
                                                  </div>
                                                  <button className="btn-primary" onClick={() => addToast('Cambios guardados', 'success')}>Guardar cambios</button>
                                        </div>
                              )}
                    </div>
          );
}
