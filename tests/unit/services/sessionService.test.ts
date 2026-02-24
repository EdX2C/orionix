import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock localStorage
const localStorageMock = (() => {
          let store: Record<string, string> = {};
          return {
                    getItem: (key: string) => store[key] || null,
                    setItem: (key: string, value: string) => { store[key] = value; },
                    removeItem: (key: string) => { delete store[key]; },
                    clear: () => { store = {}; },
          };
})();

Object.defineProperty(globalThis, 'localStorage', { value: localStorageMock });

// Mock navigator for sessionService
Object.defineProperty(globalThis, 'navigator', {
          value: { userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0' },
          writable: true,
});

describe('sessionService', () => {
          let sessionService: typeof import('@/services/sessionService').sessionService;

          beforeEach(async () => {
                    localStorageMock.clear();
                    // Re-import to reset in-memory state
                    vi.resetModules();
                    const mod = await import('@/services/sessionService');
                    sessionService = mod.sessionService;
          });

          describe('createSession', () => {
                    it('generates a session ID starting with "sess-"', () => {
                              const id = sessionService.createSession('u1', 'Test User', 'admin');
                              expect(id).toMatch(/^sess-/);
                    });

                    it('stores the session ID in localStorage', () => {
                              const id = sessionService.createSession('u1', 'Test', 'admin');
                              expect(localStorage.getItem('orionix_session_id')).toBe(id);
                    });

                    it('generates unique IDs across multiple calls', () => {
                              const ids = new Set<string>();
                              for (let i = 0; i < 10; i++) {
                                        ids.add(sessionService.createSession(`u${i}`, `User ${i}`, 'student'));
                              }
                              expect(ids.size).toBe(10);
                    });
          });

          describe('validateSession', () => {
                    it('returns true for an active session', () => {
                              sessionService.createSession('u1', 'Test', 'admin');
                              expect(sessionService.validateSession()).toBe(true);
                    });

                    it('returns false when no session exists', () => {
                              expect(sessionService.validateSession()).toBe(false);
                    });

                    it('returns false after session is revoked', async () => {
                              const id = sessionService.createSession('u1', 'Test', 'admin');
                              await sessionService.revokeSession(id);
                              expect(sessionService.validateSession()).toBe(false);
                    });
          });

          describe('destroyCurrentSession', () => {
                    it('removes session from localStorage', () => {
                              sessionService.createSession('u1', 'Test', 'admin');
                              expect(localStorage.getItem('orionix_session_id')).not.toBeNull();
                              sessionService.destroyCurrentSession();
                              expect(localStorage.getItem('orionix_session_id')).toBeNull();
                    });

                    it('marks the session as revoked', async () => {
                              const id = sessionService.createSession('u1', 'Test', 'admin');
                              sessionService.destroyCurrentSession();
                              // Session should no longer validate
                              localStorage.setItem('orionix_session_id', id);
                              expect(sessionService.validateSession()).toBe(false);
                    });
          });

          describe('revokeAllByUser', () => {
                    it('revokes all sessions for a given user', async () => {
                              sessionService.createSession('u1', 'Test', 'admin');
                              sessionService.createSession('u1', 'Test', 'admin');
                              const count = await sessionService.revokeAllByUser('u1');
                              expect(count).toBeGreaterThanOrEqual(2);
                    });
          });

          describe('getStats', () => {
                    it('returns stats with byRole breakdown', () => {
                              sessionService.createSession('u1', 'Admin', 'admin');
                              const stats = sessionService.getStats();
                              expect(stats).toHaveProperty('active');
                              expect(stats).toHaveProperty('total');
                              expect(stats).toHaveProperty('byRole');
                              expect(stats.byRole).toHaveProperty('student');
                              expect(stats.byRole).toHaveProperty('teacher');
                              expect(stats.byRole).toHaveProperty('admin');
                    });
          });
});
