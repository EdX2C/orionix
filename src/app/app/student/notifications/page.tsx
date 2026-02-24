'use client';
// ===== Shared: Enhanced Notifications Page =====
import React, { useEffect, useState } from 'react';
import { notificationService } from '@/services';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { Notification } from '@/types';
import { DashboardSkeleton } from '@/components/ui/Skeleton';
import EmptyState from '@/components/ui/EmptyState';
import {
          Bell, Mail, CheckCircle, AlertTriangle, BookOpen, ClipboardList, Info,
          Check, CheckCheck, Filter, Trash2
} from 'lucide-react';

const typeIcons: Record<string, React.ElementType> = {
          info: Info, success: CheckCircle, warning: AlertTriangle,
          assignment: ClipboardList, course: BookOpen, grade: CheckCircle
};
const typeColors: Record<string, string> = {
          info: 'text-astral-400 bg-astral-500/10 border-astral-500/20',
          success: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
          warning: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
          assignment: 'text-nebula-400 bg-nebula-500/10 border-nebula-500/20',
          course: 'text-nebula-400 bg-nebula-500/10 border-nebula-500/20',
          grade: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
};
const typeLabels: Record<string, string> = {
          info: 'Info', success: 'Éxito', warning: 'Alerta',
          assignment: 'Tarea', course: 'Curso', grade: 'Nota',
};

function timeAgo(date: Date): string {
          const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
          if (seconds < 60) return 'Justo ahora';
          const minutes = Math.floor(seconds / 60);
          if (minutes < 60) return `Hace ${minutes}m`;
          const hours = Math.floor(minutes / 60);
          if (hours < 24) return `Hace ${hours}h`;
          const days = Math.floor(hours / 24);
          if (days < 7) return `Hace ${days}d`;
          return date.toLocaleDateString('es', { day: 'numeric', month: 'short' });
}

