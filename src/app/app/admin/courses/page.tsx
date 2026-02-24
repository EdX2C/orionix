'use client';
// ===== Admin: Course Management =====
import React, { useEffect, useState } from 'react';
import { courseService } from '@/services';
import { useToast } from '@/context/ToastContext';
import { Course } from '@/types';
import { DashboardSkeleton } from '@/components/ui/Skeleton';
import { BookOpen, Search, Globe, Archive, Users, Star, Loader2, Eye } from 'lucide-react';

export default function AdminCoursesPage() {
          const [courses, setCourses] = useState<Course[]>([]);
          const [loading, setLoading] = useState(true);
          const [search, setSearch] = useState('');
          const [statusFilter, setStatusFilter] = useState('all');
          const [publishing, setPublishing] = useState<string | null>(null);
          const { addToast } = useToast();

          useEffect(() => { courseService.list().then(c => { setCourses(c); setLoading(false); }); }, []);

          const filtered = courses.filter(c => {
                    if (statusFilter !== 'all' && c.status !== statusFilter) return false;
                    if (search && !c.title.toLowerCase().includes(search.toLowerCase())) return false;
                    return true;
          });

          const statusLabels: Record<string, string> = { draft: 'Borrador', pending: 'Pendiente', published: 'Publicado', archived: 'Archivado' };
          const statusColors: Record<string, string> = { draft: 'badge-slate', pending: 'badge-amber', published: 'badge-green', archived: 'badge-red' };

          const handlePublish = async (id: string, title: string) => {
                    setPublishing(id);
                    await courseService.publish(id);
                    setCourses(prev => prev.map(c => c.id === id ? { ...c, status: 'published' } : c));
                    addToast(`"${title}" publicado`, 'success');
                    setPublishing(null);
          };

          if (loading) return <DashboardSkeleton />;

          return (
                    <div className="space-y-6 animate-fade-in">
                              <div>
                                        <h1 className="text-2xl font-display font-bold">Gestión de Cursos</h1>
                                        <p className="text-sm text-text-muted mt-1">Aprueba, publica y administra todos los cursos</p>
                              </div>

                              {/* Status summary */}
                              <div className="flex flex-wrap gap-3">
                                        {['all', 'draft', 'pending', 'published', 'archived'].map(s => {
                                                  const count = s === 'all' ? courses.length : courses.filter(c => c.status === s).length;
                                                  return (
                                                            <button key={s} onClick={() => setStatusFilter(s)}
                                                                      className={`px-4 py-2 rounded-xl text-xs font-medium border transition-all ${statusFilter === s ? 'bg-nebula-500/15 border-nebula-500/30 text-nebula-300' : 'bg-surface-glass border-border-subtle text-text-muted hover:text-text-secondary'}`}>
                                                                      {s === 'all' ? 'Todos' : statusLabels[s]} ({count})
                                                            </button>
                                                  );
                                        })}
                              </div>

                              {/* Search */}
                              <div className="relative">
                                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                                        <input type="text" value={search} onChange={e => setSearch(e.target.value)} className="orionix-input pl-10" placeholder="Buscar curso..." />
                              </div>

                              {/* Table */}
                              <div className="orionix-card overflow-hidden" style={{ transform: 'none' }}>
                                        <table className="orionix-table">
                                                  <thead>
                                                            <tr>
                                                                      <th>Curso</th>
                                                                      <th>Docente</th>
                                                                      <th>Categoría</th>
                                                                      <th>Inscritos</th>
                                                                      <th>Estado</th>
                                                                      <th>Acciones</th>
                                                            </tr>
                                                  </thead>
                                                  <tbody>
                                                            {filtered.map(c => (
                                                                      <tr key={c.id}>
                                                                                <td>
                                                                                          <div>
                                                                                                    <p className="font-medium text-text-primary text-sm">{c.title}</p>
                                                                                                    <p className="text-xs text-text-muted">{c.shortDescription}</p>
                                                                                          </div>
                                                                                </td>
                                                                                <td className="text-sm">{c.teacherName}</td>
                                                                                <td><span className="badge badge-slate">{c.category}</span></td>
                                                                                <td className="text-sm"><span className="flex items-center gap-1"><Users className="w-3 h-3" /> {c.enrolled}/{c.capacity}</span></td>
                                                                                <td><span className={`badge ${statusColors[c.status]}`}>{statusLabels[c.status]}</span></td>
                                                                                <td>
                                                                                          <div className="flex gap-2">
                                                                                                    {c.status !== 'published' && (
                                                                                                              <button onClick={() => handlePublish(c.id, c.title)} disabled={publishing === c.id}
                                                                                                                        className="text-xs px-3 py-1.5 rounded-lg border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/10 transition-all flex items-center gap-1">
                                                                                                                        {publishing === c.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Globe className="w-3 h-3" />} Publicar
                                                                                                              </button>
                                                                                                    )}
                                                                                                    {c.status === 'published' && (
                                                                                                              <button onClick={() => { setCourses(prev => prev.map(x => x.id === c.id ? { ...x, status: 'archived' } : x)); addToast('Curso archivado', 'warning'); }}
                                                                                                                        className="text-xs px-3 py-1.5 rounded-lg border border-amber-500/20 text-amber-400 hover:bg-amber-500/10 transition-all flex items-center gap-1">
                                                                                                                        <Archive className="w-3 h-3" /> Archivar
                                                                                                              </button>
                                                                                                    )}
                                                                                          </div>
                                                                                </td>
                                                                      </tr>
                                                            ))}
                                                  </tbody>
                                        </table>
                              </div>
                    </div>
          );
}
