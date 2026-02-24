'use client';
import React from 'react';
import { BookOpen, ClipboardList, UserPlus, Award, Megaphone, CheckCircle, Star, Upload } from 'lucide-react';

export interface ActivityItem {
          id: string;
          type: 'enrollment' | 'submission' | 'grade' | 'course_published' | 'announcement' | 'achievement' | 'new_user' | 'module_added';
          title: string;
          description: string;
          userName: string;
          userRole: 'student' | 'teacher' | 'admin';
          timestamp: string;
}

const typeConfig: Record<string, { icon: React.ElementType; color: string; bg: string }> = {
          enrollment: { icon: UserPlus, color: 'text-astral-400', bg: 'bg-astral-500/10 border-astral-500/20' },
          submission: { icon: Upload, color: 'text-nebula-400', bg: 'bg-nebula-500/10 border-nebula-500/20' },
          grade: { icon: Star, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
          course_published: { icon: BookOpen, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
          announcement: { icon: Megaphone, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
          achievement: { icon: Award, color: 'text-nebula-400', bg: 'bg-nebula-500/10 border-nebula-500/20' },
          new_user: { icon: UserPlus, color: 'text-astral-400', bg: 'bg-astral-500/10 border-astral-500/20' },
          module_added: { icon: ClipboardList, color: 'text-nebula-400', bg: 'bg-nebula-500/10 border-nebula-500/20' },
};

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

export default function ActivityFeed({ activities, maxItems = 5 }: { activities: ActivityItem[]; maxItems?: number }) {
          const items = activities.slice(0, maxItems);

          if (items.length === 0) {
                    return (
                              <div className="text-center py-8">
                                        <CheckCircle className="w-8 h-8 text-text-muted mx-auto mb-2" strokeWidth={1} />
                                        <p className="text-sm text-text-muted">No hay actividad reciente</p>
                              </div>
                    );
          }

          return (
                    <div className="relative">
                              {/* Timeline connector */}
                              <div className="absolute left-[18px] top-6 bottom-6 w-px bg-gradient-to-b from-border-default via-border-subtle to-transparent" />

                              <div className="space-y-1">
                                        {items.map((item, i) => {
                                                  const cfg = typeConfig[item.type] || typeConfig.enrollment;
                                                  const Icon = cfg.icon;
                                                  return (
                                                            <div key={item.id} className="relative flex items-start gap-3.5 py-2.5 pl-0.5 group">
                                                                      <div className={`relative z-10 w-[34px] h-[34px] rounded-lg ${cfg.bg} border flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                                                                                <Icon className={`w-4 h-4 ${cfg.color}`} />
                                                                      </div>
                                                                      <div className="flex-1 min-w-0 pt-0.5">
                                                                                <p className="text-sm text-text-primary leading-snug">
                                                                                          <span className="font-semibold">{item.userName}</span>{' '}
                                                                                          <span className="text-text-secondary">{item.description}</span>
                                                                                </p>
                                                                                <p className="text-[11px] text-text-muted mt-0.5">{formatRelative(item.timestamp)}</p>
                                                                      </div>
                                                            </div>
                                                  );
                                        })}
                              </div>
                    </div>
          );
}
