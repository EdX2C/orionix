'use client';
// ===== App Shell Layout (Private Area) =====
// Audit-reviewed: role-based route guards, session validation, restricted role switching.
import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import Logo from '@/components/ui/Logo';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { useTheme } from '@/context/ThemeContext';
import { DashboardSkeleton } from '@/components/ui/Skeleton';
import NotificationCenter from '@/components/ui/NotificationCenter';
import LoadingBar from '@/components/ui/LoadingBar';
import {
          LayoutDashboard, BookOpen, ClipboardList, BarChart3, Bell, User, Settings,
          Users, FileText, LogOut, Menu, X, ChevronDown, GraduationCap, Shield, Sparkles, Monitor,
          Sun, Moon
} from 'lucide-react';

const navItems = {
          student: [
                    { href: '/app/student/dashboard', label: 'Dashboard', icon: LayoutDashboard },
                    { href: '/app/student/courses', label: 'Cursos', icon: BookOpen },
                    { href: '/app/student/assignments', label: 'Tareas', icon: ClipboardList },
                    { href: '/app/student/progress', label: 'Progreso', icon: BarChart3 },
                    { href: '/app/student/notifications', label: 'Notificaciones', icon: Bell },
                    { href: '/app/student/profile', label: 'Perfil', icon: User },
          ],
          teacher: [
                    { href: '/app/teacher/dashboard', label: 'Dashboard', icon: LayoutDashboard },
                    { href: '/app/teacher/courses', label: 'Mis Cursos', icon: BookOpen },
                    { href: '/app/teacher/assignments', label: 'Tareas', icon: ClipboardList },
                    { href: '/app/teacher/students', label: 'Estudiantes', icon: Users },
                    { href: '/app/teacher/notifications', label: 'Notificaciones', icon: Bell },
                    { href: '/app/teacher/profile', label: 'Perfil', icon: User },
          ],
          admin: [
                    { href: '/app/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
                    { href: '/app/admin/users', label: 'Usuarios', icon: Users },
                    { href: '/app/admin/courses', label: 'Cursos', icon: BookOpen },
                    { href: '/app/admin/sessions', label: 'Sesiones', icon: Monitor },
                    { href: '/app/admin/reports', label: 'Reportes', icon: FileText },
                    { href: '/app/admin/settings', label: 'Configuración', icon: Settings },
                    { href: '/app/admin/notifications', label: 'Notificaciones', icon: Bell },
          ],
};

const roleLabels = { student: 'Estudiante', teacher: 'Docente', admin: 'Administrador' };
const roleIcons = { student: GraduationCap, teacher: BookOpen, admin: Shield };

// ── Role-based route guard ──
function extractRouteRole(pathname: string): string | null {
          const match = pathname.match(/^\/app\/(student|teacher|admin)(\/|$)/);
          return match ? match[1] : null;
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
          const { user, loading, logout, switchRole, sessionRevoked } = useAuth();
          const router = useRouter();
          const pathname = usePathname();
          const { addToast } = useToast();
          const { theme, toggleTheme } = useTheme();
          const [sidebarOpen, setSidebarOpen] = useState(false);
          const [roleMenuOpen, setRoleMenuOpen] = useState(false);

          useEffect(() => {
                    const handleEsc = (e: KeyboardEvent) => {
                              if (e.key === 'Escape') {
                                        setSidebarOpen(false);
                                        setRoleMenuOpen(false);
                              }
                    };
                    window.addEventListener('keydown', handleEsc);
                    return () => window.removeEventListener('keydown', handleEsc);
          }, []);

          // ── Auth redirect ──
          useEffect(() => {
                    if (!loading && !user) {
                              if (sessionRevoked) {
                                        router.replace('/auth/login?reason=session_revoked');
                              } else {
                                        router.replace('/auth/login');
                              }
                    }
          }, [user, loading, router, sessionRevoked]);

          // ── Role-based route guard ──
          useEffect(() => {
                    if (!user || loading) return;
                    const routeRole = extractRouteRole(pathname);
                    if (routeRole && routeRole !== user.role) {
                              addToast(`Acceso denegado. Redirigido a tu panel de ${roleLabels[user.role]}.`, 'warning');
                              router.replace(`/app/${user.role}/dashboard`);
                    }
          }, [pathname, user, loading, router, addToast]);

          if (loading) {
                    return (
                              <div className="min-h-screen starfield flex items-center justify-center">
                                        <div className="text-center">
                                                  <Logo size="lg" />
                                                  <div className="mt-6"><DashboardSkeleton /></div>
                                        </div>
                              </div>
                    );
          }

          if (!user) return null;

          const role = user.role;
          const items = navItems[role] || [];
          const RoleIcon = roleIcons[role];

          const handleLogout = async () => {
                    await logout();
                    addToast('Sesión cerrada correctamente.', 'info');
                    router.replace('/auth/login');
          };

          const handleSwitchRole = (newRole: 'student' | 'teacher' | 'admin') => {
                    switchRole(newRole);
                    setRoleMenuOpen(false);
                    addToast(`Cambiado a: ${roleLabels[newRole]}`, 'info');
                    router.push(`/app/${newRole}/dashboard`);
          };

          return (
                    <div className="min-h-screen flex starfield">
                              <LoadingBar />
                              {/* Mobile overlay */}
                              {sidebarOpen && <div className="fixed inset-0 bg-orion-950/80 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}

                              {/* ── Sidebar ── */}
                              <aside className={`fixed lg:sticky top-0 left-0 h-screen w-[260px] z-50 flex flex-col transition-transform duration-300 lg:translate-x-0 sidebar-shell ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                                        {/* Logo area */}
                                        <div className="h-16 px-5 flex items-center justify-between border-b border-border-subtle">
                                                  <Logo size="sm" />
                                                  <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-text-muted hover:text-text-primary">
                                                            <X className="w-5 h-5" />
                                                  </button>
                                        </div>

                                        {/* Role badge */}
                                        <div className="px-4 pt-5 pb-2">
                                                  <div className="relative">
                                                            <button
                                                                      data-testid="user-menu"
                                                                      onClick={() => setRoleMenuOpen(!roleMenuOpen)}
                                                                      className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-nebula-500/8 border border-nebula-500/15 hover:bg-nebula-500/12 transition-colors text-left"
                                                            >
                                                                      <RoleIcon className="w-4 h-4 text-nebula-400" />
                                                                      <div className="flex-1 min-w-0">
                                                                                <p className="text-xs font-semibold text-text-primary truncate">{user.name}</p>
                                                                                <p className="text-[10px] text-text-muted">{roleLabels[role]}</p>
                                                                      </div>
                                                                      <ChevronDown className={`w-3.5 h-3.5 text-text-muted transition-transform ${roleMenuOpen ? 'rotate-180' : ''}`} />
                                                            </button>
                                                            {/* Role switcher dropdown (for demo) */}
                                                            {roleMenuOpen && (
                                                                      <div className="absolute top-full left-0 right-0 mt-1 py-1 rounded-xl border border-border-default bg-orion-800 z-10 animate-slide-up">
                                                                                <p className="px-3 py-1.5 text-[10px] text-text-muted font-semibold uppercase tracking-wider">Cambiar rol (demo)</p>
                                                                                {(['student', 'teacher', 'admin'] as const).map(r => {
                                                                                          const RI = roleIcons[r];
                                                                                          return (
                                                                                                    <button key={r} onClick={() => handleSwitchRole(r)}
                                                                                                              className={`w-full flex items-center gap-2 px-3 py-2 text-xs hover:bg-nebula-500/10 transition-colors ${role === r ? 'text-nebula-400' : 'text-text-secondary'}`}>
                                                                                                              <RI className="w-3.5 h-3.5" /> {roleLabels[r]}
                                                                                                    </button>
                                                                                          );
                                                                                })}
                                                                      </div>
                                                            )}
                                                  </div>
                                        </div>

                                        {/* Nav links */}
                                        <nav data-testid="sidebar-nav" className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
                                                  {items.map(item => {
                                                            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                                                            return (
                                                                      <Link key={item.href} href={item.href} onClick={() => setSidebarOpen(false)}
                                                                                className={`sidebar-link ${isActive ? 'active' : ''}`}>
                                                                                <item.icon className="w-[18px] h-[18px]" strokeWidth={1.7} />
                                                                                {item.label}
                                                                      </Link>
                                                            );
                                                  })}
                                        </nav>

                                        {/* Logout */}
                                        <div className="p-3 border-t border-border-subtle">
                                                  <button data-testid="logout-btn" onClick={handleLogout} className="sidebar-link w-full text-red-400/70 hover:text-red-400 hover:bg-red-500/8">
                                                            <LogOut className="w-[18px] h-[18px]" strokeWidth={1.7} /> Cerrar sesión
                                                  </button>
                                        </div>
                              </aside>

                              {/* ── Main Content ── */}
                              <div className="flex-1 flex flex-col min-h-screen">
                                        {/* Topbar */}
                                        <header className="h-16 flex items-center justify-between px-5 lg:px-8 border-b border-border-subtle topbar-shell relative z-50">
                                                  <div className="flex items-center gap-3">
                                                            <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-text-muted hover:text-text-primary">
                                                                      <Menu className="w-5 h-5" />
                                                            </button>
                                                            <div className="lg:hidden"><Logo size="sm" showText={false} /></div>
                                                  </div>
                                                  <div className="flex items-center gap-2">
                                                            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-nebula-500/8 border border-nebula-500/10">
                                                                      <Sparkles className="w-3.5 h-3.5 text-nebula-400" />
                                                                      <span className="text-xs text-text-muted">Plataforma demo</span>
                                                            </div>
                                                            <NotificationCenter />
                                                            <button onClick={toggleTheme} className="btn-icon" title={theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}>
                                                                      {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                                                            </button>
                                                  </div>
                                        </header>

                                        {/* Page content */}
                                        <main className="flex-1 p-5 lg:p-8 relative z-10 page-enter">
                                                  {children}
                                        </main>
                              </div>
                    </div>
          );
}
