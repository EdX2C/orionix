'use client';
// ===== Teacher: Students List =====
import React, { useEffect, useState } from 'react';
import { courseService, reportService } from '@/services';
import { Course, CourseProgress } from '@/types';
import { mockUsers } from '@/data/users';
import { mockProgress } from '@/data/assignments';
import { DashboardSkeleton } from '@/components/ui/Skeleton';
import { Users, BookOpen, TrendingUp, Search } from 'lucide-react';

export default function TeacherStudentsPage() {
          const [courses, setCourses] = useState<Course[]>([]);
          const [loading, setLoading] = useState(true);
          const [selectedCourse, setSelectedCourse] = useState('all');
          const [search, setSearch] = useState('');

          useEffect(() => { courseService.list().then(c => { setCourses(c.filter(x => x.status === 'published')); setLoading(false); }); }, []);

          const students = mockUsers.filter(u => u.role === 'student');
          const filtered = students.filter(s => !search || s.name.toLowerCase().includes(search.toLowerCase()));

          if (loading) return <DashboardSkeleton />;

          return (
                    <div className="space-y-6 animate-fade-in">
                              <div>
                                        <h1 className="text-2xl font-display font-bold">Estudiantes</h1>
                                        <p className="text-sm text-text-muted mt-1">Listado de estudiantes por curso y su progreso</p>
                              </div>

                              <div className="flex flex-col sm:flex-row gap-3">
                                        <div className="relative flex-1">
                                                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                                                  <input type="text" value={search} onChange={e => setSearch(e.target.value)} className="orionix-input pl-10" placeholder="Buscar estudiante..." />
                                        </div>
                                        <select value={selectedCourse} onChange={e => setSelectedCourse(e.target.value)} className="orionix-input w-auto min-w-[200px] cursor-pointer">
                                                  <option value="all">Todos los cursos</option>
                                                  {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                                        </select>
                              </div>

                              <div className="orionix-card overflow-hidden" style={{ transform: 'none' }}>
                                        <table className="orionix-table">
                                                  <thead>
                                                            <tr>
                                                                      <th>Estudiante</th>
                                                                      <th>Correo</th>
                                                                      <th>Cursos inscritos</th>
                                                                      <th>Progreso promedio</th>
                                                                      <th>Registro</th>
                                                            </tr>
                                                  </thead>
                                                  <tbody>
                                                            {filtered.map(s => {
                                                                      const studentProgress = mockProgress.filter(() => true);
                                                                      const avg = studentProgress.length > 0 ? Math.round(studentProgress.reduce((a, p) => a + p.percentage, 0) / studentProgress.length) : 0;
                                                                      return (
                                                                                <tr key={s.id}>
                                                                                          <td>
                                                                                                    <div className="flex items-center gap-3">
                                                                                                              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-nebula-500/20 to-astral-500/10 flex items-center justify-center text-xs font-bold text-nebula-300">
                                                                                                                        {s.name.charAt(0)}
                                                                                                              </div>
                                                                                                              <span className="font-medium text-text-primary">{s.name}</span>
                                                                                                    </div>
                                                                                          </td>
                                                                                          <td>{s.email}</td>
                                                                                          <td><span className="flex items-center gap-1"><BookOpen className="w-3 h-3" /> {studentProgress.length}</span></td>
                                                                                          <td>
                                                                                                    <div className="flex items-center gap-2">
                                                                                                              <div className="progress-track w-20 h-1.5"><div className="progress-fill" style={{ width: `${avg}%` }} /></div>
                                                                                                              <span className="text-xs font-semibold">{avg}%</span>
                                                                                                    </div>
                                                                                          </td>
                                                                                          <td className="text-text-muted">{new Date(s.createdAt).toLocaleDateString('es', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                                                                                </tr>
                                                                      );
                                                            })}
                                                  </tbody>
                                        </table>
                              </div>
                    </div>
          );
}
