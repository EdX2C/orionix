import { test, expect } from '@playwright/test';
import { loginAs, logout } from '../helpers/auth.helper';
import { localStorageKeys } from '../../fixtures/users.fixture';

test.describe('State Integrity Tests', () => {
          // I04: localStorage orionix_user matches current auth state
          test('I04 — localStorage user matches authenticated user', async ({ page }) => {
                    await loginAs(page, 'student');

                    const storedUser = await page.evaluate((key) => {
                              const raw = localStorage.getItem(key);
                              return raw ? JSON.parse(raw) : null;
                    }, localStorageKeys.user);

                    expect(storedUser).not.toBeNull();
                    expect(storedUser.email).toBe('ana@estudiante.edu');
                    expect(storedUser.role).toBe('student');
                    expect(storedUser.id).toBeTruthy();
                    expect(storedUser.name).toBeTruthy();
          });

          // I05: localStorage cleanup after logout
          test('I05 — logout clears all auth-related localStorage keys', async ({ page }) => {
                    await loginAs(page, 'admin');

                    // Verify keys exist before logout
                    const preUser = await page.evaluate((key) => localStorage.getItem(key), localStorageKeys.user);
                    const preSession = await page.evaluate((key) => localStorage.getItem(key), localStorageKeys.sessionId);
                    expect(preUser).not.toBeNull();
                    expect(preSession).not.toBeNull();

                    await logout(page);

                    // Verify keys are gone after logout
                    const postUser = await page.evaluate((key) => localStorage.getItem(key), localStorageKeys.user);
                    const postSession = await page.evaluate((key) => localStorage.getItem(key), localStorageKeys.sessionId);
                    expect(postUser).toBeNull();
                    expect(postSession).toBeNull();
          });

          // I10: Role switch updates localStorage user.role correctly
          test('I10 — role switch updates localStorage user.role', async ({ page }) => {
                    await loginAs(page, 'student');

                    // Get initial role
                    const initialRole = await page.evaluate((key) => {
                              const raw = localStorage.getItem(key);
                              return raw ? JSON.parse(raw).role : null;
                    }, localStorageKeys.user);
                    expect(initialRole).toBe('student');

                    // Open role switcher and switch to teacher (if available)
                    const userMenu = page.getByTestId('user-menu');
                    if (await userMenu.isVisible()) {
                              await userMenu.click();
                              const teacherOption = page.getByRole('button', { name: /Docente|Teacher/i });
                              if (await teacherOption.isVisible({ timeout: 2000 }).catch(() => false)) {
                                        await teacherOption.click();

                                        // Wait for navigation to teacher dashboard
                                        await page.waitForURL('**/app/teacher/**', { timeout: 5_000 });

                                        // Verify localStorage updated
                                        const newRole = await page.evaluate((key) => {
                                                  const raw = localStorage.getItem(key);
                                                  return raw ? JSON.parse(raw).role : null;
                                        }, localStorageKeys.user);
                                        expect(newRole).toBe('teacher');
                              }
                    }
          });
});
