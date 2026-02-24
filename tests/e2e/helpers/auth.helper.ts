import { Page, expect } from '@playwright/test';

// Demo credentials from mockUsers in src/data/users.ts
const demoCredentials: Record<string, { email: string; name: string }> = {
          admin: { email: 'admin@orionix.edu', name: 'Carlos Mendoza' },
          teacher: { email: 'elena@orionix.edu', name: 'Dra. Elena Ríos' },
          student: { email: 'ana@estudiante.edu', name: 'Ana Lucía Torres' },
};

/**
 * Login as a specific role using the login form.
 * Waits until the dashboard for that role is visible.
 */
export async function loginAs(page: Page, role: 'admin' | 'teacher' | 'student') {
          const creds = demoCredentials[role];
          await page.goto('/auth/login');
          await page.waitForLoadState('networkidle');

          await page.getByTestId('login-email').fill(creds.email);
          await page.getByTestId('login-password').fill('password123');
          await page.getByTestId('login-submit').click();

          // Wait for redirect to role dashboard
          await page.waitForURL(`**/app/${role}/dashboard`, { timeout: 10_000 });
          await expect(page.locator('body')).toBeVisible();
}

/**
 * Login via the quick demo login buttons on the login page.
 */
export async function quickLoginAs(page: Page, role: 'admin' | 'teacher' | 'student') {
          await page.goto('/auth/login');
          await page.waitForLoadState('networkidle');

          await page.getByTestId(`demo-login-${role}`).click();

          await page.waitForURL(`**/app/${role}/dashboard`, { timeout: 10_000 });
          await expect(page.locator('body')).toBeVisible();
}

/**
 * Logout the current user. Waits for redirect to login page.
 */
export async function logout(page: Page) {
          await page.getByTestId('logout-btn').click();
          await page.waitForURL('**/auth/login', { timeout: 10_000 });
}

/**
 * Assert the user is logged in with a specific role.
 */
export async function assertLoggedIn(page: Page, role: string) {
          await expect(page).toHaveURL(new RegExp(`/app/${role}/`));
          await expect(page.getByTestId('sidebar-nav')).toBeVisible();
}

/**
 * Assert the user is logged out (on login page).
 */
export async function assertLoggedOut(page: Page) {
          await expect(page).toHaveURL(/\/auth\/login/);
}
