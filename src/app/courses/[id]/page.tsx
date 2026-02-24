'use client';
// ===== Public Course Detail =====
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { courseService } from '@/services';
import { Course, Module } from '@/types';
import { DashboardSkeleton } from '@/components/ui/Skeleton';
import {
          BookOpen, Users, Star, GraduationCap, Clock, Calendar, ArrowLeft,
          CheckCircle, Play, ChevronDown, BarChart3, Award, ArrowRight
} from 'lucide-react';

const levelLabels: Record<string, string> = { beginner: 'Principiante', intermediate: 'Intermedio', advanced: 'Avanzado' };

export default function PublicCourseDetail() {
          const { id } = useParams();
          const [course, setCourse] = useState<Course | null>(null);
          const [modules, setModules] = useState<Module[]>([]);
          const [loading, setLoading] = useState(true);
          const [expandedModule, setExpandedModule] = useState<string | null>(null);

          useEffect(() => {
                    if (typeof id !== 'string') return;
                    Promise.all([
                              courseService.getById(id),
                              courseService.getModules(id),
                    ]).then(([c, m]) => {
                              setCourse(c ?? null);
                              setModules(m);
                              setLoading(false);
                    });
          }, [id]);

          if (loading) return (
                    <div className="min-h-screen starfield">
                              <div className="max-w-4xl mx-auto px-6 py-12"><DashboardSkeleton /></div>
                    </div>
          );

          if (!course) return (
                    <div className="min-h-screen starfield flex items-center justify-center">
                              <div className="text-center">
                                        <BookOpen className="w-12 h-12 text-text-muted mx-auto mb-4" strokeWidth={1} />
                                        <h2 className="text-xl font-display font-bold mb-2">Curso no encontrado</h2>
                                        <Link href="/courses" className="text-nebula-400 text-sm hover:underline">Volver al catálogo</Link>
                              </div>
                    </div>
          );

          return (
                    <div className="min-h-screen starfield">
                              {/* ── Hero ── */}
                              <div className="relative overflow-hidden">
                                        <div className="absolute inset-0 hero-gradient" />
                                        {course.thumbnail && (
                                                  <div className="absolute inset-0 opacity-10">
                                                            <img src={course.thumbnail} alt="" className="w-full h-full object-cover" />
                                                  </div>
                                        )}
                                        <div className="relative max-w-4xl mx-auto px-6 py-16 md:py-24">
                                                  <Link href="/courses" className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-text-primary mb-6 transition-colors">
                                                            <ArrowLeft className="w-4 h-4" /> Volver al catálogo
                                                  </Link>

                                                  <div className="flex flex-wrap gap-2 mb-4">
                                                            <span className="badge badge-purple">{levelLabels[course.level] || course.level}</span>
                                                            <span className="badge badge-slate">{course.category}</span>
                                                  </div>

                                                  <h1 className="text-3xl md:text-4xl font-display font-bold mb-4 text-text-primary">
                                                            {course.title}
                                                  </h1>
                                                  <p className="text-text-secondary max-w-2xl mb-6 leading-relaxed">
                                                            {course.description}
                                                  </p>

                                                  {/* Meta row */}
                                                  <div className="flex flex-wrap items-center gap-6 text-sm text-text-muted mb-8">
                                                            <span className="flex items-center gap-1.5"><GraduationCap className="w-4 h-4 text-nebula-400" /> {course.teacherName}</span>
                                                            <span className="flex items-center gap-1.5"><Users className="w-4 h-4 text-astral-400" /> {course.enrolled}/{course.capacity} inscritos</span>
                                                            {course.rating && <span className="flex items-center gap-1.5"><Star className="w-4 h-4 text-amber-400" /> {course.rating}</span>}
                                                            <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> {new Date(course.startDate).toLocaleDateString('es', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                                                  </div>

                                                  <div className="flex flex-col sm:flex-row gap-3">
                                                            <Link href="/auth/register" className="btn-primary flex items-center justify-center gap-2">
                                                                      <GraduationCap className="w-4 h-4" /> Inscribirme ahora
                                                            </Link>
                                                            <Link href="/auth/login" className="btn-secondary flex items-center justify-center gap-2">
                                                                      Ya tengo cuenta <ArrowRight className="w-4 h-4" />
                                                            </Link>
                                                  </div>
                                        </div>
                              </div>

                              {/* ── Content ── */}
                              <div className="max-w-4xl mx-auto px-6 py-12">
                                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                                  {/* Main Content */}
                                                  <div className="lg:col-span-2 space-y-8">
                                                            {/* What you'll learn */}
                                                            <div className="orionix-card p-6" style={{ transform: 'none' }}>
                                                                      <h2 className="text-lg font-display font-semibold mb-4 flex items-center gap-2">
                                                                                <CheckCircle className="w-5 h-5 text-emerald-400" /> Lo que aprenderás
                                                                      </h2>
                                                                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                                                {(course.learningOutcomes || [
                                                                                          'Dominar los conceptos fundamentales del tema',
                                                                                          'Aplicar conocimientos en proyectos reales',
                                                                                          'Resolver problemas de manera efectiva',
                                                                                          'Prepararte para roles profesionales',
                                                                                ]).map((item, i) => (
                                                                                          <div key={i} className="flex items-start gap-2.5">
                                                                                                    <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                                                                                                    <span className="text-sm text-text-secondary">{item}</span>
                                                                                          </div>
                                                                                ))}
                                                                      </div>
                                                            </div>

                                                            {/* Syllabus */}
                                                            <div>
                                                                      <h2 className="text-lg font-display font-semibold mb-4 flex items-center gap-2">
                                                                                <BookOpen className="w-5 h-5 text-nebula-400" /> Contenido del curso
                                                                      </h2>
                                                                      {modules.length === 0 ? (
                                                                                <div className="orionix-card p-6 text-center text-text-muted text-sm" style={{ transform: 'none' }}>
                                                                                          El contenido del curso será publicado próximamente.
                                                                                </div>
                                                                      ) : (
                                                                                <div className="space-y-2">
                                                                                          {modules.map((m, idx) => (
                                                                                                    <div key={m.id} className="orionix-card overflow-hidden" style={{ transform: 'none' }}>
                                                                                                              <button
                                                                                                                        onClick={() => setExpandedModule(expandedModule === m.id ? null : m.id)}
                                                                                                                        className="w-full flex items-center gap-4 p-4 text-left hover:bg-surface-glass transition-colors"
                                                                                                              >
                                                                                                                        <div className="w-8 h-8 rounded-lg bg-nebula-500/10 border border-nebula-500/20 flex items-center justify-center shrink-0">
                                                                                                                                  <span className="text-xs font-bold text-nebula-400">{idx + 1}</span>
                                                                                                                        </div>
                                                                                                                        <div className="flex-1 min-w-0">
                                                                                                                                  <p className="font-semibold text-sm text-text-primary">{m.title}</p>
                                                                                                                        </div>
                                                                                                                        <ChevronDown className={`w-4 h-4 text-text-muted transition-transform ${expandedModule === m.id ? 'rotate-180' : ''}`} />
                                                                                                              </button>
                                                                                                              {expandedModule === m.id && (
                                                                                                                        <div className="px-4 pb-4 pt-0 border-t border-border-subtle">
                                                                                                                                  <p className="text-sm text-text-secondary py-3">{m.description || 'Contenido del módulo disponible tras la inscripción.'}</p>
                                                                                                                                  {m.lessons && m.lessons.map((l, li) => (
                                                                                                                                            <div key={li} className="flex items-center gap-3 py-2 text-sm text-text-muted">
                                                                                                                                                      <Play className="w-3.5 h-3.5 text-nebula-400" />
                                                                                                                                                      <span>{l.title}</span>
                                                                                                                                                      {l.duration && <span className="ml-auto text-xs flex items-center gap-1"><Clock className="w-3 h-3" /> {l.duration}</span>}
                                                                                                                                            </div>
                                                                                                                                  ))}
                                                                                                                        </div>
                                                                                                              )}
                                                                                                    </div>
                                                                                          ))}
                                                                                </div>
                                                                      )}
                                                            </div>
                                                  </div>

                                                  {/* Sidebar */}
                                                  <div className="space-y-6">
                                                            {/* Course Card */}
                                                            <div className="orionix-card p-6 sticky top-24" style={{ transform: 'none' }}>
                                                                      {course.thumbnail && (
                                                                                <div className="h-40 rounded-xl overflow-hidden border border-border-subtle mb-5">
                                                                                          <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                                                                                </div>
                                                                      )}

                                                                      <div className="space-y-4">
                                                                                <div className="flex items-center gap-3 text-sm">
                                                                                          <BarChart3 className="w-4 h-4 text-nebula-400" />
                                                                                          <span className="text-text-secondary">Nivel: <span className="font-semibold text-text-primary">{levelLabels[course.level]}</span></span>
                                                                                </div>
                                                                                <div className="flex items-center gap-3 text-sm">
                                                                                          <BookOpen className="w-4 h-4 text-nebula-400" />
                                                                                          <span className="text-text-secondary">Módulos: <span className="font-semibold text-text-primary">{modules.length}</span></span>
                                                                                </div>
                                                                                <div className="flex items-center gap-3 text-sm">
                                                                                          <Users className="w-4 h-4 text-astral-400" />
                                                                                          <span className="text-text-secondary">Inscritos: <span className="font-semibold text-text-primary">{course.enrolled}/{course.capacity}</span></span>
                                                                                </div>
                                                                                <div className="flex items-center gap-3 text-sm">
                                                                                          <Calendar className="w-4 h-4 text-text-muted" />
                                                                                          <span className="text-text-secondary">Inicio: <span className="font-semibold text-text-primary">{new Date(course.startDate).toLocaleDateString('es', { day: 'numeric', month: 'long' })}</span></span>
                                                                                </div>
                                                                      </div>

                                                                      <Link href="/auth/register" className="btn-primary w-full flex items-center justify-center gap-2 mt-6">
                                                                                <GraduationCap className="w-4 h-4" /> Inscribirme
                                                                      </Link>
                                                                      <p className="text-[10px] text-text-muted text-center mt-3">Regístrate gratis para acceder al contenido completo</p>
                                                            </div>

                                                            {/* Teacher Info */}
                                                            <div className="orionix-card p-5" style={{ transform: 'none' }}>
                                                                      <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                                                                                <Award className="w-4 h-4 text-astral-400" /> Sobre el instructor
                                                                      </h3>
                                                                      <div className="flex items-center gap-3">
                                                                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-nebula-500/30 to-astral-500/20 border border-border-default flex items-center justify-center text-lg font-display font-bold text-nebula-300">
                                                                                          {course.teacherName.charAt(0)}
                                                                                </div>
                                                                                <div>
                                                                                          <p className="font-semibold text-sm text-text-primary">{course.teacherName}</p>
                                                                                          <p className="text-xs text-text-muted">Instructor verificado</p>
                                                                                </div>
                                                                      </div>
                                                            </div>
                                                  </div>
                                        </div>
                              </div>
                    </div>
          );
}
