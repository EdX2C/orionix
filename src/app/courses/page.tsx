'use client';
// ===== Public Course Catalog =====
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { courseService } from '@/services';
import { Course } from '@/types';
import { DashboardSkeleton } from '@/components/ui/Skeleton';
import EmptyState from '@/components/ui/EmptyState';
import {
          BookOpen, Search, Users, Star, Filter, GraduationCap,
          Sparkles, BarChart3, Clock, ArrowRight
} from 'lucide-react';

const categories = ['Todos', 'Programación', 'Inteligencia Artificial', 'Diseño', 'Desarrollo Web', 'Ciencia de Datos', 'Ciberseguridad', 'Bases de Datos'];
const levels = ['Todos', 'beginner', 'intermediate', 'advanced'];
const levelLabels: Record<string, string> = { beginner: 'Principiante', intermediate: 'Intermedio', advanced: 'Avanzado' };

export default function PublicCourseCatalog() {
          const [courses, setCourses] = useState<Course[]>([]);
          const [loading, setLoading] = useState(true);
          const [search, setSearch] = useState('');
          const [category, setCategory] = useState('Todos');
          const [level, setLevel] = useState('Todos');

          useEffect(() => {
                    courseService.list().then(c => {
                              setCourses(c.filter(x => x.status === 'published'));
                              setLoading(false);
                    });
          }, []);

          const filtered = courses.filter(c => {
                    const matchSearch = !search || c.title.toLowerCase().includes(search.toLowerCase()) || c.shortDescription.toLowerCase().includes(search.toLowerCase());
                    const matchCat = category === 'Todos' || c.category === category;
                    const matchLvl = level === 'Todos' || c.level === level;
                    return matchSearch && matchCat && matchLvl;
          });

          if (loading) return (
                    <div className="min-h-screen starfield">
                              <div className="max-w-6xl mx-auto px-6 py-12"><DashboardSkeleton /></div>
                    </div>
          );

          return (
                    <div className="min-h-screen starfield">
                              {/* ── Hero ── */}
                              <div className="relative overflow-hidden">
                                        <div className="absolute inset-0 hero-gradient" />
                                        <div className="relative max-w-6xl mx-auto px-6 py-16 md:py-24 text-center">
                                                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-nebula-500/10 border border-nebula-500/20 mb-6">
                                                            <Sparkles className="w-4 h-4 text-nebula-400" />
                                                            <span className="text-xs font-semibold text-nebula-400">{courses.length} cursos disponibles</span>
                                                  </div>
                                                  <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
                                                            Explora nuestro <span className="text-gradient">catálogo</span>
                                                  </h1>
                                                  <p className="text-text-secondary max-w-xl mx-auto mb-8">
                                                            Descubre cursos diseñados por expertos para impulsar tu carrera. Desde fundamentos hasta temas avanzados.
                                                  </p>

                                                  {/* Search Bar */}
                                                  <div className="max-w-xl mx-auto relative">
                                                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                                                            <input
                                                                      type="text"
                                                                      value={search}
                                                                      onChange={e => setSearch(e.target.value)}
                                                                      placeholder="Buscar cursos por título o tema..."
                                                                      className="orionix-input pl-12 w-full text-base py-3.5"
                                                            />
                                                  </div>
                                        </div>
                              </div>

                              {/* ── Filters + Content ── */}
                              <div className="max-w-6xl mx-auto px-6 pb-16">
                                        {/* Category Chips */}
                                        <div className="flex flex-wrap gap-2 mb-6">
                                                  {categories.map(cat => (
                                                            <button
                                                                      key={cat}
                                                                      onClick={() => setCategory(cat)}
                                                                      className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${category === cat
                                                                                ? 'bg-nebula-500 text-white shadow-lg shadow-nebula-500/25'
                                                                                : 'bg-surface-glass border border-border-subtle text-text-secondary hover:bg-surface-card'
                                                                                }`}
                                                            >
                                                                      {cat}
                                                            </button>
                                                  ))}
                                        </div>

                                        {/* Level Chips */}
                                        <div className="flex flex-wrap items-center gap-2 mb-8">
                                                  <Filter className="w-4 h-4 text-text-muted" />
                                                  <span className="text-xs text-text-muted mr-1">Nivel:</span>
                                                  {levels.map(lvl => (
                                                            <button
                                                                      key={lvl}
                                                                      onClick={() => setLevel(lvl)}
                                                                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${level === lvl
                                                                                ? 'bg-astral-500/20 border border-astral-500/30 text-astral-400'
                                                                                : 'bg-surface-glass border border-border-subtle text-text-secondary hover:bg-surface-card'
                                                                                }`}
                                                            >
                                                                      {lvl === 'Todos' ? 'Todos' : levelLabels[lvl]}
                                                            </button>
                                                  ))}
                                                  <span className="text-xs text-text-muted ml-auto">{filtered.length} resultado{filtered.length !== 1 ? 's' : ''}</span>
                                        </div>

                                        {/* Course Grid */}
                                        {filtered.length === 0 ? (
                                                  <EmptyState icon="search" title="Sin resultados" description="No encontramos cursos con esos filtros. Intenta con otros criterios." />
                                        ) : (
                                                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                                            {filtered.map(c => (
                                                                      <Link key={c.id} href={`/courses/${c.id}`} className="orionix-card overflow-hidden group">
                                                                                {/* Thumbnail */}
                                                                                <div className="h-44 relative overflow-hidden">
                                                                                          {c.thumbnail ? (
                                                                                                    <img src={c.thumbnail} alt={c.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                                                                          ) : (
                                                                                                    <div className="w-full h-full bg-gradient-to-br from-nebula-500/20 to-astral-500/10 flex items-center justify-center">
                                                                                                              <BookOpen className="w-12 h-12 text-nebula-400/40" strokeWidth={1} />
                                                                                                    </div>
                                                                                          )}
                                                                                          <div className="absolute inset-0 bg-gradient-to-t from-orion-950/70 via-transparent to-transparent" />
                                                                                          <div className="absolute bottom-3 left-3 flex gap-2">
                                                                                                    <span className="badge badge-purple text-[10px]">{levelLabels[c.level] || c.level}</span>
                                                                                                    <span className="badge badge-slate text-[10px]">{c.category}</span>
                                                                                          </div>
                                                                                </div>

                                                                                {/* Content */}
                                                                                <div className="p-5">
                                                                                          <h3 className="font-display font-semibold text-text-primary mb-1 line-clamp-2 group-hover:text-nebula-400 transition-colors">{c.title}</h3>
                                                                                          <p className="text-xs text-text-muted mb-4 line-clamp-2">{c.shortDescription}</p>

                                                                                          <div className="flex items-center justify-between text-xs text-text-muted">
                                                                                                    <span className="flex items-center gap-1">
                                                                                                              <GraduationCap className="w-3.5 h-3.5" /> {c.teacherName}
                                                                                                    </span>
                                                                                                    <div className="flex items-center gap-3">
                                                                                                              <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {c.enrolled}</span>
                                                                                                              {c.rating && <span className="flex items-center gap-1"><Star className="w-3 h-3 text-amber-400" /> {c.rating}</span>}
                                                                                                    </div>
                                                                                          </div>
                                                                                </div>
                                                                      </Link>
                                                            ))}
                                                  </div>
                                        )}

                                        {/* CTA */}
                                        <div className="text-center mt-16">
                                                  <p className="text-text-muted mb-4">¿Quieres acceso completo a todos los cursos?</p>
                                                  <Link href="/auth/register" className="btn-primary inline-flex items-center gap-2">
                                                            <GraduationCap className="w-4 h-4" /> Crear cuenta gratis <ArrowRight className="w-4 h-4" />
                                                  </Link>
                                        </div>
                              </div>
                    </div>
          );
}
