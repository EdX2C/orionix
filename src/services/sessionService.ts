// ===== Orionix Session Service =====
// Manages user sessions with create, validate, revoke, and auto-logout support.

import { Session } from '@/types';
import { mockSessions } from '@/data/sessions';

const STORAGE_KEY = 'orionix_session_id';
const _sessions = [...mockSessions];

// ── Helpers ──
function generateSessionId(): string {
          return `sess-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function getDeviceInfo(): string {
          if (typeof navigator === 'undefined') return 'Unknown';
          const ua = navigator.userAgent;
          if (ua.includes('Windows')) return `Windows — ${ua.includes('Edg') ? 'Edge' : ua.includes('Chrome') ? 'Chrome' : ua.includes('Firefox') ? 'Firefox' : 'Browser'}`;
          if (ua.includes('Macintosh')) return `macOS — ${ua.includes('Chrome') ? 'Chrome' : ua.includes('Safari') ? 'Safari' : 'Browser'}`;
          if (ua.includes('iPhone') || ua.includes('iPad')) return `iOS — Safari`;
          if (ua.includes('Android')) return `Android — Chrome`;
          if (ua.includes('Linux')) return `Linux — ${ua.includes('Firefox') ? 'Firefox' : 'Chrome'}`;
          return 'Desktop — Browser';
}

function getMockIp(): string {
          return `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
}

// ── Session Service ──
export const sessionService = {
          /** Create a new session for a user (on login) */
          createSession(userId: string, userName: string, userRole: string): string {
                    const sessionId = generateSessionId();
                    const session: Session = {
                              id: sessionId,
                              userId,
                              userName,
                              userRole: userRole as Session['userRole'],
                              device: getDeviceInfo(),
                              browser: navigator?.userAgent?.includes('Chrome') ? 'Chrome' : navigator?.userAgent?.includes('Firefox') ? 'Firefox' : 'Safari',
                              ip: getMockIp(),
                              location: 'Bogotá, Colombia',
                              createdAt: new Date().toISOString(),
                              lastActive: new Date().toISOString(),
                              status: 'active',
                    };
                    _sessions.push(session);
                    if (typeof window !== 'undefined') {
                              localStorage.setItem(STORAGE_KEY, sessionId);
                    }
                    return sessionId;
          },

          /** Get the current session ID from storage */
          getCurrentSessionId(): string | null {
                    if (typeof window === 'undefined') return null;
                    return localStorage.getItem(STORAGE_KEY);
          },

          /** Validate that the current session is still active. Returns false if revoked/expired/missing. */
          validateSession(): boolean {
                    const sessionId = this.getCurrentSessionId();
                    if (!sessionId) return false;
                    const session = _sessions.find(s => s.id === sessionId);
                    if (!session) return false;
                    if (session.status !== 'active') return false;
                    // Update lastActive timestamp
                    session.lastActive = new Date().toISOString();
                    return true;
          },

          /** Get all sessions (admin) */
          async listAll(): Promise<Session[]> {
                    return [..._sessions].sort((a, b) => new Date(b.lastActive).getTime() - new Date(a.lastActive).getTime());
          },

          /** Get sessions for a specific user */
          async listByUser(userId: string): Promise<Session[]> {
                    return _sessions.filter(s => s.userId === userId);
          },

          /** Revoke a specific session by ID */
          async revokeSession(sessionId: string): Promise<void> {
                    const session = _sessions.find(s => s.id === sessionId);
                    if (session) {
                              session.status = 'revoked';
                    }
          },

          /** Revoke ALL sessions for a user */
          async revokeAllByUser(userId: string): Promise<number> {
                    let count = 0;
                    _sessions.forEach(s => {
                              if (s.userId === userId && s.status === 'active') {
                                        s.status = 'revoked';
                                        count++;
                              }
                    });
                    return count;
          },

          /** Revoke ALL active sessions globally (admin nuclear option) */
          async revokeAllGlobal(): Promise<number> {
                    let count = 0;
                    _sessions.forEach(s => {
                              if (s.status === 'active') {
                                        s.status = 'revoked';
                                        count++;
                              }
                    });
                    return count;
          },

          /** Clean up on logout */
          destroyCurrentSession(): void {
                    const sessionId = this.getCurrentSessionId();
                    if (sessionId) {
                              const session = _sessions.find(s => s.id === sessionId);
                              if (session) session.status = 'revoked';
                    }
                    if (typeof window !== 'undefined') {
                              localStorage.removeItem(STORAGE_KEY);
                    }
          },

          /** Get session stats for admin dashboard */
          getStats(): { active: number; total: number; byRole: Record<string, number> } {
                    const active = _sessions.filter(s => s.status === 'active');
                    return {
                              active: active.length,
                              total: _sessions.length,
                              byRole: {
                                        student: active.filter(s => s.userRole === 'student').length,
                                        teacher: active.filter(s => s.userRole === 'teacher').length,
                                        admin: active.filter(s => s.userRole === 'admin').length,
                              },
                    };
          },
};
