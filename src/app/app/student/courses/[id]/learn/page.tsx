'use client';
// ===== Student: Course Player (Immersive Learn View) =====
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { courseService } from '@/services';
import { getModulesByCourse } from '@/data/modules';
import { Course, Module } from '@/types';
import Logo from '@/components/ui/Logo';
import {
          ArrowLeft, ChevronDown, ChevronRight, PlayCircle, FileText,
          CheckCircle, Circle, MessageSquare, Maximize, Settings, UploadCloud
} from 'lucide-react';

export default function CoursePlayerPage() {
          const params = useParams();
          const router = useRouter();
          const courseId = params.id as string;

          const [course, setCourse] = useState<Course | null>(null);
          const [modules, setModules] = useState<Module[]>([]);
          const [loading, setLoading] = useState(true);

          // Player Mock State
          const [activeModule, setActiveModule] = useState<string | null>(null);
          const [activeUnit, setActiveUnit] = useState<string | null>(null);
          const [openModules, setOpenModules] = useState<Set<string>>(new Set());
          const [sidebarOpen, setSidebarOpen] = useState(true);

          useEffect(() => {
                    courseService.getById(courseId).then(c => {
                              setCourse(c || null);
                              const mods = getModulesByCourse(courseId);
                              setModules(mods);

                              // Auto-open first module and select first unit
                              if (mods.length > 0) {
                                        setOpenModules(new Set([mods[0].id]));
                                        if (mods[0].units.length > 0) {
                                                  setActiveModule(mods[0].id);
                                                  setActiveUnit(mods[0].units[0].id);
                                        }
                              }
                              setLoading(false);
                    });
          }, [courseId]);

          const toggleModule = (id: string) => {
                    setOpenModules(prev => {
                              const n = new Set(prev);
                              n.has(id) ? n.delete(id) : n.add(id);
                              return n;
                    });
          };

          const handleUnitClick = (mId: string, uId: string) => {
                    setActiveModule(mId);
                    setActiveUnit(uId);
          };

          const toggleComplete = () => {
                    setModules(prev => prev.map(m => {
                              if (m.id !== activeModule) return m;
                              return {
                                        ...m,
                                        units: m.units.map(u => u.id === activeUnit ? { ...u, isCompleted: !u.isCompleted } : u)
                              };
                    }));
          };

          const toggleUnitComplete = (mId: string, uId: string, e?: React.MouseEvent) => {
                    if (e) e.stopPropagation();
                    setModules(prev => prev.map(m => {
                              if (m.id !== mId) return m;
                              return {
                                        ...m,
                                        units: m.units.map(u => u.id === uId ? { ...u, isCompleted: !u.isCompleted } : u)
                              };
                    }));
          };

          if (loading) {
                    return (
                              <div className="fixed inset-0 bg-orion-950 flex items-center justify-center z-[100]">
                                        <div className="w-8 h-8 rounded-full border-2 border-nebula-500 border-t-transparent animate-spin" />
                              </div>
                    );
          }

          if (!course) return <div className="p-10 text-center">Curso no encontrado</div>;

          // Find currently active unit data
          const currentMod = modules.find(m => m.id === activeModule);
          const currentLesson = currentMod?.units.find(u => u.id === activeUnit);

          return (
                    <div className="fixed inset-0 bg-orion-950 text-text-primary flex flex-col z-[100] animate-fade-in">

                              {/* ── Top Navbar (Player minimal header) ── */}
                              <header className="h-14 bg-orion-900 border-b border-border-subtle flex items-center justify-between px-4 shrink-0">
                                        <div className="flex items-center gap-4">
                                                  <button
                                                            onClick={() => router.push(`/app/student/courses/${courseId}`)}
                                                            className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-surface-glass text-text-muted hover:text-text-primary transition-colors"
                                                  >
                                                            <ArrowLeft className="w-4 h-4" />
                                                  </button>
                                                  <div className="hidden sm:block h-6 w-px bg-border-subtle" />
                                                  <div className="hidden sm:flex items-center gap-2">
                                                            <Logo size="sm" />
                                                  </div>
                                                  <div className="h-6 w-px bg-border-subtle" />
                                                  <h1 className="font-semibold text-sm truncate max-w-[200px] sm:max-w-md">{course.title}</h1>
                                        </div>

                                        <div className="flex items-center gap-3">
                                                  <div className="hidden md:flex items-center gap-2 mr-2">
                                                            <div className="w-32 h-1.5 rounded-full bg-surface-glass overflow-hidden">
                                                                      <div className="h-full bg-gradient-to-r from-nebula-500 to-astral-500" style={{ width: '35%' }} />
                                                            </div>
                                                            <span className="text-xs text-text-muted font-medium">35%</span>
                                                  </div>

                                                  <button onClick={toggleComplete} className="btn-primary text-xs py-1.5 px-4 hidden sm:flex">
                                                            {currentLesson?.isCompleted ? 'Desmarcar' : 'Completar y Continuar'}
                                                  </button>
                                        </div>
                              </header>

                              {/* ── Main Content Area ── */}
                              <div className="flex-1 flex overflow-hidden">

                                        {/* Left: Video/Content Area */}
                                        <main className="flex-1 flex flex-col bg-black relative">

                                                  {currentLesson?.type === 'activity' ? (
                                                            <div className="w-full flex-1 relative flex flex-col items-center justify-center bg-orion-950 overflow-hidden group p-8">
                                                                      <div className="absolute inset-0 mesh-gradient opacity-20" />
                                                                      <div className="z-20 max-w-2xl w-full bg-orion-900/50 backdrop-blur-md border border-border-subtle rounded-2xl p-8 shadow-2xl">
                                                                                <div className="flex items-center gap-4 mb-6">
                                                                                          <div className="w-12 h-12 rounded-xl bg-astral-500/20 border border-astral-500/30 flex items-center justify-center">
                                                                                                    <FileText className="w-6 h-6 text-astral-400" />
                                                                                          </div>
                                                                                          <div>
                                                                                                    <h2 className="text-xl font-display font-bold text-text-primary">{currentLesson.title}</h2>
                                                                                                    <p className="text-sm text-text-muted">Entrega de tarea • {currentLesson.duration}</p>
                                                                                          </div>
                                                                                </div>
                                                                                <p className="text-sm text-text-secondary mb-8">
                                                                                          Para esta actividad, debes desarrollar el proyecto final del módulo y subir el código fuente o el documento en formato PDF. Asegúrate de cumplir con todos los requisitos de entrega.
                                                                                </p>
                                                                                <div className="border-2 border-dashed border-border-default rounded-xl p-8 text-center hover:bg-surface-glass hover:border-nebula-500/50 transition-colors cursor-pointer mb-6">
                                                                                          <UploadCloud className="w-8 h-8 text-text-muted mx-auto mb-3" />
                                                                                          <p className="text-sm font-medium text-text-primary mb-1">Haz clic para subir tu archivo</p>
                                                                                          <p className="text-xs text-text-muted">PDF, ZIP o RAR (máx. 50MB)</p>
                                                                                </div>
                                                                                <div className="flex justify-end">
                                                                                          <button onClick={() => toggleUnitComplete(activeModule!, activeUnit!)} className="btn-primary">
                                                                                                    {currentLesson.isCompleted ? 'Actualizar Entrega' : 'Entregar Tarea'}
                                                                                          </button>
                                                                                </div>
                                                                      </div>
                                                            </div>
                                                  ) : (
                                                            <div className="w-full flex-1 relative flex items-center justify-center bg-orion-950 overflow-hidden group">
                                                                      {/* Mesh background for the fake "video" */}
                                                                      <div className="absolute inset-0 mesh-gradient opacity-40 mix-blend-screen" />
                                                                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10" />

                                                                      {/* Play Button Overlay */}
                                                                      <button className="relative z-20 w-20 h-20 rounded-full bg-nebula-500/20 backdrop-blur-md border border-nebula-400/30 flex items-center justify-center hover:scale-110 hover:bg-nebula-500/40 transition-transform cursor-pointer group-hover:shadow-[0_0_40px_rgba(108,92,231,0.5)]">
                                                                                <PlayCircle className="w-10 h-10 text-white ml-1" />
                                                                      </button>

                                                                      {/* Title overlay */}
                                                                      <div className="absolute bottom-6 left-6 z-20">
                                                                                <span className="badge badge-purple mb-2">Lección {currentMod?.order}.1</span>
                                                                                <h2 className="text-2xl font-display font-bold text-white">{currentLesson?.title || 'Contenido de la lección'}</h2>
                                                                      </div>

                                                                      {/* Video Controls Mock */}
                                                                      <div className="absolute bottom-0 inset-x-0 h-1.5 bg-white/20 z-20 group-hover:h-2 transition-all cursor-pointer">
                                                                                <div className="h-full bg-nebula-500 w-1/3 relative">
                                                                                          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white scale-0 group-hover:scale-100 transition-transform" />
                                                                                </div>
                                                                      </div>
                                                                      <div className="absolute bottom-4 right-6 z-20 flex items-center gap-4 text-white/70 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                                <Settings className="w-5 h-5 hover:text-white cursor-pointer" />
                                                                                <Maximize className="w-5 h-5 hover:text-white cursor-pointer" />
                                                                      </div>
                                                            </div>
                                                  )}

                                                  {/* Lesson Metadata Bar */}
                                                  <div className="h-16 bg-orion-900 border-t border-border-subtle flex items-center justify-between px-6 shrink-0 z-30">
                                                            <div className="flex items-center gap-4">
                                                                      <button
                                                                                onClick={() => setSidebarOpen(!sidebarOpen)}
                                                                                className="lg:hidden w-10 h-10 rounded-xl bg-surface-glass border border-border-subtle flex items-center justify-center text-text-secondary"
                                                                      >
                                                                                {sidebarOpen ? <ChevronRight className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                                                                      </button>
                                                                      <div>
                                                                                <h3 className="font-semibold text-sm">{currentLesson?.title}</h3>
                                                                                <p className="text-xs text-text-muted">{currentMod?.title}</p>
                                                                      </div>
                                                            </div>
                                                            <div className="flex items-center gap-3">
                                                                      <button className="flex items-center gap-2 text-xs text-text-secondary hover:text-text-primary px-3 py-2 rounded-lg hover:bg-surface-glass transition-colors">
                                                                                <MessageSquare className="w-4 h-4" />
                                                                                <span className="hidden sm:inline">Discusión (12)</span>
                                                                      </button>
                                                                      <button onClick={toggleComplete} className="sm:hidden btn-primary text-xs px-3 py-2">
                                                                                Siguiente
                                                                      </button>
                                                            </div>
                                                  </div>
                                        </main>

                                        {/* Right: Syllabus Sidebar */}
                                        <aside className={`w-[320px] bg-orion-900 border-l border-border-subtle flex flex-col shrink-0 transition-transform duration-300 absolute lg:relative inset-y-0 right-0 z-40 transform ${sidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}`}>
                                                  <div className="p-4 border-b border-border-subtle">
                                                            <h3 className="font-semibold text-sm mb-1">Contenido del curso</h3>
                                                            <p className="text-xs text-text-muted">{modules.length} módulos • 4h 30m total</p>
                                                  </div>

                                                  <div className="flex-1 overflow-y-auto px-2 py-2 space-y-1 custom-scrollbar">
                                                            {modules.map(m => (
                                                                      <div key={m.id} className="mb-2">
                                                                                <button
                                                                                          onClick={() => toggleModule(m.id)}
                                                                                          className={`w-full flex items-center justify-between p-3 rounded-xl text-left transition-colors ${openModules.has(m.id) ? 'bg-surface-card' : 'hover:bg-surface-glass'}`}
                                                                                >
                                                                                          <div className="flex-1 pr-3">
                                                                                                    <p className="text-xs font-semibold text-text-primary leading-tight">Módulo {m.order}: {m.title}</p>
                                                                                                    <p className="text-[10px] text-text-muted mt-1">{m.units.filter(u => u.isCompleted).length}/{m.units.length} completados</p>
                                                                                          </div>
                                                                                          {openModules.has(m.id) ? <ChevronDown className="w-4 h-4 text-text-muted shrink-0" /> : <ChevronRight className="w-4 h-4 text-text-muted shrink-0" />}
                                                                                </button>

                                                                                {openModules.has(m.id) && (
                                                                                          <div className="mt-1 pl-2 border-l border-border-subtle ml-4 space-y-1">
                                                                                                    {m.units.map(u => {
                                                                                                              const isActive = activeModule === m.id && activeUnit === u.id;
                                                                                                              return (
                                                                                                                        <button
                                                                                                                                  key={u.id}
                                                                                                                                  onClick={() => handleUnitClick(m.id, u.id)}
                                                                                                                                  className={`w-full flex items-start gap-3 p-2.5 rounded-lg text-left transition-colors group ${isActive ? 'bg-nebula-500/10 text-nebula-300' : 'hover:bg-surface-glass text-text-secondary hover:text-text-primary'}`}
                                                                                                                        >
                                                                                                                                  <div className="shrink-0 mt-0.5" onClick={(e) => toggleUnitComplete(m.id, u.id, e)} role="button" aria-label="Marcar como completado" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && toggleUnitComplete(m.id, u.id)}>
                                                                                                                                            {u.isCompleted
                                                                                                                                                      ? <CheckCircle className="w-4 h-4 text-emerald-400 hover:text-emerald-500 transition-colors" />
                                                                                                                                                      : isActive
                                                                                                                                                                ? <PlayCircle className="w-4 h-4 text-nebula-400 hover:text-nebula-500 transition-colors" />
                                                                                                                                                                : u.type === 'video'
                                                                                                                                                                          ? <Circle className="w-4 h-4 text-text-muted hover:text-text-primary transition-colors" />
                                                                                                                                                                          : <FileText className="w-4 h-4 text-text-muted hover:text-text-primary transition-colors" />
                                                                                                                                            }
                                                                                                                                  </div>
                                                                                                                                  <div className="flex-1 min-w-0">
                                                                                                                                            <p className={`text-xs ${isActive ? 'font-semibold' : ''} leading-snug line-clamp-2`}>{u.title}</p>
                                                                                                                                            <span className="text-[10px] text-text-muted mt-0.5 block flex items-center gap-1">
                                                                                                                                                      {u.type === 'video' ? 'Video' : u.type === 'quiz' ? 'Quiz' : 'Lectura'}
                                                                                                                                                      {u.duration && ` • ${u.duration}`}
                                                                                                                                            </span>
                                                                                                                                  </div>
                                                                                                                        </button>
                                                                                                              );
                                                                                                    })}
                                                                                          </div>
                                                                                )}
                                                                      </div>
                                                            ))}
                                                  </div>
                                        </aside>

                                        {/* Mobile backdrop for sidebar */}
                                        {sidebarOpen && (
                                                  <div
                                                            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
                                                            onClick={() => setSidebarOpen(false)}
                                                  />
                                        )}
                              </div>
                    </div>
          );
}
