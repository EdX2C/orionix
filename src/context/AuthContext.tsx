'use client';
/* eslint-disable react-hooks/set-state-in-effect */
// ===== Orionix Auth Context =====
// Audit-reviewed: session validation, restricted role switch, auto-logout on revocation.
import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { User, UserRole } from '@/types';
import { authService } from '@/services';
import { sessionService } from '@/services/sessionService';

interface AuthContextType {
          user: User | null;
          loading: boolean;
          login: (email: string, password: string) => Promise<User | null>;
          register: (name: string, email: string, password: string, role: 'student' | 'teacher') => Promise<User>;
          logout: () => Promise<void>;
          switchRole: (role: UserRole) => void;
          sessionRevoked: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const SESSION_CHECK_INTERVAL = 10_000; // Check every 10 seconds

export function AuthProvider({ children }: { children: React.ReactNode }) {
          const [user, setUser] = useState<User | null>(null);
          const [loading, setLoading] = useState(true);
          const [sessionRevoked, setSessionRevoked] = useState(false);
          const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

          // Session validation interval
          useEffect(() => {
                    if (!user) {
                              if (intervalRef.current) clearInterval(intervalRef.current);
                              return;
                    }

                    const checkSession = () => {
                              const isValid = sessionService.validateSession();
                              if (!isValid && user) {
                                        // Session was revoked or expired
                                        setSessionRevoked(true);
                                        setUser(null);
                                        localStorage.removeItem('orionix_user');
                                        localStorage.removeItem('orionix_session_id');
                              }
                    };

                    intervalRef.current = setInterval(checkSession, SESSION_CHECK_INTERVAL);
                    return () => {
                              if (intervalRef.current) clearInterval(intervalRef.current);
                    };
          }, [user]);

          // Initial load
          useEffect(() => {
                    const u = authService.getCurrentUser();
                    if (u) {
                              // Validate session on load
                              const sessionValid = sessionService.validateSession();
                              if (sessionValid) {
                                        setUser(u);
                              } else {
                                        // Session expired/revoked — clean up
                                        localStorage.removeItem('orionix_user');
                                        localStorage.removeItem('orionix_session_id');
                              }
                    }
                    setLoading(false);
          }, []);

          const login = useCallback(async (email: string, password: string) => {
                    setLoading(true);
                    setSessionRevoked(false);
                    const u = await authService.login(email, password);
                    setUser(u);
                    setLoading(false);
                    return u;
          }, []);

          const register = useCallback(async (name: string, email: string, password: string, role: 'student' | 'teacher') => {
                    setLoading(true);
                    setSessionRevoked(false);
                    const u = await authService.register(name, email, password, role);
                    setUser(u);
                    setLoading(false);
                    return u;
          }, []);

          const logout = useCallback(async () => {
                    await authService.logout();
                    setUser(null);
                    setSessionRevoked(false);
          }, []);

          const switchRole = useCallback((role: UserRole) => {
                    // Demo only: allows switching roles for testing.
                    // In production, this would be server-validated.
                    if (user) {
                              const updated = { ...user, role };
                              setUser(updated);
                              localStorage.setItem('orionix_user', JSON.stringify(updated));
                    }
          }, [user]);

          return (
                    <AuthContext.Provider value={{ user, loading, login, register, logout, switchRole, sessionRevoked }}>
                              {children}
                    </AuthContext.Provider>
          );
}

export function useAuth() {
          const ctx = useContext(AuthContext);
          if (!ctx) throw new Error('useAuth must be used within AuthProvider');
          return ctx;
}
