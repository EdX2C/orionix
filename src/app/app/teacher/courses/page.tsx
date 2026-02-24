'use client';
// ===== Teacher: Courses List =====
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { courseService } from '@/services';
import { Course } from '@/types';
import { DashboardSkeleton } from '@/components/ui/Skeleton';
import EmptyState from '@/components/ui/EmptyState';
import { Plus, BookOpen, Users, Star, Settings, Eye } from 'lucide-react';

export default function TeacherCoursesPage() {
          const [courses, setCourses] = useState<Course[]>([]);
          const [loading, setLoading] = useState(true);
          useEffect(() => { courseService.list().then(c => { setCourses(c); setLoading(false); }); }, []);
          if (loading) return <DashboardSkeleton />;

          const statusLabels: Record<string, string> = { draft: 'Borrador', pending: 'Pendiente', published: 'Publicado', archived: 'Archivado' };
          const statusColors: Record<string, string> = { draft: 'badge-slate', pending: 'badge-amber', published: 'badge-green', archived: 'badge-red' };

          return (
                    <div className="space-y-6 animate-fade-in">
                              <div className="flex items-center justify-between">
                                        <div>
                                                  <h1 className="text-2xl font-display font-bold">Mis Cursos</h1>
                                                  <p className="text-sm text-text-muted mt-1">Gestiona y crea nuevos cursos</p>
                                        </div>
                                        <Link href="/app/teacher/courses/new" className="btn-primary flex items-center gap-2"><Plus className="w-4 h-4" /> Crear curso</Link>
                              </div>
                              {courses.length === 0 ? (
                                        <EmptyState icon="course" title="Sin cursos" description="Aún no has creado ningún curso." action={{ label: 'Crear mi primer curso', onClick: () => { } }} />
                              ) : (
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                                                  {courses.map(c => (
                                                            <div key={c.id} className="orionix-card p-5 flex flex-col">
                                                                      <div className="h-32 rounded-xl overflow-hidden border border-border-subtle mb-4 relative">
                                                                                {c.thumbnail ? (
                                                                                          <img src={c.thumbnail} alt={c.title} className="w-full h-full object-cover" />
                                                                                ) : (
                                                                                          <div className="w-full h-full bg-gradient-to-br from-nebula-500/20 to-astral-500/10 flex items-center justify-center">
                                                                                                    <BookOpen className="w-10 h-10 text-nebula-400/40" strokeWidth={1} />
                                                                                          </div>
                                                                                )}
                                                                                <div className="absolute inset-0 bg-gradient-to-t from-orion-950/50 to-transparent" />
                                                                      </div>
                                                                      <div className="flex items-center gap-2 mb-2">
                                                                                <span className={`badge ${statusColors[c.status]}`}>{statusLabels[c.status]}</span>
                                                                                <span className="badge badge-slate">{c.category}</span>
                                                                      </div>
                                                                      <h3 className="font-semibold text-sm text-text-primary mb-1 line-clamp-2">{c.title}</h3>
                                                                      <p className="text-xs text-text-muted mb-4 flex-1 line-clamp-2">{c.shortDescription}</p>
                                                                      <div className="flex items-center justify-between text-xs text-text-muted mb-4">
                                                                                <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {c.enrolled}/{c.capacity}</span>
                                                                                {c.rating && <span className="flex items-center gap-1"><Star className="w-3 h-3 text-amber-400" /> {c.rating}</span>}
                                                                      </div>
                                                                      <div className="flex gap-2">
                                                                                <Link href={`/app/teacher/courses/${c.id}`} className="btn-secondary flex-1 text-center text-xs py-2 flex items-center justify-center gap-1"><Settings className="w-3 h-3" /> Gestionar</Link>
                                                                                <Link href={`/app/student/courses/${c.id}`} className="btn-ghost flex-1 text-center text-xs py-2 flex items-center justify-center gap-1"><Eye className="w-3 h-3" /> Vista previa</Link>
                                                                      </div>
                                                            </div>
                                                  ))}
                                        </div>
                              )}
                    </div>
          );
}
