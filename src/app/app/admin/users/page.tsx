'use client';
// ===== Admin: User Management (Enhanced) =====
import React, { useEffect, useState } from 'react';
import { useToast } from '@/context/ToastContext';
import { User } from '@/types';
import { mockUsers } from '@/data/users';
import { DashboardSkeleton } from '@/components/ui/Skeleton';
import EmptyState from '@/components/ui/EmptyState';
import {
          Users, Search, Shield, BookOpen, GraduationCap, UserCheck, UserX,
          Mail, Calendar, Activity, Filter
} from 'lucide-react';

const roleLabels: Record<string, string> = { student: 'Estudiante', teacher: 'Docente', admin: 'Administrador' };
const roleIcons: Record<string, React.ElementType> = { student: GraduationCap, teacher: BookOpen, admin: Shield };
const roleBadges: Record<string, string> = { student: 'badge-cyan', teacher: 'badge-purple', admin: 'badge-amber' };
const avatarGradients: Record<string, string> = {
          student: 'from-astral-500 to-astral-400',
          teacher: 'from-nebula-500 to-nebula-400',
          admin: 'from-amber-500 to-amber-400',
};

export default function AdminUsersPage() {
          const [users, setUsersState] = useState<User[]>([]);
          const [loading, setLoading] = useState(true);
          const [search, setSearch] = useState('');
          const [roleFilter, setRoleFilter] = useState('all');
          const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
          const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
          const { addToast } = useToast();

          useEffect(() => {
                    setTimeout(() => { setUsersState(mockUsers); setLoading(false); }, 300);
          }, []);

          const filtered = users.filter(u => {
                    if (roleFilter !== 'all' && u.role !== roleFilter) return false;
                    if (statusFilter === 'active' && !u.isActive) return false;
                    if (statusFilter === 'inactive' && u.isActive) return false;
                    if (search && !u.name.toLowerCase().includes(search.toLowerCase()) && !u.email.toLowerCase().includes(search.toLowerCase())) return false;
                    return true;
          });

          const toggleStatus = (id: string) => {
                    setUsersState(prev => prev.map(u => u.id === id ? { ...u, isActive: !u.isActive } : u));
                    addToast('Estado de usuario actualizado', 'success');
          };

          const toggleSelect = (id: string) => {
                    setSelectedIds(prev => {
                              const next = new Set(prev);
                              next.has(id) ? next.delete(id) : next.add(id);
                              return next;
                    });
          };

          const toggleSelectAll = () => {
                    if (selectedIds.size === filtered.length) {
                              setSelectedIds(new Set());
                    } else {
                              setSelectedIds(new Set(filtered.map(u => u.id)));
                    }
          };

          const bulkToggle = (activate: boolean) => {
                    setUsersState(prev => prev.map(u => selectedIds.has(u.id) ? { ...u, isActive: activate } : u));
                    addToast(`${selectedIds.size} usuario(s) ${activate ? 'activados' : 'desactivados'}`, 'success');
                    setSelectedIds(new Set());
          };

          if (loading) return <DashboardSkeleton />;

          const roleCounts = {
                    all: users.length,
                    student: users.filter(u => u.role === 'student').length,
                    teacher: users.filter(u => u.role === 'teacher').length,
                    admin: users.filter(u => u.role === 'admin').length,
          };

          return (
                    <div className="space-y-6 animate-fade-in">
                              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                        <div>
                                                  <h1 className="text-2xl font-display font-bold">Gestión de Usuarios</h1>
                                                  <p className="text-sm text-text-muted mt-1">{users.length} usuarios · {users.filter(u => u.isActive).length} activos</p>
                                        </div>
                                        {selectedIds.size > 0 && (
                                                  <div className="flex items-center gap-2 glass rounded-xl px-4 py-2">
                                                            <span className="text-xs text-text-secondary">{selectedIds.size} seleccionado{selectedIds.size > 1 ? 's' : ''}</span>
                                                            <button onClick={() => bulkToggle(true)} className="text-xs px-2.5 py-1 rounded-lg border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/10 transition-colors">
                                                                      <UserCheck className="w-3 h-3 inline mr-1" />Activar
                                                            </button>
                                                            <button onClick={() => bulkToggle(false)} className="text-xs px-2.5 py-1 rounded-lg border border-red-500/20 text-red-400 hover:bg-red-500/10 transition-colors">
                                                                      <UserX className="w-3 h-3 inline mr-1" />Desactivar
                                                            </button>
                                                  </div>
                                        )}
                              </div>

                              {/* Stats + Role Filter Chips */}
                              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                        {([
                                                  { key: 'all', label: 'Todos', count: roleCounts.all, icon: Users, color: 'text-text-secondary', bg: 'bg-surface-glass border-border-subtle' },
                                                  { key: 'student', label: 'Estudiantes', count: roleCounts.student, icon: GraduationCap, color: 'text-astral-400', bg: 'bg-astral-500/10 border-astral-500/20' },
                                                  { key: 'teacher', label: 'Docentes', count: roleCounts.teacher, icon: BookOpen, color: 'text-nebula-400', bg: 'bg-nebula-500/10 border-nebula-500/20' },
                                                  { key: 'admin', label: 'Admins', count: roleCounts.admin, icon: Shield, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
                                        ] as const).map(s => (
                                                  <button key={s.key} onClick={() => setRoleFilter(s.key)}
                                                            className={`p-3 rounded-xl border text-left transition-all ${roleFilter === s.key
                                                                      ? `${s.bg} ring-1 ring-nebula-500/30`
                                                                      : 'bg-surface-glass border-border-subtle hover:bg-surface-card'
                                                                      }`}>
                                                            <div className="flex items-center gap-2 mb-1">
                                                                      <s.icon className={`w-4 h-4 ${roleFilter === s.key ? s.color : 'text-text-muted'}`} />
                                                                      <span className={`text-xs font-medium ${roleFilter === s.key ? 'text-text-primary' : 'text-text-muted'}`}>{s.label}</span>
                                                            </div>
                                                            <p className={`text-lg font-display font-bold ${roleFilter === s.key ? 'text-text-primary' : 'text-text-secondary'}`}>{s.count}</p>
                                                  </button>
                                        ))}
                              </div>

                              {/* Search + Status Filter */}
                              <div className="flex flex-col sm:flex-row gap-3">
                                        <div className="relative flex-1">
                                                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                                                  <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                                                            className="orionix-input pl-10" placeholder="Buscar por nombre o correo..." />
                                        </div>
                                        <div className="flex items-center bg-surface-glass border border-border-subtle rounded-xl overflow-hidden">
                                                  {(['all', 'active', 'inactive'] as const).map(s => (
                                                            <button key={s} onClick={() => setStatusFilter(s)}
                                                                      className={`px-3 py-2.5 text-xs font-medium transition-all ${statusFilter === s ? 'bg-nebula-500/15 text-nebula-400' : 'text-text-muted hover:text-text-secondary'}`}>
                                                                      {s === 'all' ? 'Todos' : s === 'active' ? 'Activos' : 'Inactivos'}
                                                            </button>
                                                  ))}
                                        </div>
                              </div>

                              {/* Results count */}
                              <p className="text-xs text-text-muted">{filtered.length} resultado{filtered.length !== 1 ? 's' : ''}</p>

                              {/* Table */}
                              {filtered.length === 0 ? (
                                        <EmptyState icon="search" title="Sin resultados" description="No se encontraron usuarios que coincidan con los filtros." />
                              ) : (
                                        <div className="orionix-card overflow-hidden" style={{ transform: 'none' }}>
                                                  <table className="orionix-table">
                                                            <thead>
                                                                      <tr>
                                                                                <th className="w-10">
                                                                                          <input type="checkbox" checked={selectedIds.size === filtered.length && filtered.length > 0}
                                                                                                    onChange={toggleSelectAll}
                                                                                                    className="w-4 h-4 rounded border-border-subtle bg-surface-glass cursor-pointer accent-nebula-500" />
                                                                                </th>
                                                                                <th>Usuario</th>
                                                                                <th>Rol</th>
                                                                                <th>Estado</th>
                                                                                <th>Registrado</th>
                                                                                <th>Acciones</th>
                                                                      </tr>
                                                            </thead>
                                                            <tbody>
                                                                      {filtered.map(u => {
                                                                                const Icon = roleIcons[u.role];
                                                                                return (
                                                                                          <tr key={u.id} className={selectedIds.has(u.id) ? 'bg-nebula-500/5' : ''}>
                                                                                                    <td>
                                                                                                              <input type="checkbox" checked={selectedIds.has(u.id)}
                                                                                                                        onChange={() => toggleSelect(u.id)}
                                                                                                                        className="w-4 h-4 rounded border-border-subtle bg-surface-glass cursor-pointer accent-nebula-500" />
                                                                                                    </td>
                                                                                                    <td>
                                                                                                              <div className="flex items-center gap-3">
                                                                                                                        <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${avatarGradients[u.role]} flex items-center justify-center text-xs font-bold text-white shadow-sm`}>
                                                                                                                                  {u.name.charAt(0)}{u.name.split(' ')[1]?.charAt(0) || ''}
                                                                                                                        </div>
                                                                                                                        <div>
                                                                                                                                  <p className="font-medium text-text-primary text-sm">{u.name}</p>
                                                                                                                                  <p className="text-[10px] text-text-muted flex items-center gap-1"><Mail className="w-2.5 h-2.5" />{u.email}</p>
                                                                                                                        </div>
                                                                                                              </div>
                                                                                                    </td>
                                                                                                    <td><span className={`badge ${roleBadges[u.role]} flex items-center gap-1 w-fit`}><Icon className="w-3 h-3" />{roleLabels[u.role]}</span></td>
                                                                                                    <td>
                                                                                                              <div className="flex items-center gap-1.5">
                                                                                                                        <span className={`w-2 h-2 rounded-full ${u.isActive ? 'bg-emerald-400' : 'bg-red-400'}`} />
                                                                                                                        <span className={`text-xs ${u.isActive ? 'text-emerald-400' : 'text-red-400'}`}>{u.isActive ? 'Activo' : 'Inactivo'}</span>
                                                                                                              </div>
                                                                                                    </td>
                                                                                                    <td className="text-text-muted text-xs">{new Date(u.createdAt).toLocaleDateString('es', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                                                                                                    <td>
                                                                                                              <button onClick={() => toggleStatus(u.id)}
                                                                                                                        className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${u.isActive
                                                                                                                                  ? 'border-red-500/20 text-red-400 hover:bg-red-500/10'
                                                                                                                                  : 'border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/10'
                                                                                                                                  }`}>
                                                                                                                        {u.isActive
                                                                                                                                  ? <><UserX className="w-3 h-3 inline mr-1" />Desactivar</>
                                                                                                                                  : <><UserCheck className="w-3 h-3 inline mr-1" />Activar</>}
                                                                                                              </button>
                                                                                                    </td>
                                                                                          </tr>
                                                                                );
                                                                      })}
                                                            </tbody>
                                                  </table>
                                        </div>
                              )}
                    </div>
          );
}
