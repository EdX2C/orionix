'use client';
// ===== Teacher: Course Builder Mock =====
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { courseService } from '@/services';
import { getModulesByCourse } from '@/data/modules';
import { Course, Module, Unit } from '@/types';
import { useToast } from '@/context/ToastContext';
import { DashboardSkeleton } from '@/components/ui/Skeleton';
import {
          ArrowLeft, Plus, GripVertical, Video, FileText,
          Settings, Trash2, Edit2, PlayCircle, BookOpen, Clock,
          MoreVertical, CheckCircle, Save
} from 'lucide-react';

export default function CourseBuilderPage() {
          const params = useParams();
          const router = useRouter();
          const { addToast } = useToast();
          const courseId = params.id as string;

          const [course, setCourse] = useState<Course | null>(null);
          const [modules, setModules] = useState<Module[]>([]);
          const [loading, setLoading] = useState(true);

          // Mock Modal States
          const [activeModal, setActiveModal] = useState<'module' | 'unit' | null>(null);
          const [editingModuleId, setEditingModuleId] = useState<string | null>(null);
          const [newItemTitle, setNewItemTitle] = useState('');

          // Drag simulation state (visual only)
          const [draggingID, setDraggingID] = useState<string | null>(null);

          useEffect(() => {
                    const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') setActiveModal(null); };
                    window.addEventListener('keydown', handleEsc);
                    return () => window.removeEventListener('keydown', handleEsc);
          }, []);

          useEffect(() => {
                    courseService.getById(courseId).then(c => {
                              setCourse(c || null);
                              setModules(getModulesByCourse(courseId));
                              setLoading(false);
                    });
          }, [courseId]);

          const handleDragStart = (e: React.DragEvent, id: string) => {
                    setDraggingID(id);
                    e.dataTransfer.effectAllowed = 'move';
                    // Small delay to keep the original element visible while dragging the ghost
                    setTimeout(() => e.target instanceof HTMLElement && e.target.classList.add('opacity-50'), 0);
          };

          const handleDragEnd = (e: React.DragEvent) => {
                    setDraggingID(null);
                    e.target instanceof HTMLElement && e.target.classList.remove('opacity-50');
          };

          const handleSaveModule = () => {
                    if (!newItemTitle.trim()) return;

                    const newMod: Module = {
                              id: `m-new-${Date.now()}`,
                              courseId,
                              title: newItemTitle,
                              description: 'Nuevo módulo agregado',
                              order: modules.length + 1,
                              units: []
                    };

                    setModules(prev => [...prev, newMod]);
                    setNewItemTitle('');
                    setActiveModal(null);
                    addToast('Módulo creado exitosamente', 'success');
          };

          const handleSaveUnit = () => {
                    if (!newItemTitle.trim() || !editingModuleId) return;

                    const newUnit: Unit = {
                              id: `u-new-${Date.now()}`,
                              moduleId: editingModuleId,
                              title: newItemTitle,
                              type: 'video', // defaulting to video for mock
                              duration: '10:00'
                    };

                    setModules(prev => prev.map(m => {
                              if (m.id !== editingModuleId) return m;
                              return { ...m, units: [...m.units, newUnit] };
                    }));

                    setNewItemTitle('');
                    setActiveModal(null);
                    setEditingModuleId(null);
                    addToast('Lección agregada al módulo', 'success');
          };

          if (loading) return <DashboardSkeleton />;
          if (!course) return <div className="text-center py-20">Curso no encontrado</div>;

          const typeIcons: Record<string, React.ReactNode> = {
                    video: <Video className="w-4 h-4 text-astral-400" />,
                    lesson: <BookOpen className="w-4 h-4 text-nebula-400" />,
                    quiz: <CheckCircle className="w-4 h-4 text-emerald-400" />,
                    document: <FileText className="w-4 h-4 text-amber-400" />
          };

          return (
                    <div className="space-y-6 animate-fade-in relative pb-20">

                              {/* Header */}
                              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                        <div>
                                                  <button
                                                            onClick={() => router.push(`/app/teacher/courses/${courseId}`)}
                                                            className="flex items-center gap-1 text-sm text-text-muted hover:text-text-primary transition-colors mb-2"
                                                  >
                                                            <ArrowLeft className="w-4 h-4" /> Volver al panel del curso
                                                  </button>
                                                  <div className="flex items-center gap-3">
                                                            <h1 className="text-2xl font-display font-bold">Constructor de Contenido</h1>
                                                            <span className="badge badge-purple">Beta Builder</span>
                                                  </div>
                                                  <p className="text-sm text-text-secondary mt-1">Organiza el plan de estudios de <span className="text-text-primary font-medium">{course.title}</span></p>
                                        </div>

                                        <div className="flex items-center gap-3">
                                                  <button className="btn-secondary hidden sm:block">Vista Previa</button>
                                                  <button className="btn-primary flex items-center gap-2 shadow-lg shadow-nebula-500/20">
                                                            <Save className="w-4 h-4" /> Guardar Cambios
                                                  </button>
                                        </div>
                              </div>

                              {/* Main Builder Area */}
                              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                                        {/* Left: Syllabus Editor (Drag & Drop Mock) */}
                                        <div className="lg:col-span-2 space-y-4">

                                                  <div className="flex items-center justify-between bg-surface-glass border border-border-subtle p-3 rounded-xl mb-6">
                                                            <span className="text-sm font-medium pl-2">Plan de Estudios ({modules.length} Módulos)</span>
                                                            <button
                                                                      onClick={() => { setNewItemTitle(''); setActiveModal('module'); }}
                                                                      className="btn-secondary py-1.5 px-3 text-xs flex items-center gap-1 border-dashed"
                                                            >
                                                                      <Plus className="w-3.5 h-3.5" /> Agregar Módulo
                                                            </button>
                                                  </div>

                                                  <div className="space-y-4">
                                                            {modules.map((mod, index) => (
                                                                      <div
                                                                                key={mod.id}
                                                                                draggable
                                                                                onDragStart={(e) => handleDragStart(e, mod.id)}
                                                                                onDragEnd={handleDragEnd}
                                                                                className={`orionix-card bg-surface-card overflow-hidden border transition-all duration-200 ${draggingID === mod.id ? 'border-nebula-500/50 shadow-lg shadow-nebula-500/10' : 'border-border-subtle hover:border-border-default'}`}
                                                                                style={{ transform: draggingID === mod.id ? 'scale(1.02)' : 'none' }}
                                                                      >
                                                                                {/* Module Header */}
                                                                                <div className="flex items-center gap-3 p-4 bg-surface-glass border-b border-border-subtle group">
                                                                                          <div className="cursor-grab active:cursor-grabbing text-text-muted hover:text-text-primary opacity-50 group-hover:opacity-100 transition-opacity p-1">
                                                                                                    <GripVertical className="w-5 h-5" />
                                                                                          </div>
                                                                                          <div className="flex-1">
                                                                                                    <h3 className="font-semibold text-sm">Módulo {index + 1}: {mod.title}</h3>
                                                                                                    <p className="text-xs text-text-muted mt-0.5">{mod.units.length} elementos</p>
                                                                                          </div>

                                                                                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                                                    <button aria-label="Editar" className="p-1.5 text-text-muted hover:text-text-primary hover:bg-surface-glass rounded-lg"><Edit2 className="w-4 h-4" aria-hidden="true" /></button>
                                                                                                    <button aria-label="Eliminar" className="p-1.5 text-text-muted hover:text-red-400 hover:bg-red-500/10 rounded-lg"><Trash2 className="w-4 h-4" aria-hidden="true" /></button>
                                                                                          </div>
                                                                                </div>

                                                                                {/* Module Items (Units) */}
                                                                                <div className="p-2 space-y-1 bg-surface-card">
                                                                                          {mod.units.map((unit, uIndex) => (
                                                                                                    <div
                                                                                                              key={unit.id}
                                                                                                              className="flex items-center gap-3 p-2.5 rounded-lg border border-transparent hover:border-border-subtle hover:bg-surface-card-hover transition-colors group/item"
                                                                                                    >
                                                                                                              <div className="cursor-grab active:cursor-grabbing text-text-muted opacity-30 group-hover/item:opacity-100 ml-1">
                                                                                                                        <GripVertical className="w-4 h-4" />
                                                                                                              </div>
                                                                                                              <div className="w-8 h-8 rounded-lg bg-surface-glass flex items-center justify-center shrink-0 border border-border-subtle">
                                                                                                                        {typeIcons[String(unit.type)] || typeIcons.lesson}
                                                                                                              </div>
                                                                                                              <div className="flex-1 min-w-0">
                                                                                                                        <p className="text-sm font-medium text-text-secondary group-hover/item:text-text-primary transition-colors truncate">
                                                                                                                                  <span className="text-text-muted mr-1.5">{index + 1}.{uIndex + 1}</span> {unit.title}
                                                                                                                        </p>
                                                                                                              </div>
                                                                                                              <div className="flex items-center gap-3 text-xs text-text-muted">
                                                                                                                        {unit.duration && <span className="flex items-center gap-1 hidden sm:flex"><Clock className="w-3 h-3" /> {unit.duration}</span>}
                                                                                                                        <button aria-label="Ajustes" className="p-1 opacity-0 group-hover/item:opacity-100 hover:text-text-primary"><Settings className="w-4 h-4" aria-hidden="true" /></button>
                                                                                                              </div>
                                                                                                    </div>
                                                                                          ))}

                                                                                          {/* Add Unit Button */}
                                                                                          <div className="p-2 mt-1">
                                                                                                    <button
                                                                                                              onClick={() => { setEditingModuleId(mod.id); setNewItemTitle(''); setActiveModal('unit'); }}
                                                                                                              className="w-full py-2.5 border border-dashed border-border-subtle hover:border-nebula-500/50 rounded-lg flex items-center justify-center gap-2 text-xs text-text-muted hover:text-nebula-300 hover:bg-nebula-500/5 transition-all"
                                                                                                    >
                                                                                                              <Plus className="w-4 h-4" /> Agregar Lección o Material
                                                                                                    </button>
                                                                                          </div>
                                                                                </div>
                                                                      </div>
                                                            ))}
                                                  </div>

                                                  <div className="text-center py-10 opacity-50">
                                                            <p className="text-xs text-text-muted">Arrastra los módulos o lecciones para reordenarlos</p>
                                                  </div>
                                        </div>

                                        {/* Right: Settings / Inspector Tool */}
                                        <div className="space-y-4">
                                                  <div className="orionix-card p-5 sticky top-24" style={{ transform: 'none' }}>
                                                            <h3 className="font-semibold text-sm mb-4 border-b border-border-subtle pb-3">Herramientas</h3>

                                                            <div className="grid grid-cols-2 gap-3 mb-6">
                                                                      <button className="flex flex-col items-center justify-center gap-2 p-3 rounded-xl bg-surface-glass border border-border-subtle hover:border-astral-500/50 hover:bg-astral-500/10 transition-colors text-text-secondary hover:text-astral-300">
                                                                                <Video className="w-5 h-5 mb-1" />
                                                                                <span className="text-xs font-medium">Subir Video</span>
                                                                      </button>
                                                                      <button className="flex flex-col items-center justify-center gap-2 p-3 rounded-xl bg-surface-glass border border-border-subtle hover:border-amber-500/50 hover:bg-amber-500/10 transition-colors text-text-secondary hover:text-amber-300">
                                                                                <FileText className="w-5 h-5 mb-1" />
                                                                                <span className="text-xs font-medium">Documento</span>
                                                                      </button>
                                                                      <button className="flex flex-col items-center justify-center gap-2 p-3 rounded-xl bg-surface-glass border border-border-subtle hover:border-emerald-500/50 hover:bg-emerald-500/10 transition-colors text-text-secondary hover:text-emerald-300">
                                                                                <CheckCircle className="w-5 h-5 mb-1" />
                                                                                <span className="text-xs font-medium">Crear Quiz</span>
                                                                      </button>
                                                                      <button className="flex flex-col items-center justify-center gap-2 p-3 rounded-xl bg-surface-glass border border-border-subtle hover:border-nebula-500/50 hover:bg-nebula-500/10 transition-colors text-text-secondary hover:text-nebula-300">
                                                                                <PlayCircle className="w-5 h-5 mb-1" />
                                                                                <span className="text-xs font-medium">Clase en Vivo</span>
                                                                      </button>
                                                            </div>

                                                            <h3 className="font-semibold text-sm mb-3">Configuración Rápida</h3>
                                                            <div className="space-y-3">
                                                                      <label className="flex items-center justify-between p-2.5 rounded-lg border border-border-subtle bg-surface-glass cursor-pointer hover:bg-surface-card transition-colors">
                                                                                <span className="text-xs text-text-secondary font-medium">Requerir orden secuencial</span>
                                                                                <div className="w-8 h-4 bg-nebula-500 rounded-full relative">
                                                                                          <div className="absolute right-1 top-0.5 w-3 h-3 bg-white rounded-full" />
                                                                                </div>
                                                                      </label>
                                                                      <label className="flex items-center justify-between p-2.5 rounded-lg border border-border-subtle bg-surface-glass cursor-pointer hover:bg-surface-card transition-colors">
                                                                                <span className="text-xs text-text-secondary font-medium">Permitir descargar PDFs</span>
                                                                                <div className="w-8 h-4 bg-nebula-500 rounded-full relative">
                                                                                          <div className="absolute right-1 top-0.5 w-3 h-3 bg-white rounded-full" />
                                                                                </div>
                                                                      </label>
                                                            </div>
                                                  </div>
                                        </div>

                              </div>

                              {/* Mock Modals */}
                              {activeModal && (
                                        <div className="modal-overlay" onClick={() => setActiveModal(null)}>
                                                  <div className="modal-content max-w-sm" onClick={e => e.stopPropagation()}>
                                                            <h2 className="text-lg font-display font-semibold mb-4">
                                                                      {activeModal === 'module' ? 'Nuevo Módulo' : 'Nueva Lección'}
                                                            </h2>
                                                            <div className="space-y-4">
                                                                      <div>
                                                                                <label htmlFor="modalTitle" className="block text-xs font-semibold text-text-secondary mb-1.5">Título</label>
                                                                                <input
                                                                                          id="modalTitle"
                                                                                          name="modalTitle"
                                                                                          type="text"
                                                                                          autoFocus
                                                                                          placeholder={activeModal === 'module' ? 'Ej. Introducción al curso' : 'Ej. Bienvenido a la primera clase'}
                                                                                          value={newItemTitle}
                                                                                          onChange={e => setNewItemTitle(e.target.value)}
                                                                                          onKeyDown={e => {
                                                                                                    if (e.key === 'Enter') {
                                                                                                              activeModal === 'module' ? handleSaveModule() : handleSaveUnit();
                                                                                                    }
                                                                                          }}
                                                                                          className="orionix-input"
                                                                                />
                                                                      </div>
                                                                      <div className="flex justify-end gap-3 mt-6">
                                                                                <button onClick={() => setActiveModal(null)} className="btn-secondary text-sm">Cancelar</button>
                                                                                <button onClick={activeModal === 'module' ? handleSaveModule : handleSaveUnit} className="btn-primary text-sm shadow-md">
                                                                                          Crear {activeModal === 'module' ? 'Módulo' : 'Lección'}
                                                                                </button>
                                                                      </div>
                                                            </div>
                                                  </div>
                                        </div>
                              )}
                    </div>
          );
}
