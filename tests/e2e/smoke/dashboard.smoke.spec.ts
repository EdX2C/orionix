import { test, expect } from '@playwright/test';
import { loginAs } from '../helpers/auth.helper';
import { collectConsoleErrors, assertNoConsoleErrors } from '../helpers/assertions.helper';

test.describe('Dashboard Smoke Tests', () => {
          // S05: Student dashboard renders stats + no console errors
          test('S05 — student dashboard renders stats with no console errors', async ({ page }) => {
                    const errors = collectConsoleErrors(page);
                    await loginAs(page, 'student');

                    // Wait for dashboard content to load (skeleton should disappear)
                    await expect(page.locator('h1')).toBeVisible();

                    // Verify stats cards are rendered
                    await expect(page.getByTestId('dashboard-stats')).toBeVisible({ timeout: 10_000 });

                    // Verify no console errors
                    assertNoConsoleErrors(errors);
          });

          // S06: Teacher dashboard renders stats
          test('S06 — teacher dashboard renders stats cards', async ({ page }) => {
                    const errors = collectConsoleErrors(page);
                    await loginAs(page, 'teacher');

                    await expect(page.locator('h1')).toBeVisible();
                    await expect(page.getByTestId('dashboard-stats')).toBeVisible({ timeout: 10_000 });

                    assertNoConsoleErrors(errors);
          });

          // S07: Admin dashboard renders platform stats
          test('S07 — admin dashboard renders platform stats', async ({ page }) => {
                    const errors = collectConsoleErrors(page);
                    await loginAs(page, 'admin');

                    await expect(page.locator('h1')).toBeVisible();
                    await expect(page.getByTestId('dashboard-stats')).toBeVisible({ timeout: 10_000 });

                    assertNoConsoleErrors(errors);
          });
});
