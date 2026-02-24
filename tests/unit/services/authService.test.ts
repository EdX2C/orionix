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
Object.defineProperty(globalThis, 'navigator', {
          value: { userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0' },
          writable: true,
});

describe('authService', () => {
          let authService: typeof import('@/services').authService;

          beforeEach(async () => {
                    localStorageMock.clear();
                    vi.resetModules();
                    const mod = await import('@/services');
                    authService = mod.authService;
          });

          describe('login', () => {
                    it('returns a user object for valid email', async () => {
                              const user = await authService.login('admin@orionix.edu', 'any');
                              expect(user).not.toBeNull();
                              expect(user!.email).toBe('admin@orionix.edu');
                              expect(user!.role).toBe('admin');
                    });

                    it('returns null for non-existent email', async () => {
                              const user = await authService.login('nobody@test.com', 'any');
                              expect(user).toBeNull();
                    });

                    it('stores user in localStorage on successful login', async () => {
                              await authService.login('admin@orionix.edu', 'test');
                              const stored = localStorage.getItem('orionix_user');
                              expect(stored).not.toBeNull();
                              const parsed = JSON.parse(stored!);
                              expect(parsed.email).toBe('admin@orionix.edu');
                    });

                    it('creates a session on successful login', async () => {
                              await authService.login('admin@orionix.edu', 'test');
                              const sessionId = localStorage.getItem('orionix_session_id');
                              expect(sessionId).not.toBeNull();
                              expect(sessionId).toMatch(/^sess-/);
                    });
          });

          describe('register', () => {
                    it('creates a new user with the given role', async () => {
                              const user = await authService.register('Test User', 'test@new.edu', 'pass', 'student');
                              expect(user).toBeTruthy();
                              expect(user.name).toBe('Test User');
                              expect(user.email).toBe('test@new.edu');
                              expect(user.role).toBe('student');
                    });

                    it('stores the new user in localStorage', async () => {
                              await authService.register('New', 'new@test.edu', 'pass', 'teacher');
                              const stored = localStorage.getItem('orionix_user');
                              expect(stored).not.toBeNull();
                              expect(JSON.parse(stored!).role).toBe('teacher');
                    });
          });

          describe('logout', () => {
                    it('clears user from localStorage', async () => {
                              await authService.login('admin@orionix.edu', 'test');
                              expect(localStorage.getItem('orionix_user')).not.toBeNull();
                              await authService.logout();
                              expect(localStorage.getItem('orionix_user')).toBeNull();
                    });

                    it('clears session from localStorage', async () => {
                              await authService.login('admin@orionix.edu', 'test');
                              expect(localStorage.getItem('orionix_session_id')).not.toBeNull();
                              await authService.logout();
                              expect(localStorage.getItem('orionix_session_id')).toBeNull();
                    });
          });

          describe('getCurrentUser', () => {
                    it('returns null when no user in localStorage', () => {
                              expect(authService.getCurrentUser()).toBeNull();
                    });

                    it('returns user when valid data in localStorage', async () => {
                              await authService.login('admin@orionix.edu', 'test');
                              const user = authService.getCurrentUser();
                              expect(user).not.toBeNull();
                              expect(user!.email).toBe('admin@orionix.edu');
                    });

                    it('returns null for corrupted localStorage data', () => {
                              localStorage.setItem('orionix_user', 'not-valid-json{{{');
                              const user = authService.getCurrentUser();
                              expect(user).toBeNull();
                    });
          });
});
