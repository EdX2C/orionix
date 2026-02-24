'use client';
// ===== Teacher: Professional Course Creation Wizard =====
import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { courseService } from '@/services';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import {
          ArrowLeft, ArrowRight, Check, Loader2, BookOpen, FileText, Settings,
          Eye, Sparkles, Plus, Trash2, GripVertical, Calendar, Users, Tag,
          BarChart3, Save, CheckCircle, Rocket, AlertCircle
} from 'lucide-react';

// ── Step Definitions ──
const stepsMeta = [
          { label: 'Información', icon: BookOpen, desc: 'Nombre, categoría y nivel' },
          { label: 'Contenido', icon: FileText, desc: 'Módulos y descripción' },
          { label: 'Configuración', icon: Settings, desc: 'Fechas y cupo' },
          { label: 'Revisión', icon: Eye, desc: 'Verificar todo' },
          { label: 'Publicar', icon: Sparkles, desc: 'Confirmar creación' },
];

const categories = ['Programación', 'Inteligencia Artificial', 'Diseño', 'Desarrollo Web', 'Ciencia de Datos', 'Ciberseguridad', 'Bases de Datos'];
const levelLabels: Record<string, string> = { beginner: 'Principiante', intermediate: 'Intermedio', advanced: 'Avanzado' };

interface WizardModule {
          id: string;
          title: string;
          description: string;
}

