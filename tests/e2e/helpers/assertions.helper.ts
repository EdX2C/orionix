import { Page } from '@playwright/test';

/**
 * Collects console errors during a test.
 * Call at the START of a test, then check at the END.
 *
 * Usage:
 *   const errors = collectConsoleErrors(page);
 *   // ...do stuff...
 *   assertNoConsoleErrors(errors);
 */
export function collectConsoleErrors(page: Page): string[] {
          const errors: string[] = [];
          page.on('console', (msg) => {
                    if (msg.type() === 'error') {
                              errors.push(msg.text());
                    }
          });
          return errors;
}

/**
 * Assert that no console errors were collected.
 * Filters out known benign errors (e.g. favicon 404).
 */
export function assertNoConsoleErrors(errors: string[]) {
          const significant = errors.filter(
                    (e) =>
                              !e.includes('favicon') &&
                              !e.includes('Failed to load resource') &&
                              !e.includes('net::ERR_')
          );
          if (significant.length > 0) {
                    throw new Error(
                              `Console errors detected:\n${significant.map((e) => `  • ${e}`).join('\n')}`
                    );
          }
}

/**
 * Collects network responses with status >= 500.
 * Call at the START of a test, then check at the END.
 */
export function collectNetwork500s(page: Page): { url: string; status: number }[] {
          const errors: { url: string; status: number }[] = [];
          page.on('response', (res) => {
                    if (res.status() >= 500) {
                              errors.push({ url: res.url(), status: res.status() });
                    }
          });
          return errors;
}

/**
 * Assert that no 5xx network errors were collected.
 */
export function assertNetworkNo500(errors: { url: string; status: number }[]) {
          if (errors.length > 0) {
                    throw new Error(
                              `Network 5xx errors detected:\n${errors.map((e) => `  • ${e.status} ${e.url}`).join('\n')}`
                    );
          }
}
