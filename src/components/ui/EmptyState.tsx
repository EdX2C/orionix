'use client';
import React from 'react';
import { Inbox, Search, BookOpen, FileText, Bell, BookMarked, ClipboardList } from 'lucide-react';

const icons = {
          inbox: Inbox,
          search: Search,
          course: BookOpen,
          file: FileText,
          bell: Bell,
          book: BookMarked,
          clipboard: ClipboardList,
};

interface EmptyStateProps {
          icon?: keyof typeof icons;
          title: string;
          description: string;
          action?: { label: string; onClick: () => void };
}

export default function EmptyState({ icon = 'inbox', title, description, action }: EmptyStateProps) {
          const Icon = icons[icon];
          return (
                    <div className="flex flex-col items-center justify-center py-16 px-6 text-center animate-fade-in">
                              <div className="w-20 h-20 rounded-2xl bg-nebula-500/10 border border-nebula-500/20 flex items-center justify-center mb-6">
                                        <Icon className="w-9 h-9 text-nebula-400" strokeWidth={1.5} />
                              </div>
                              <h3 className="text-lg font-display font-semibold text-text-primary mb-2">{title}</h3>
                              <p className="text-sm text-text-muted max-w-sm mb-6">{description}</p>
                              {action && (
                                        <button onClick={action.onClick} className="btn-primary">
                                                  {action.label}
                                        </button>
                              )}
                    </div>
          );
}