export default function NotificationsPage() {
          const { user } = useAuth();
          const { addToast } = useToast();
          const [notifications, setNotifications] = useState<Notification[]>([]);
          const [loading, setLoading] = useState(true);
          const [typeFilter, setTypeFilter] = useState<string>('all');
          const [readFilter, setReadFilter] = useState<'all' | 'unread' | 'read'>('all');

          useEffect(() => {
                    if (user) notificationService.list(user.id).then(n => { setNotifications(n); setLoading(false); });
          }, [user]);

          const markRead = async (id: string) => {
                    await notificationService.markRead(id);
                    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
          };

          const markAllRead = () => {
                    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
                    addToast('Todas las notificaciones marcadas como leídas', 'success');
          };

          const clearRead = () => {
                    setNotifications(prev => prev.filter(n => !n.isRead));
                    addToast('Notificaciones leídas eliminadas', 'info');
          };

          if (loading) return <DashboardSkeleton />;

          const unreadCount = notifications.filter(n => !n.isRead).length;

          // Get unique types for filter
          const availableTypes = ['all', ...new Set(notifications.map(n => n.type))];

          // Apply filters
          const filtered = notifications.filter(n => {
                    if (typeFilter !== 'all' && n.type !== typeFilter) return false;
                    if (readFilter === 'unread' && n.isRead) return false;
                    if (readFilter === 'read' && !n.isRead) return false;
                    return true;
          });

          // Group by date
          const today = new Date().toDateString();
          const yesterday = new Date(Date.now() - 86400000).toDateString();
          const groups: { label: string; items: Notification[] }[] = [];

          const todayItems = filtered.filter(n => new Date(n.createdAt).toDateString() === today);
          const yesterdayItems = filtered.filter(n => new Date(n.createdAt).toDateString() === yesterday);
          const olderItems = filtered.filter(n => {
                    const d = new Date(n.createdAt).toDateString();
                    return d !== today && d !== yesterday;
          });

          if (todayItems.length > 0) groups.push({ label: 'Hoy', items: todayItems });
          if (yesterdayItems.length > 0) groups.push({ label: 'Ayer', items: yesterdayItems });
          if (olderItems.length > 0) groups.push({ label: 'Anteriores', items: olderItems });

          return (
                    <div className="space-y-6 animate-fade-in">
                              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                        <div>
                                                  <h1 className="text-2xl font-display font-bold flex items-center gap-2">
                                                            Notificaciones
                                                            {unreadCount > 0 && (
                                                                      <span className="px-2 py-0.5 rounded-lg bg-nebula-500/20 border border-nebula-500/30 text-sm font-semibold text-nebula-400">{unreadCount}</span>
                                                            )}
                                                  </h1>
                                                  <p className="text-sm text-text-muted mt-1">{notifications.length} notificaciones · {unreadCount} sin leer</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                                  {unreadCount > 0 && (
                                                            <button onClick={markAllRead} className="btn-ghost text-xs flex items-center gap-1.5">
                                                                      <CheckCheck className="w-3.5 h-3.5" /> Marcar todas leídas
                                                            </button>
                                                  )}
                                                  {notifications.some(n => n.isRead) && (
                                                            <button onClick={clearRead} className="btn-ghost text-xs flex items-center gap-1.5 text-red-400 hover:text-red-300">
                                                                      <Trash2 className="w-3.5 h-3.5" /> Limpiar leídas
                                                            </button>
                                                  )}
                                        </div>
                              </div>

                              {/* Filters */}
                              <div className="flex flex-col sm:flex-row gap-3">
                                        {/* Type filter chips */}
                                        <div className="flex flex-wrap gap-1.5 flex-1">
                                                  {availableTypes.map(t => (
                                                            <button key={t} onClick={() => setTypeFilter(t)}
                                                                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${typeFilter === t
                                                                                          ? 'bg-nebula-500/20 text-nebula-300 border border-nebula-500/30'
                                                                                          : 'bg-surface-glass border border-border-subtle text-text-muted hover:text-text-secondary'
                                                                                }`}>
                                                                      {t === 'all' ? 'Todas' : typeLabels[t] || t}
                                                            </button>
                                                  ))}
                                        </div>
                                        {/* Read/Unread toggle */}
                                        <div className="flex items-center bg-surface-glass border border-border-subtle rounded-xl overflow-hidden shrink-0">
                                                  {(['all', 'unread', 'read'] as const).map(s => (
                                                            <button key={s} onClick={() => setReadFilter(s)}
                                                                      className={`px-3 py-2 text-[10px] font-medium transition-all ${readFilter === s ? 'bg-nebula-500/15 text-nebula-400' : 'text-text-muted hover:text-text-secondary'}`}>
                                                                      {s === 'all' ? 'Todas' : s === 'unread' ? 'Sin leer' : 'Leídas'}
                                                            </button>
                                                  ))}
                                        </div>
                              </div>

                              {/* Notification groups */}
                              {filtered.length === 0 ? (
                                        <EmptyState icon="bell" title="Sin notificaciones" description={readFilter !== 'all' ? `No hay notificaciones ${readFilter === 'unread' ? 'sin leer' : 'leídas'}.` : 'No tienes notificaciones por el momento.'} />
                              ) : (
                                        <div className="space-y-6">
                                                  {groups.map(group => (
                                                            <div key={group.label}>
                                                                      <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">{group.label}</h3>
                                                                      <div className="space-y-2">
                                                                                {group.items.map(n => {
                                                                                          const Icon = typeIcons[n.type] || Info;
                                                                                          const colors = typeColors[n.type] || typeColors.info;
                                                                                          return (
                                                                                                    <div key={n.id} className={`orionix-card p-4 flex items-start gap-4 transition-all group ${!n.isRead ? 'border-l-2 border-l-nebula-500' : 'opacity-60 hover:opacity-100'
                                                                                                              }`} style={{ transform: 'none' }}>
                                                                                                              <div className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 ${colors}`}>
                                                                                                                        <Icon className="w-4.5 h-4.5" />
                                                                                                              </div>
                                                                                                              <div className="flex-1 min-w-0">
                                                                                                                        <div className="flex items-center gap-2 mb-0.5">
                                                                                                                                  <p className={`font-semibold text-sm ${!n.isRead ? 'text-text-primary' : 'text-text-secondary'}`}>{n.title}</p>
                                                                                                                                  {!n.isRead && <span className="w-2 h-2 rounded-full bg-nebula-500 shrink-0" />}
                                                                                                                        </div>
                                                                                                                        <p className="text-xs text-text-secondary">{n.message}</p>
                                                                                                                        <p className="text-[10px] text-text-muted mt-1.5">{timeAgo(new Date(n.createdAt))}</p>
                                                                                                              </div>
                                                                                                              {!n.isRead && (
                                                                                                                        <button onClick={() => markRead(n.id)}
                                                                                                                                  className="shrink-0 opacity-0 group-hover:opacity-100 text-text-muted hover:text-emerald-400 transition-all p-1.5 rounded-lg hover:bg-emerald-500/10"
                                                                                                                                  title="Marcar como leída">
                                                                                                                                  <Check className="w-4 h-4" />
                                                                                                                        </button>
                                                                                                              )}
                                                                                                    </div>
                                                                                          );
                                                                                })}
                                                                      </div>
                                                            </div>
                                                  ))}
                                        </div>
                              )}

                              {/* Email note */}
                              <div className="glass rounded-xl p-4 flex items-center gap-3 text-xs text-text-muted">
                                        <Mail className="w-4 h-4 text-astral-400 shrink-0" />
                                        <p>Las notificaciones importantes también se envían a tu correo electrónico registrado.</p>
                              </div>
                    </div>
          );
}
