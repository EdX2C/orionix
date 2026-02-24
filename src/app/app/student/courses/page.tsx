'use client';
// ===== Student: Course Catalog =====
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { courseService } from '@/services';
import { useToast } from '@/context/ToastContext';
import { useAuth } from '@/context/AuthContext';
import { Course } from '@/types';
import { CardSkeleton } from '@/components/ui/Skeleton';
import EmptyState from '@/components/ui/EmptyState';
import { BookOpen, Search, Filter, Star, Users, ArrowRight } from 'lucide-react';

const categories = ['Todos', 'Programación', 'Inteligencia Artificial', 'Diseño', 'Desarrollo Web', 'Ciencia de Datos', 'Ciberseguridad', 'Bases de Datos'];
const levels = ['Todos', 'beginner', 'intermediate', 'advanced'];
const levelLabels: Record<string, string> = { beginner: 'Principiante', intermediate: 'Intermedio', advanced: 'Avanzado' };

export default function StudentCoursesPage() {
          const { user } = useAuth();
          const [courses, setCourses] = useState<Course[]>([]);
          const [loading, setLoading] = useState(true);
          const [search, setSearch] = useState('');
          const [category, setCategory] = useState('Todos');
          const [level, setLevel] = useState('Todos');
          const { addToast } = useToast();

          useEffect(() => {
                    courseService.list().then(c => { setCourses(c.filter(x => x.status === 'published')); setLoading(false); });
          }, []);

          const filtered = courses.filter(c => {
                    if (category !== 'Todos' && c.category !== category) return false;
                    if (level !== 'Todos' && c.level !== level) return false;
                    if (search && !c.title.toLowerCase().includes(search.toLowerCase()) && !c.tags.some(t => t.toLowerCase().includes(search.toLowerCase()))) return false;
                    return true;
          });

          const handleEnroll = async (courseId: string, title: string) => {
                    if (!user) return;
                    const res = await courseService.enroll(courseId, user.id, user.name);
                    if (res.success) addToast(`¡Inscrito exitosamente en "${title}"!`, 'success');
                    else addToast(res.error || 'Error al inscribir', 'error');
          };

          return (
                    <div className="space-y-6 animate-fade-in">
                              <div>
                                        <h1 className="text-2xl font-display font-bold">Explorar Cursos</h1>
                                        <p className="text-sm text-text-muted mt-1">Descubre y inscríbete en los cursos disponibles</p>
                              </div>

                              {/* Search & Filters */}
                              <div className="flex flex-col sm:flex-row gap-3">
                                        <div className="relative flex-1">
                                                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                                                  <input type="text" value={search} onChange={e => setSearch(e.target.value)} className="orionix-input pl-10" placeholder="Buscar cursos o tecnologías..." />
                                        </div>
                                        <div className="flex gap-3">
                                                  <select value={category} onChange={e => setCategory(e.target.value)} className="orionix-input w-auto min-w-[140px] cursor-pointer">
                                                            {categories.map(c => <option key={c} value={c}>{c}</option>)}
                                                  </select>
                                                  <select value={level} onChange={e => setLevel(e.target.value)} className="orionix-input w-auto min-w-[130px] cursor-pointer">
                                                            {levels.map(l => <option key={l} value={l}>{l === 'Todos' ? 'Nivel' : levelLabels[l]}</option>)}
                                                  </select>
                                        </div>
                              </div>

                              <p className="text-xs text-text-muted"><Filter className="w-3 h-3 inline mr-1" />{filtered.length} curso{filtered.length !== 1 ? 's' : ''} encontrado{filtered.length !== 1 ? 's' : ''}</p>

                              {/* Course Grid */}
                              {loading ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">{Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}</div>
                              ) : filtered.length === 0 ? (
                                        <EmptyState icon="search" title="Sin resultados" description="No se encontraron cursos con los filtros seleccionados." action={{ label: 'Limpiar filtros', onClick: () => { setSearch(''); setCategory('Todos'); setLevel('Todos'); } }} />
                              ) : (
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                                                  {filtered.map(c => (
                                                            <div key={c.id} className="orionix-card overflow-hidden flex flex-col">
                                                                      <div className="h-40 relative overflow-hidden">
                                                                                {c.thumbnail ? (
                                                                                          <img src={c.thumbnail} alt={c.title} className="w-full h-full object-cover" />
                                                                                ) : (
                                                                                          <div className="w-full h-full bg-gradient-to-br from-nebula-500/20 via-orion-700 to-astral-500/10 flex items-center justify-center">
                                                                                                    <BookOpen className="w-12 h-12 text-nebula-400/40" strokeWidth={1} />
                                                                                          </div>
                                                                                )}
                                                                                <div className="absolute inset-0 bg-gradient-to-t from-orion-950/60 to-transparent" />
                                                                                {c.rating && (
                                                                                          <div className="absolute top-3 right-3 flex items-center gap-1 bg-orion-950/60 backdrop-blur px-2 py-1 rounded-lg">
                                                                                                    <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                                                                                                    <span className="text-xs font-semibold text-amber-300">{c.rating}</span>
                                                                                          </div>
                                                                                )}
                                                                      </div>
                                                                      <div className="p-5 flex-1 flex flex-col">
                                                                                <div className="flex gap-2 mb-2 flex-wrap">
                                                                                          <span className="badge badge-purple">{levelLabels[c.level] || c.level}</span>
                                                                                          {c.tags.slice(0, 2).map(t => <span key={t} className="badge badge-slate">{t}</span>)}
                                                                                </div>
                                                                                <h3 className="font-display font-semibold text-text-primary mb-1 line-clamp-2">{c.title}</h3>
                                                                                <p className="text-xs text-text-muted mb-4 line-clamp-2 flex-1">{c.shortDescription}</p>
                                                                                <div className="flex items-center justify-between text-xs text-text-muted mb-4">
                                                                                          <span>{c.teacherName}</span>
                                                                                          <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {c.enrolled}/{c.capacity}</span>
                                                                                </div>
                                                                                <div className="flex gap-2">
                                                                                          <Link href={`/app/student/courses/${c.id}`} className="btn-secondary flex-1 text-center text-xs py-2">Ver detalle</Link>
                                                                                          <button onClick={() => handleEnroll(c.id, c.title)} className="btn-primary flex-1 text-xs py-2 flex items-center justify-center gap-1">
                                                                                                    Inscribirme <ArrowRight className="w-3 h-3" />
                                                                                          </button>
                                                                                </div>
                                                                      </div>
                                                            </div>
                                                  ))}
                                        </div>
                              )}
                    </div>
          );
}
