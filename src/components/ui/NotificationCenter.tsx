'use client';
import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { notificationService } from '@/services';
import { useAuth } from '@/context/AuthContext';
import { Notification } from '@/types';
import { Bell, Check, CheckCheck, Info, CheckCircle, AlertTriangle, BookOpen, ClipboardList, ArrowRight } from 'lucide-react';

const typeIcons: Record<string, React.ElementType> = { info: Info, success: CheckCircle, warning: AlertTriangle, assignment: ClipboardList, course: BookOpen, grade: CheckCircle };
const typeColors: Record<string, string> = { info: 'text-astral-400', success: 'text-emerald-400', warning: 'text-amber-400', assignment: 'text-nebula-400', course: 'text-nebula-400', grade: 'text-emerald-400' };

export default function NotificationCenter() {
          const { user } = useAuth();
          const [notifications, setNotifications] = useState<Notification[]>([]);
          const [open, setOpen] = useState(false);
          const ref = useRef<HTMLDivElement>(null);

          useEffect(() => {
                    if (user) notificationService.list(user.id).then(setNotifications);
          }, [user]);

          useEffect(() => {
                    const handler = (e: MouseEvent) => {
                              if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
                    };
                    document.addEventListener('mousedown', handler);
                    return () => document.removeEventListener('mousedown', handler);
          }, []);

          const unread = notifications.filter(n => !n.isRead);
          const role = user?.role || 'student';

          const markRead = async (id: string) => {
                    await notificationService.markRead(id);
                    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
          };

          const markAllRead = async () => {
                    for (const n of unread) await notificationService.markRead(n.id);
                    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
          };

          const recent = notifications.slice(0, 5);

          return (
                    <div className="relative" ref={ref}>
                              <button
                                        onClick={() => setOpen(!open)}
                                        className="relative w-10 h-10 rounded-xl flex items-center justify-center text-text-secondary hover:text-text-primary hover:bg-surface-glass transition-all"
                                        aria-label="Notificaciones"
                              >
                                        <Bell className="w-5 h-5" />
                                        {unread.length > 0 && (
                                                  <span className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full bg-gradient-to-r from-nebula-500 to-astral-500 text-[10px] font-bold text-white flex items-center justify-center animate-pulse-glow">
                                                            {unread.length > 9 ? '9+' : unread.length}
                                                  </span>
                                        )}
                              </button>

                              {open && (
                                        <div className="absolute right-0 top-full mt-2 w-96 max-h-[28rem] rounded-2xl border border-border-default bg-orion-800/95 backdrop-blur-2xl shadow-2xl shadow-nebula-500/10 z-50 overflow-hidden animate-slide-up"
                                                  style={{ animationDuration: '0.2s' }}
                                        >
                                                  {/* Header */}
                                                  <div className="flex items-center justify-between px-5 py-4 border-b border-border-subtle">
                                                            <h3 className="font-display font-semibold text-sm">Notificaciones</h3>
                                                            {unread.length > 0 && (
                                                                      <button onClick={markAllRead} className="text-xs text-nebula-400 hover:text-nebula-300 flex items-center gap-1 transition-colors">
                                                                                <CheckCheck className="w-3.5 h-3.5" /> Marcar todas
                                                                      </button>
                                                            )}
                                                  </div>

                                                  {/* List */}
                                                  <div className="overflow-y-auto max-h-[20rem]">
                                                            {recent.length === 0 ? (
                                                                      <div className="py-10 text-center">
                                                                                <Bell className="w-8 h-8 text-text-muted mx-auto mb-2" strokeWidth={1} />
                                                                                <p className="text-sm text-text-muted">Sin notificaciones</p>
                                                                      </div>
                                                            ) : (
                                                                      recent.map(n => {
                                                                                const Icon = typeIcons[n.type] || Info;
                                                                                return (
                                                                                          <div key={n.id} className={`flex items-start gap-3 px-5 py-3.5 hover:bg-surface-glass transition-colors cursor-pointer ${!n.isRead ? 'bg-nebula-500/5' : ''}`}>
                                                                                                    <div className={`w-8 h-8 rounded-lg bg-surface-glass border border-border-subtle flex items-center justify-center shrink-0 mt-0.5 ${typeColors[n.type]}`}>
                                                                                                              <Icon className="w-3.5 h-3.5" />
                                                                                                    </div>
                                                                                                    <div className="flex-1 min-w-0">
                                                                                                              <p className={`text-sm leading-snug ${!n.isRead ? 'font-semibold text-text-primary' : 'text-text-secondary'}`}>{n.title}</p>
                                                                                                              <p className="text-xs text-text-muted mt-0.5 line-clamp-1">{n.message}</p>
                                                                                                              <p className="text-[10px] text-text-muted mt-1">{formatRelative(n.createdAt)}</p>
                                                                                                    </div>
                                                                                                    {!n.isRead && (
                                                                                                              <button onClick={(e) => { e.stopPropagation(); markRead(n.id); }} className="shrink-0 mt-1 text-text-muted hover:text-emerald-400 transition-colors" title="Marcar como leída">
                                                                                                                        <Check className="w-3.5 h-3.5" />
                                                                                                              </button>
                                                                                                    )}
                                                                                          </div>
                                                                                );
                                                                      })
                                                            )}
                                                  </div>

                                                  {/* Footer */}
                                                  <div className="border-t border-border-subtle px-5 py-3">
                                                            <Link
                                                                      href={`/app/${role}/notifications`}
                                                                      onClick={() => setOpen(false)}
                                                                      className="flex items-center justify-center gap-1.5 text-xs text-nebula-400 hover:text-nebula-300 font-medium transition-colors"
                                                            >
                                                                      Ver todas las notificaciones <ArrowRight className="w-3 h-3" />
                                                            </Link>
                                                  </div>
                                        </div>
                              )}
                    </div>
          );
}

function formatRelative(dateStr: string): string {
          const diff = Date.now() - new Date(dateStr).getTime();
          const mins = Math.floor(diff / 60000);
          if (mins < 1) return 'Ahora';
          if (mins < 60) return `Hace ${mins}m`;
          const hrs = Math.floor(mins / 60);
          if (hrs < 24) return `Hace ${hrs}h`;
          const days = Math.floor(hrs / 24);
          if (days < 7) return `Hace ${days}d`;
          return new Date(dateStr).toLocaleDateString('es', { day: 'numeric', month: 'short' });
}
