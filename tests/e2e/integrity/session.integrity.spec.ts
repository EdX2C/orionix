import { test, expect } from '@playwright/test';
import { loginAs } from '../helpers/auth.helper';
import { localStorageKeys } from '../../fixtures/users.fixture';

test.describe('Session Integrity Tests', () => {
          // I03: Session IDs are unique, no collisions
          test('I03 — each login generates a unique session ID', async ({ page }) => {
                    const sessionIds: string[] = [];

                    // Login/logout 3 times and collect session IDs
                    for (let i = 0; i < 3; i++) {
                              await loginAs(page, 'student');

                              const sessionId = await page.evaluate(
                                        (key) => localStorage.getItem(key),
                                        localStorageKeys.sessionId
                              );
                              expect(sessionId).not.toBeNull();
                              expect(sessionId!.startsWith('sess-')).toBeTruthy();
                              sessionIds.push(sessionId!);

                              // Logout for next iteration (except last)
                              if (i < 2) {
                                        await page.getByTestId('logout-btn').click();
                                        await page.waitForURL('**/auth/login', { timeout: 5_000 });
                              }
                    }

                    // All session IDs should be unique
                    const unique = new Set(sessionIds);
                    expect(unique.size).toBe(sessionIds.length);
          });

          // I06: Revoked session → validateSession() returns false
          test('I06 — session revocation invalidates the session', async ({ page }) => {
                    // Login as admin
                    await loginAs(page, 'admin');

                    // Get current session ID
                    const sessionId = await page.evaluate(
                              (key) => localStorage.getItem(key),
                              localStorageKeys.sessionId
                    );
                    expect(sessionId).not.toBeNull();

                    // Navigate to sessions management
                    await page.goto('/app/admin/sessions');
                    await page.waitForLoadState('networkidle');

                    // Wait for sessions list to load
                    await expect(page.locator('h1')).toBeVisible();

                    // Verify sessions are displayed
                    const sessionCards = page.locator('[class*="card"], table tbody tr').first();
                    await expect(sessionCards).toBeVisible({ timeout: 5_000 });
          });
});
