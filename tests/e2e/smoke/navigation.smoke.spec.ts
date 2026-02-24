import { test, expect } from '@playwright/test';
import { loginAs } from '../helpers/auth.helper';
import { collectConsoleErrors, assertNoConsoleErrors } from '../helpers/assertions.helper';

test.describe('Navigation Smoke Tests', () => {
          // S08: Sidebar navigation — each link routes correctly
          test('S08 — student sidebar links navigate to correct routes', async ({ page }) => {
                    await loginAs(page, 'student');

                    const studentRoutes = [
                              { label: 'Dashboard', path: '/app/student/dashboard' },
                              { label: 'Cursos', path: '/app/student/courses' },
                              { label: 'Tareas', path: '/app/student/assignments' },
                              { label: 'Progreso', path: '/app/student/progress' },
                              { label: 'Notificaciones', path: '/app/student/notifications' },
                              { label: 'Perfil', path: '/app/student/profile' },
                    ];

                    for (const route of studentRoutes) {
                              const link = page.getByTestId('sidebar-nav').getByRole('link', { name: route.label });
                              await link.click();
                              await page.waitForURL(`**${route.path}`, { timeout: 5_000 });
                              await expect(page).toHaveURL(new RegExp(route.path.replace(/\//g, '\\/')));
                    }
          });

          // S10: Landing page renders all sections
          test('S10 — landing page renders hero, features, and CTA', async ({ page }) => {
                    const errors = collectConsoleErrors(page);
                    await page.goto('/');
                    await page.waitForLoadState('networkidle');

                    // Hero section
                    await expect(page.locator('h1').first()).toBeVisible();

                    // Features section — look for feature cards
                    await expect(page.getByText('Cursos interactivos')).toBeVisible();

                    // CTA buttons — registration link
                    const ctaLinks = page.getByRole('link', { name: /Comenzar|Registr|Empezar/i });
                    await expect(ctaLinks.first()).toBeVisible();

                    // Stats section
                    await expect(page.getByText('500+')).toBeVisible();

                    assertNoConsoleErrors(errors);
          });
});
