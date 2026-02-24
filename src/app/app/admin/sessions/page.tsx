'use client';
// ===== Admin: Session Management =====
// Audit item D: Active Session Administration
import React, { useEffect, useState, useCallback } from 'react';
import { Session } from '@/types';
import { sessionService } from '@/services/sessionService';
import { useToast } from '@/context/ToastContext';
import { DashboardSkeleton } from '@/components/ui/Skeleton';
import EmptyState from '@/components/ui/EmptyState';
import {
          Monitor, Smartphone, Shield, Users, XCircle, Trash2, AlertTriangle,
          RefreshCw, Globe, Clock, Wifi, ChevronDown, ChevronUp
} from 'lucide-react';

const roleLabels: Record<string, string> = { student: 'Estudiante', teacher: 'Docente', admin: 'Admin' };
const roleBadge: Record<string, string> = { student: 'badge-green', teacher: 'badge-purple', admin: 'badge-cyan' };
const statusLabels: Record<string, string> = { active: 'Activa', revoked: 'Revocada', expired: 'Expirada' };
const statusBadge: Record<string, string> = { active: 'badge-green', revoked: 'badge-red', expired: 'badge-amber' };

function getDeviceIcon(device: string) {
          if (device.toLowerCase().includes('iphone') || device.toLowerCase().includes('android')) return Smartphone;
          return Monitor;
}

function timeAgo(iso: string): string {
          const diff = Date.now() - new Date(iso).getTime();
          const mins = Math.floor(diff / 60_000);
          if (mins < 1) return 'justo ahora';
          if (mins < 60) return `hace ${mins}m`;
          const hours = Math.floor(mins / 60);
          if (hours < 24) return `hace ${hours}h`;
          return `hace ${Math.floor(hours / 24)}d`;
}

