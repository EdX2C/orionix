import { test, expect } from '@playwright/test';
import { loginAs, logout, assertLoggedIn, assertLoggedOut, quickLoginAs } from '../helpers/auth.helper';
import { collectConsoleErrors, assertNoConsoleErrors } from '../helpers/assertions.helper';
import { localStorageKeys } from '../../fixtures/users.fixture';

test.describe('Auth Smoke Tests', () => {
          // S01: Login as student → dashboard visible
          test('S01 — login as student → redirects to student dashboard', async ({ page }) => {
                    await loginAs(page, 'student');
                    await assertLoggedIn(page, 'student');
                    await expect(page.locator('h1')).toBeVisible();
          });

          // S02: Login as teacher → dashboard visible
          test('S02 — login as teacher → redirects to teacher dashboard', async ({ page }) => {
                    await loginAs(page, 'teacher');
                    await assertLoggedIn(page, 'teacher');
                    await expect(page.locator('h1')).toBeVisible();
          });

          // S03: Login as admin → dashboard visible
          test('S03 — login as admin → redirects to admin dashboard', async ({ page }) => {
                    await loginAs(page, 'admin');
                    await assertLoggedIn(page, 'admin');
                    await expect(page.locator('h1')).toBeVisible();
          });

          // S04: Login with wrong email → error toast
          test('S04 — login with invalid credentials → shows error', async ({ page }) => {
                    await page.goto('/auth/login');
                    await page.waitForLoadState('networkidle');

                    await page.getByTestId('login-email').fill('nonexistent@test.com');
                    await page.getByTestId('login-password').fill('wrongpassword');
                    await page.getByTestId('login-submit').click();

                    // Should stay on login page
                    await expect(page).toHaveURL(/\/auth\/login/);

                    // Toast with error message should appear
                    await expect(page.locator('[role="alert"], .toast, [data-testid="toast-container"]').first()).toBeVisible({ timeout: 5000 });
          });

          // S09: Logout → redirect to login, localStorage cleaned
          test('S09 — logout clears session and redirects to login', async ({ page }) => {
                    await loginAs(page, 'student');
                    await logout(page);
                    await assertLoggedOut(page);

                    // Verify localStorage is clean
                    const userKey = await page.evaluate((key) => localStorage.getItem(key), localStorageKeys.user);
                    const sessionKey = await page.evaluate((key) => localStorage.getItem(key), localStorageKeys.sessionId);
                    expect(userKey).toBeNull();
                    expect(sessionKey).toBeNull();
          });
});