export default function CreateCoursePage() {
          const { user } = useAuth();
          const { addToast } = useToast();
          const router = useRouter();

          const [step, setStep] = useState(0);
          const [loading, setLoading] = useState(false);
          const [autoSaved, setAutoSaved] = useState(false);
          const [autoSaving, setAutoSaving] = useState(false);

          const [form, setForm] = useState({
                    title: '', description: '', shortDescription: '',
                    category: '', level: 'beginner' as 'beginner' | 'intermediate' | 'advanced',
                    tags: '', capacity: '30', startDate: '', endDate: '',
          });
          const [modules, setModules] = useState<WizardModule[]>([]);
          const [errors, setErrors] = useState<Record<string, string>>({});

          // ── Auto-save simulation ──
          const triggerAutoSave = useCallback(() => {
                    setAutoSaving(true);
                    setTimeout(() => {
                              setAutoSaving(false);
                              setAutoSaved(true);
                              setTimeout(() => setAutoSaved(false), 2000);
                    }, 800);
          }, []);

          useEffect(() => {
                    if (step < 3) {
                              const t = setTimeout(triggerAutoSave, 2000);
                              return () => clearTimeout(t);
                    }
          }, [form, modules, step, triggerAutoSave]);

          // ── Field update helper ──
          const update = (key: string, val: string) => {
                    setForm(p => ({ ...p, [key]: val }));
                    setErrors(p => { const { [key]: _, ...rest } = p; return rest; });
          };

          // ── Module management ──
          const addModule = () => {
                    setModules(p => [...p, { id: `m-${Date.now()}`, title: '', description: '' }]);
          };

          const updateModule = (id: string, field: keyof WizardModule, val: string) => {
                    setModules(p => p.map(m => m.id === id ? { ...m, [field]: val } : m));
          };

          const removeModule = (id: string) => {
                    setModules(p => p.filter(m => m.id !== id));
          };

          // ── Validation per step ──
          const validateStep = (): boolean => {
                    const e: Record<string, string> = {};
                    if (step === 0) {
                              if (!form.title.trim()) e.title = 'El título es obligatorio';
                              if (!form.shortDescription.trim()) e.shortDescription = 'La descripción corta es obligatoria';
                              if (!form.category) e.category = 'Selecciona una categoría';
                    }
                    if (step === 2) {
                              if (!form.startDate) e.startDate = 'Selecciona una fecha de inicio';
                              if (!form.endDate) e.endDate = 'Selecciona una fecha de fin';
                              if (form.startDate && form.endDate && new Date(form.startDate) >= new Date(form.endDate)) {
                                        e.endDate = 'La fecha de fin debe ser posterior al inicio';
                              }
                              if (parseInt(form.capacity) < 1) e.capacity = 'El cupo mínimo es 1';
                    }
                    setErrors(e);
                    return Object.keys(e).length === 0;
          };

          const next = () => {
                    if (step === 3) { setStep(4); return; }
                    if (validateStep()) setStep(s => Math.min(s + 1, 4));
          };
          const prev = () => setStep(s => Math.max(s - 1, 0));

          const handleCreate = async () => {
                    setLoading(true);
                    await courseService.create({
                              ...form,
                              tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
                              capacity: parseInt(form.capacity),
                              teacherId: user?.id || '',
                              teacherName: user?.name || '',
                    });
                    setStep(4);
                    setLoading(false);
          };

          // ── Progress percentage ──
          const progressPct = Math.round((step / (stepsMeta.length - 1)) * 100);

          return (
                    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
                              {/* ── Header ── */}
                              <div className="flex items-center justify-between">
                                        <div>
                                                  <button onClick={() => router.back()} className="text-sm text-text-muted hover:text-text-primary flex items-center gap-1 mb-3 transition-colors">
                                                            <ArrowLeft className="w-4 h-4" /> Volver
                                                  </button>
                                                  <h1 className="text-2xl md:text-3xl font-display font-bold">Crear nuevo curso</h1>
                                                  <p className="text-sm text-text-muted mt-1">Paso {step + 1} de {stepsMeta.length}: {stepsMeta[step].desc}</p>
                                        </div>
                                        {/* Auto-save indicator */}
                                        <div className="flex items-center gap-2 text-xs text-text-muted">
                                                  {autoSaving && (
                                                            <span className="flex items-center gap-1.5 text-amber-400">
                                                                      <Save className="w-3.5 h-3.5 animate-pulse" /> Guardando...
                                                            </span>
                                                  )}
                                                  {autoSaved && (
                                                            <span className="flex items-center gap-1.5 text-emerald-400 animate-fade-in">
                                                                      <CheckCircle className="w-3.5 h-3.5" /> Guardado
                                                            </span>
                                                  )}
                                        </div>
                              </div>

                              {/* ── Visual Stepper ── */}
                              <div className="space-y-3">
                                        {/* Progress bar */}
                                        <div className="h-1.5 rounded-full bg-orion-800 overflow-hidden">
                                                  <div
                                                            className="h-full rounded-full bg-gradient-to-r from-nebula-500 to-astral-500 transition-all duration-500 ease-out"
                                                            style={{ width: `${progressPct}%` }}
                                                  />
                                        </div>

                                        {/* Step indicators */}
                                        <div className="flex items-center justify-between">
                                                  {stepsMeta.map((s, i) => (
                                                            <button
                                                                      key={i}
                                                                      onClick={() => { if (i < step) setStep(i); }}
                                                                      disabled={i > step}
                                                                      className={`flex items-center gap-2 transition-all text-xs font-medium ${i === step
                                                                                ? 'text-nebula-400'
                                                                                : i < step
                                                                                          ? 'text-emerald-400 cursor-pointer hover:text-emerald-300'
                                                                                          : 'text-text-muted cursor-not-allowed opacity-50'
                                                                                }`}
                                                            >
                                                                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold border transition-all ${i === step
                                                                                ? 'bg-nebula-500/15 border-nebula-500/30 text-nebula-400 shadow-lg shadow-nebula-500/10'
                                                                                : i < step
                                                                                          ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
                                                                                          : 'bg-surface-glass border-border-subtle text-text-muted'
                                                                                }`}>
                                                                                {i < step ? <Check className="w-4 h-4" /> : i + 1}
                                                                      </div>
                                                                      <span className="hidden sm:inline">{s.label}</span>
                                                            </button>
                                                  ))}
                                        </div>
                              </div>

                              {/* ── Step Content ── */}
                              <div className="orionix-card p-6 md:p-8" style={{ transform: 'none' }}>
                                        {/* ── STEP 0: Basic Info ── */}
                                        {step === 0 && (
                                                  <div className="space-y-5 animate-fade-in">
                                                            <div className="flex items-center gap-2 mb-2">
                                                                      <BookOpen className="w-5 h-5 text-nebula-400" />
                                                                      <h2 className="text-lg font-display font-semibold">Información básica</h2>
                                                            </div>

                                                            <div>
                                                                      <label htmlFor="title" className="block text-xs font-semibold text-text-secondary mb-1.5">Título del curso <span className="text-red-400">*</span></label>
                                                                      <input
                                                                                id="title"
                                                                                name="title"
                                                                                value={form.title}
                                                                                onChange={e => update('title', e.target.value)}
                                                                                className={`orionix-input ${errors.title ? 'border-red-500/50' : ''}`}
                                                                                placeholder="Ej: Fundamentos de Python para Data Science"
                                                                                aria-invalid={!!errors.title}
                                                                                aria-describedby={errors.title ? "title-error" : undefined}
                                                                      />
                                                                      {errors.title && <p id="title-error" className="text-xs text-red-400 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.title}</p>}
                                                            </div>

                                                            <div>
                                                                      <label htmlFor="shortDescription" className="block text-xs font-semibold text-text-secondary mb-1.5">Descripción corta <span className="text-red-400">*</span></label>
                                                                      <input
                                                                                id="shortDescription"
                                                                                name="shortDescription"
                                                                                value={form.shortDescription}
                                                                                onChange={e => update('shortDescription', e.target.value)}
                                                                                className={`orionix-input ${errors.shortDescription ? 'border-red-500/50' : ''}`}
                                                                                placeholder="Resumen en una línea que aparecerá en el catálogo"
                                                                                aria-invalid={!!errors.shortDescription}
                                                                                aria-describedby={errors.shortDescription ? "shortDescription-error" : undefined}
                                                                      />
                                                                      {errors.shortDescription && <p id="shortDescription-error" className="text-xs text-red-400 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.shortDescription}</p>}
                                                                      <p className="text-[10px] text-text-muted mt-1">{form.shortDescription.length}/120 caracteres</p>
                                                            </div>

                                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                                      <div>
                                                                                <label htmlFor="category" className="block text-xs font-semibold text-text-secondary mb-1.5">Categoría <span className="text-red-400">*</span></label>
                                                                                <select
                                                                                          id="category"
                                                                                          name="category"
                                                                                          value={form.category}
                                                                                          onChange={e => update('category', e.target.value)}
                                                                                          className={`orionix-input cursor-pointer ${errors.category ? 'border-red-500/50' : ''}`}
                                                                                          aria-invalid={!!errors.category}
                                                                                          aria-describedby={errors.category ? "category-error" : undefined}
                                                                                >
                                                                                          <option value="">Seleccionar...</option>
                                                                                          {categories.map(c => <option key={c} value={c}>{c}</option>)}
                                                                                </select>
                                                                                {errors.category && <p id="category-error" className="text-xs text-red-400 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.category}</p>}
                                                                      </div>

                                                                      <div>
                                                                                <label className="block text-xs font-semibold text-text-secondary mb-1.5">Nivel</label>
                                                                                <div className="flex gap-2">
                                                                                          {(['beginner', 'intermediate', 'advanced'] as const).map(l => (
                                                                                                    <button key={l} type="button" onClick={() => update('level', l)}
                                                                                                              className={`flex-1 py-2.5 rounded-xl text-xs font-medium border transition-all ${form.level === l
                                                                                                                        ? 'bg-nebula-500/15 border-nebula-500/30 text-nebula-300'
                                                                                                                        : 'bg-surface-glass border-border-subtle text-text-muted hover:text-text-secondary hover:bg-surface-card'
                                                                                                                        }`}>
                                                                                                              {levelLabels[l]}
                                                                                                    </button>
                                                                                          ))}
                                                                                </div>
                                                                      </div>
                                                            </div>
                                                  </div>
                                        )}

                                        {/* ── STEP 1: Content & Modules ── */}
                                        {step === 1 && (
                                                  <div className="space-y-5 animate-fade-in">
                                                            <div className="flex items-center gap-2 mb-2">
                                                                      <FileText className="w-5 h-5 text-astral-400" />
                                                                      <h2 className="text-lg font-display font-semibold">Contenido del curso</h2>
                                                            </div>

                                                            <div>
                                                                      <label htmlFor="description" className="block text-xs font-semibold text-text-secondary mb-1.5">Descripción completa</label>
                                                                      <textarea
                                                                                id="description"
                                                                                name="description"
                                                                                value={form.description}
                                                                                onChange={e => update('description', e.target.value)}
                                                                                className="orionix-input min-h-[120px] resize-none"
                                                                                placeholder="Describe los objetivos de aprendizaje, el contenido que se cubrirá y lo que los estudiantes podrán hacer al finalizar..."
                                                                      />
                                                                      <p className="text-[10px] text-text-muted mt-1">{form.description.length} caracteres</p>
                                                            </div>

                                                            <div>
                                                                      <label htmlFor="tags" className="block text-xs font-semibold text-text-secondary mb-1.5">Tags <span className="text-text-muted">(separados por coma)</span></label>
                                                                      <input id="tags" name="tags" value={form.tags} onChange={e => update('tags', e.target.value)}
                                                                                className="orionix-input" placeholder="Python, Backend, Machine Learning" />
                                                                      {form.tags && (
                                                                                <div className="flex flex-wrap gap-1.5 mt-2">
                                                                                          {form.tags.split(',').map(t => t.trim()).filter(Boolean).map((tag, i) => (
                                                                                                    <span key={i} className="px-2.5 py-1 rounded-lg bg-nebula-500/10 border border-nebula-500/20 text-[10px] font-medium text-nebula-400">{tag}</span>
                                                                                          ))}
                                                                                </div>
                                                                      )}
                                                            </div>

                                                            {/* Module builder */}
                                                            <div className="border-t border-border-subtle pt-5">
                                                                      <div className="flex items-center justify-between mb-3">
                                                                                <label className="text-xs font-semibold text-text-secondary">Módulos del curso <span className="text-text-muted">(opcional)</span></label>
                                                                                <button type="button" onClick={addModule} className="btn-sm btn-secondary flex items-center gap-1.5">
                                                                                          <Plus className="w-3.5 h-3.5" /> Agregar módulo
                                                                                </button>
                                                                      </div>

                                                                      {modules.length === 0 ? (
                                                                                <div className="glass rounded-xl p-5 text-center">
                                                                                          <FileText className="w-8 h-8 text-text-muted mx-auto mb-2" strokeWidth={1} />
                                                                                          <p className="text-xs text-text-muted">No hay módulos aún. Puedes agregarlos ahora o después desde la vista de gestión del curso.</p>
                                                                                </div>
                                                                      ) : (
                                                                                <div className="space-y-3">
                                                                                          {modules.map((mod, i) => (
                                                                                                    <div key={mod.id} className="glass rounded-xl p-4 space-y-3 group">
                                                                                                              <div className="flex items-center gap-3">
                                                                                                                        <GripVertical className="w-4 h-4 text-text-muted opacity-0 group-hover:opacity-100 transition-opacity cursor-grab" />
                                                                                                                        <div className="w-7 h-7 rounded-lg bg-nebula-500/10 border border-nebula-500/20 flex items-center justify-center">
                                                                                                                                  <span className="text-[10px] font-bold text-nebula-400">{i + 1}</span>
                                                                                                                        </div>
                                                                                                                        <input
                                                                                                                                  id={`module-title-${mod.id}`}
                                                                                                                                  aria-label={`Título del módulo ${i + 1}`}
                                                                                                                                  value={mod.title}
                                                                                                                                  onChange={e => updateModule(mod.id, 'title', e.target.value)}
                                                                                                                                  className="orionix-input flex-1 text-sm"
                                                                                                                                  placeholder={`Módulo ${i + 1}: Título`}
                                                                                                                        />
                                                                                                                        <button type="button" onClick={() => removeModule(mod.id)} className="btn-icon text-text-muted hover:text-red-400 transition-colors">
                                                                                                                                  <Trash2 className="w-4 h-4" />
                                                                                                                        </button>
                                                                                                              </div>
                                                                                                              <textarea
                                                                                                                        id={`module-desc-${mod.id}`}
                                                                                                                        aria-label={`Descripción del módulo ${i + 1}`}
                                                                                                                        value={mod.description}
                                                                                                                        onChange={e => updateModule(mod.id, 'description', e.target.value)}
                                                                                                                        className="orionix-input text-xs min-h-[60px] resize-none ml-14 w-[calc(100%-3.5rem)]"
                                                                                                                        placeholder="Descripción breve del módulo..."
                                                                                                              />
                                                                                                    </div>
                                                                                          ))}
                                                                                </div>
                                                                      )}
                                                            </div>
                                                  </div>
                                        )}

                                        {/* ── STEP 2: Schedule & Capacity ── */}
                                        {step === 2 && (
                                                  <div className="space-y-5 animate-fade-in">
                                                            <div className="flex items-center gap-2 mb-2">
                                                                      <Settings className="w-5 h-5 text-emerald-400" />
                                                                      <h2 className="text-lg font-display font-semibold">Configuración</h2>
                                                            </div>

                                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                                                      <div>
                                                                                <label htmlFor="startDate" className="block text-xs font-semibold text-text-secondary mb-1.5 flex items-center gap-1.5">
                                                                                          <Calendar className="w-3.5 h-3.5 text-text-muted" aria-hidden="true" /> Fecha de inicio <span className="text-red-400">*</span>
                                                                                </label>
                                                                                <input
                                                                                          id="startDate"
                                                                                          name="startDate"
                                                                                          type="date"
                                                                                          value={form.startDate}
                                                                                          onChange={e => update('startDate', e.target.value)}
                                                                                          className={`orionix-input ${errors.startDate ? 'border-red-500/50' : ''}`}
                                                                                          aria-invalid={!!errors.startDate}
                                                                                          aria-describedby={errors.startDate ? "startDate-error" : undefined}
                                                                                />
                                                                                {errors.startDate && <p id="startDate-error" className="text-xs text-red-400 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.startDate}</p>}
                                                                      </div>
                                                                      <div>
                                                                                <label htmlFor="endDate" className="block text-xs font-semibold text-text-secondary mb-1.5 flex items-center gap-1.5">
                                                                                          <Calendar className="w-3.5 h-3.5 text-text-muted" aria-hidden="true" /> Fecha de fin <span className="text-red-400">*</span>
                                                                                </label>
                                                                                <input
                                                                                          id="endDate"
                                                                                          name="endDate"
                                                                                          type="date"
                                                                                          value={form.endDate}
                                                                                          onChange={e => update('endDate', e.target.value)}
                                                                                          className={`orionix-input ${errors.endDate ? 'border-red-500/50' : ''}`}
                                                                                          aria-invalid={!!errors.endDate}
                                                                                          aria-describedby={errors.endDate ? "endDate-error" : undefined}
                                                                                />
                                                                                {errors.endDate && <p id="endDate-error" className="text-xs text-red-400 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.endDate}</p>}
                                                                      </div>
                                                            </div>

                                                            <div>
                                                                      <label htmlFor="capacity" className="block text-xs font-semibold text-text-secondary mb-1.5 flex items-center gap-1.5">
                                                                                <Users className="w-3.5 h-3.5 text-text-muted" aria-hidden="true" /> Cupo máximo de estudiantes
                                                                      </label>
                                                                      <input
                                                                                id="capacity"
                                                                                name="capacity"
                                                                                type="number"
                                                                                value={form.capacity}
                                                                                onChange={e => update('capacity', e.target.value)}
                                                                                className={`orionix-input max-w-[200px] ${errors.capacity ? 'border-red-500/50' : ''}`}
                                                                                min="1"
                                                                                max="500"
                                                                                aria-invalid={!!errors.capacity}
                                                                                aria-describedby={errors.capacity ? "capacity-error" : undefined}
                                                                      />
                                                                      {errors.capacity && <p id="capacity-error" className="text-xs text-red-400 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.capacity}</p>}
                                                                      <p className="text-[10px] text-text-muted mt-1">Máximo 500 estudiantes por curso</p>
                                                            </div>

                                                            <div className="glass rounded-xl p-4 text-xs text-text-muted flex items-start gap-2">
                                                                      <AlertCircle className="w-4 h-4 text-astral-400 shrink-0 mt-0.5" />
                                                                      <p>El curso se creará como <strong className="text-text-secondary">borrador</strong>. Podrás publicarlo después desde la vista de gestión cuando estés listo.</p>
                                                            </div>
                                                  </div>
                                        )}

                                        {/* ── STEP 3: Review ── */}
                                        {step === 3 && (
                                                  <div className="space-y-5 animate-fade-in">
                                                            <div className="flex items-center gap-2 mb-2">
                                                                      <Eye className="w-5 h-5 text-amber-400" />
                                                                      <h2 className="text-lg font-display font-semibold">Revisión final</h2>
                                                            </div>

                                                            <p className="text-sm text-text-muted">Verifica que toda la información sea correcta antes de crear el curso.</p>

                                                            {/* Review Cards */}
                                                            <div className="space-y-4">
                                                                      {/* Basic Info */}
                                                                      <div className="glass rounded-xl p-5 space-y-3">
                                                                                <div className="flex items-center justify-between">
                                                                                          <h3 className="text-xs font-semibold text-text-secondary flex items-center gap-1.5"><BookOpen className="w-3.5 h-3.5 text-nebula-400" /> Información básica</h3>
                                                                                          <button onClick={() => setStep(0)} className="text-[10px] text-nebula-400 hover:text-nebula-300 transition-colors">Editar</button>
                                                                                </div>
                                                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                                                                                          <div><span className="text-text-muted text-xs">Título:</span><p className="text-text-primary font-medium">{form.title || '—'}</p></div>
                                                                                          <div><span className="text-text-muted text-xs">Categoría:</span><p className="text-text-primary font-medium">{form.category || '—'}</p></div>
                                                                                          <div><span className="text-text-muted text-xs">Nivel:</span><p className="text-text-primary font-medium">{levelLabels[form.level]}</p></div>
                                                                                          <div><span className="text-text-muted text-xs">Descripción corta:</span><p className="text-text-primary font-medium line-clamp-2">{form.shortDescription || '—'}</p></div>
                                                                                </div>
                                                                      </div>

                                                                      {/* Content */}
                                                                      <div className="glass rounded-xl p-5 space-y-3">
                                                                                <div className="flex items-center justify-between">
                                                                                          <h3 className="text-xs font-semibold text-text-secondary flex items-center gap-1.5"><FileText className="w-3.5 h-3.5 text-astral-400" /> Contenido</h3>
                                                                                          <button onClick={() => setStep(1)} className="text-[10px] text-nebula-400 hover:text-nebula-300 transition-colors">Editar</button>
                                                                                </div>
                                                                                <div className="text-sm">
                                                                                          <p className="text-text-primary line-clamp-3">{form.description || <span className="text-text-muted italic">Sin descripción completa</span>}</p>
                                                                                          {form.tags && (
                                                                                                    <div className="flex flex-wrap gap-1.5 mt-3">
                                                                                                              {form.tags.split(',').map(t => t.trim()).filter(Boolean).map((tag, i) => (
                                                                                                                        <span key={i} className="px-2 py-0.5 rounded-md bg-nebula-500/10 text-[10px] text-nebula-400">{tag}</span>
                                                                                                              ))}
                                                                                                    </div>
                                                                                          )}
                                                                                          <p className="text-xs text-text-muted mt-2">{modules.length} módulo{modules.length !== 1 ? 's' : ''} definido{modules.length !== 1 ? 's' : ''}</p>
                                                                                </div>
                                                                      </div>

                                                                      {/* Config */}
                                                                      <div className="glass rounded-xl p-5 space-y-3">
                                                                                <div className="flex items-center justify-between">
                                                                                          <h3 className="text-xs font-semibold text-text-secondary flex items-center gap-1.5"><Settings className="w-3.5 h-3.5 text-emerald-400" /> Configuración</h3>
                                                                                          <button onClick={() => setStep(2)} className="text-[10px] text-nebula-400 hover:text-nebula-300 transition-colors">Editar</button>
                                                                                </div>
                                                                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                                                                                          <div><span className="text-text-muted text-xs">Inicio:</span><p className="text-text-primary font-medium">{form.startDate ? new Date(form.startDate).toLocaleDateString('es', { day: 'numeric', month: 'long', year: 'numeric' }) : '—'}</p></div>
                                                                                          <div><span className="text-text-muted text-xs">Fin:</span><p className="text-text-primary font-medium">{form.endDate ? new Date(form.endDate).toLocaleDateString('es', { day: 'numeric', month: 'long', year: 'numeric' }) : '—'}</p></div>
                                                                                          <div><span className="text-text-muted text-xs">Cupo:</span><p className="text-text-primary font-medium">{form.capacity} estudiantes</p></div>
                                                                                </div>
                                                                      </div>
                                                            </div>
                                                  </div>
                                        )}

                                        {/* ── STEP 4: Success Confirmation ── */}
                                        {step === 4 && (
                                                  <div className="text-center py-8 animate-fade-in">
                                                            <div className="relative w-24 h-24 mx-auto mb-6">
                                                                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-astral-500/10 border border-emerald-500/20 animate-pulse-glow" />
                                                                      <div className="absolute inset-0 flex items-center justify-center">
                                                                                <Rocket className="w-10 h-10 text-emerald-400" strokeWidth={1.3} />
                                                                      </div>
                                                            </div>
                                                            <h2 className="text-2xl font-display font-bold text-text-primary mb-2">¡Curso creado exitosamente!</h2>
                                                            <p className="text-text-secondary mb-2 max-w-md mx-auto">
                                                                      <strong className="text-text-primary">{form.title}</strong> ha sido creado como borrador. Puedes publicarlo cuando estés listo.
                                                            </p>
                                                            <p className="text-xs text-text-muted mb-8">Se crearán {modules.length} módulo{modules.length !== 1 ? 's' : ''} asociados al curso.</p>

                                                            <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                                                      <button onClick={() => router.push('/app/teacher/courses')} className="btn-primary flex items-center justify-center gap-2">
                                                                                <BookOpen className="w-4 h-4" /> Ir a mis cursos
                                                                      </button>
                                                                      <button onClick={() => { setStep(0); setForm({ title: '', description: '', shortDescription: '', category: '', level: 'beginner', tags: '', capacity: '30', startDate: '', endDate: '' }); setModules([]); }}
                                                                                className="btn-secondary flex items-center justify-center gap-2">
                                                                                <Plus className="w-4 h-4" /> Crear otro curso
                                                                      </button>
                                                            </div>
                                                  </div>
                                        )}

                                        {/* ── Navigation Bar ── */}
                                        {step < 4 && (
                                                  <div className="flex items-center justify-between pt-6 mt-6 border-t border-border-subtle">
                                                            <button onClick={prev} disabled={step === 0}
                                                                      className="btn-ghost flex items-center gap-1.5 disabled:opacity-30 disabled:cursor-not-allowed">
                                                                      <ArrowLeft className="w-4 h-4" /> Anterior
                                                            </button>

                                                            <div className="flex items-center gap-3">
                                                                      {step === 3 ? (
                                                                                <button onClick={handleCreate} disabled={loading}
                                                                                          className="btn-accent flex items-center gap-2 shadow-lg shadow-emerald-500/15">
                                                                                          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Rocket className="w-4 h-4" /> Crear curso</>}
                                                                                </button>
                                                                      ) : (
                                                                                <button onClick={next} className="btn-primary flex items-center gap-2">
                                                                                          Siguiente <ArrowRight className="w-4 h-4" />
                                                                                </button>
                                                                      )}
                                                            </div>
                                                  </div>
                                        )}
                              </div>
                    </div>
          );
}