export default function AdminSessionsPage() {
          const [sessions, setSessions] = useState<Session[]>([]);
          const [loading, setLoading] = useState(true);
          const [filter, setFilter] = useState<'all' | 'active' | 'revoked' | 'expired'>('all');
          const [roleFilter, setRoleFilter] = useState<string>('all');
          const [expandedUser, setExpandedUser] = useState<string | null>(null);
          const [confirmAction, setConfirmAction] = useState<{ type: string; target?: string; label: string } | null>(null);

          useEffect(() => {
                    const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') setConfirmAction(null); };
                    window.addEventListener('keydown', handleEsc);
                    return () => window.removeEventListener('keydown', handleEsc);
          }, []);
          const { addToast } = useToast();

          const loadSessions = useCallback(async () => {
                    const data = await sessionService.listAll();
                    setSessions(data);
                    setLoading(false);
          }, []);

          useEffect(() => { loadSessions(); }, [loadSessions]);

          const stats = sessionService.getStats();

          const filtered = sessions.filter(s => {
                    if (filter !== 'all' && s.status !== filter) return false;
                    if (roleFilter !== 'all' && s.userRole !== roleFilter) return false;
                    return true;
          });

          // Group sessions by user
          const userGroups = filtered.reduce((acc, s) => {
                    if (!acc[s.userId]) acc[s.userId] = { name: s.userName, role: s.userRole, sessions: [] };
                    acc[s.userId].sessions.push(s);
                    return acc;
          }, {} as Record<string, { name: string; role: string; sessions: Session[] }>);

          const handleRevokeSession = async (sessionId: string, userName: string) => {
                    await sessionService.revokeSession(sessionId);
                    addToast(`Sesión de ${userName} revocada.`, 'success');
                    setConfirmAction(null);
                    loadSessions();
          };

          const handleRevokeAllUser = async (userId: string, userName: string) => {
                    const count = await sessionService.revokeAllByUser(userId);
                    addToast(`${count} sesión(es) de ${userName} revocadas.`, 'success');
                    setConfirmAction(null);
                    loadSessions();
          };

          const handleRevokeAllGlobal = async () => {
                    const count = await sessionService.revokeAllGlobal();
                    addToast(`${count} sesiones globales revocadas. Todos los usuarios serán deslogueados.`, 'warning');
                    setConfirmAction(null);
                    loadSessions();
          };

          if (loading) return <DashboardSkeleton />;

          return (
                    <div className="space-y-6 animate-fade-in">
                              <div className="flex items-center justify-between">
                                        <div>
                                                  <h1 className="text-2xl font-display font-bold flex items-center gap-2">
                                                            <Monitor className="w-6 h-6 text-nebula-400" /> Sesiones Activas
                                                  </h1>
                                                  <p className="text-sm text-text-muted mt-1">Monitorea y administra las sesiones de todos los usuarios</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                                  <button onClick={() => loadSessions()} className="btn-ghost text-xs flex items-center gap-1">
                                                            <RefreshCw className="w-3.5 h-3.5" /> Refrescar
                                                  </button>
                                                  <button
                                                            onClick={() => setConfirmAction({ type: 'global', label: 'Cerrar TODAS las sesiones activas' })}
                                                            className="btn-ghost text-xs text-red-400 hover:text-red-300 flex items-center gap-1"
                                                  >
                                                            <AlertTriangle className="w-3.5 h-3.5" /> Forzar cierre global
                                                  </button>
                                        </div>
                              </div>

                              {/* Stats */}
                              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                        <div className="stat-card flex items-center gap-3">
                                                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                                                            <Wifi className="w-5 h-5 text-emerald-400" />
                                                  </div>
                                                  <div>
                                                            <p className="text-xs text-text-muted">Activas</p>
                                                            <p className="text-xl font-display font-bold text-emerald-400">{stats.active}</p>
                                                  </div>
                                        </div>
                                        <div className="stat-card flex items-center gap-3">
                                                  <div className="w-10 h-10 rounded-xl bg-nebula-500/10 border border-nebula-500/20 flex items-center justify-center">
                                                            <Users className="w-5 h-5 text-nebula-400" />
                                                  </div>
                                                  <div>
                                                            <p className="text-xs text-text-muted">Estudiantes</p>
                                                            <p className="text-xl font-display font-bold">{stats.byRole.student}</p>
                                                  </div>
                                        </div>
                                        <div className="stat-card flex items-center gap-3">
                                                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                                                            <Users className="w-5 h-5 text-purple-400" />
                                                  </div>
                                                  <div>
                                                            <p className="text-xs text-text-muted">Docentes</p>
                                                            <p className="text-xl font-display font-bold">{stats.byRole.teacher}</p>
                                                  </div>
                                        </div>
                                        <div className="stat-card flex items-center gap-3">
                                                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                                                            <Shield className="w-5 h-5 text-amber-400" />
                                                  </div>
                                                  <div>
                                                            <p className="text-xs text-text-muted">Administradores</p>
                                                            <p className="text-xl font-display font-bold">{stats.byRole.admin}</p>
                                                  </div>
                                        </div>
                              </div>

                              {/* Filters */}
                              <div className="flex flex-wrap gap-3">
                                        <select value={filter} onChange={e => setFilter(e.target.value as typeof filter)} className="orionix-input w-auto min-w-[130px] cursor-pointer text-sm">
                                                  <option value="all">Todos los estados</option>
                                                  <option value="active">Activas</option>
                                                  <option value="revoked">Revocadas</option>
                                                  <option value="expired">Expiradas</option>
                                        </select>
                                        <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)} className="orionix-input w-auto min-w-[130px] cursor-pointer text-sm">
                                                  <option value="all">Todos los roles</option>
                                                  <option value="student">Estudiantes</option>
                                                  <option value="teacher">Docentes</option>
                                                  <option value="admin">Administradores</option>
                                        </select>
                                        <span className="text-xs text-text-muted self-center">{filtered.length} sesión(es)</span>
                              </div>

                              {/* Session list grouped by user */}
                              {Object.keys(userGroups).length === 0 ? (
                                        <EmptyState icon="search" title="Sin sesiones" description="No se encontraron sesiones con los filtros seleccionados." />
                              ) : (
                                        <div className="space-y-3">
                                                  {Object.entries(userGroups).map(([userId, group]) => {
                                                            const isExpanded = expandedUser === userId;
                                                            const activeSessions = group.sessions.filter(s => s.status === 'active');

                                                            return (
                                                                      <div key={userId} className="orionix-card overflow-hidden">
                                                                                {/* User header */}
                                                                                <button
                                                                                          onClick={() => setExpandedUser(isExpanded ? null : userId)}
                                                                                          className="w-full p-4 flex items-center gap-4 hover:bg-surface-hover/30 transition-colors"
                                                                                >
                                                                                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-nebula-500/30 to-astral-500/20 flex items-center justify-center text-sm font-bold text-text-primary shrink-0">
                                                                                                    {group.name.charAt(0)}
                                                                                          </div>
                                                                                          <div className="flex-1 text-left min-w-0">
                                                                                                    <p className="text-sm font-semibold text-text-primary truncate">{group.name}</p>
                                                                                                    <div className="flex items-center gap-2 mt-0.5">
                                                                                                              <span className={`badge ${roleBadge[group.role]}`}>{roleLabels[group.role]}</span>
                                                                                                              <span className="text-[10px] text-text-muted">{group.sessions.length} sesión(es) · {activeSessions.length} activa(s)</span>
                                                                                                    </div>
                                                                                          </div>
                                                                                          <div className="flex items-center gap-2 shrink-0">
                                                                                                    {activeSessions.length > 0 && (
                                                                                                              <button
                                                                                                                        onClick={e => { e.stopPropagation(); setConfirmAction({ type: 'user', target: userId, label: `Cerrar todas las sesiones de ${group.name}` }); }}
                                                                                                                        className="text-xs text-red-400/70 hover:text-red-400 flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-red-500/10 transition-colors"
                                                                                                              >
                                                                                                                        <Trash2 className="w-3 h-3" /> Cerrar todas
                                                                                                              </button>
                                                                                                    )}
                                                                                                    {isExpanded ? <ChevronUp className="w-4 h-4 text-text-muted" /> : <ChevronDown className="w-4 h-4 text-text-muted" />}
                                                                                          </div>
                                                                                </button>

                                                                                {/* Expanded session details */}
                                                                                {isExpanded && (
                                                                                          <div className="border-t border-border-subtle">
                                                                                                    {group.sessions.map(s => {
                                                                                                              const DeviceIcon = getDeviceIcon(s.device);
                                                                                                              return (
                                                                                                                        <div key={s.id} className="px-4 py-3 flex items-center gap-4 hover:bg-surface-hover/20 transition-colors border-b border-border-subtle last:border-0">
                                                                                                                                  <DeviceIcon className="w-5 h-5 text-text-muted shrink-0" />
                                                                                                                                  <div className="flex-1 min-w-0">
                                                                                                                                            <p className="text-xs font-medium text-text-primary">{s.device}</p>
                                                                                                                                            <div className="flex items-center gap-3 mt-1 text-[10px] text-text-muted">
                                                                                                                                                      <span className="flex items-center gap-1"><Globe className="w-3 h-3" />{s.ip}</span>
                                                                                                                                                      <span>{s.location}</span>
                                                                                                                                                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{timeAgo(s.lastActive)}</span>
                                                                                                                                            </div>
                                                                                                                                  </div>
                                                                                                                                  <div className="flex items-center gap-2 shrink-0">
                                                                                                                                            <span className={`badge ${statusBadge[s.status]}`}>{statusLabels[s.status]}</span>
                                                                                                                                            {s.status === 'active' && (
                                                                                                                                                      <button
                                                                                                                                                                onClick={() => handleRevokeSession(s.id, s.userName)}
                                                                                                                                                                title="Revocar esta sesión"
                                                                                                                                                                className="p-1.5 rounded-lg hover:bg-red-500/10 text-red-400/60 hover:text-red-400 transition-colors"
                                                                                                                                                      >
                                                                                                                                                                <XCircle className="w-4 h-4" />
                                                                                                                                                      </button>
                                                                                                                                            )}
                                                                                                                                  </div>
                                                                                                                        </div>
                                                                                                              );
                                                                                                    })}
                                                                                          </div>
                                                                                )}
                                                                      </div>
                                                            );
                                                  })}
                                        </div>
                              )}

                              {/* Confirmation Modal */}
                              {confirmAction && (
                                        <div className="fixed inset-0 bg-orion-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setConfirmAction(null)}>
                                                  <div className="orionix-card p-6 w-full max-w-md animate-scale-in" onClick={e => e.stopPropagation()}>
                                                            <div className="flex items-center gap-3 mb-4">
                                                                      <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center">
                                                                                <AlertTriangle className="w-5 h-5 text-red-400" />
                                                                      </div>
                                                                      <div>
                                                                                <h3 className="font-display font-semibold text-text-primary">Confirmar acción</h3>
                                                                                <p className="text-xs text-text-muted">{confirmAction.label}</p>
                                                                      </div>
                                                            </div>
                                                            <p className="text-sm text-text-secondary mb-6">
                                                                      {confirmAction.type === 'global'
                                                                                ? 'Esto cerrará TODAS las sesiones activas del sistema. Todos los usuarios (incluyéndote) serán redirigidos al login.'
                                                                                : 'Los usuarios afectados serán redirigidos al login automáticamente.'
                                                                      }
                                                            </p>
                                                            <div className="flex gap-3">
                                                                      <button onClick={() => setConfirmAction(null)} className="btn-secondary flex-1">Cancelar</button>
                                                                      <button
                                                                                onClick={() => {
                                                                                          if (confirmAction.type === 'global') handleRevokeAllGlobal();
                                                                                          else if (confirmAction.type === 'user' && confirmAction.target) {
                                                                                                    const group = userGroups[confirmAction.target];
                                                                                                    handleRevokeAllUser(confirmAction.target, group?.name || '');
                                                                                          }
                                                                                }}
                                                                                className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 transition-colors"
                                                                      >
                                                                                Confirmar
                                                                      </button>
                                                            </div>
                                                  </div>
                                        </div>
                              )}
                    </div>
          );
}
