import { Page, Route } from '@playwright/test';

/**
 * Mock a network endpoint to return a specific HTTP error status.
 * Useful for testing error handling and retry patterns.
 *
 * @param page - Playwright page
 * @param urlPattern - URL glob pattern to intercept
 * @param status - HTTP status code to return (e.g. 500)
 * @param body - Optional response body
 */
export async function mockNetworkError(
          page: Page,
          urlPattern: string,
          status: number,
          body: string = JSON.stringify({ error: 'Simulated error' })
) {
          await page.route(urlPattern, (route: Route) => {
                    route.fulfill({
                              status,
                              contentType: 'application/json',
                              body,
                    });
          });
}

/**
 * Simulate offline mode by aborting all network requests.
 */
export async function mockOffline(page: Page) {
          await page.route('**/*', (route: Route) => {
                    route.abort('internetdisconnected');
          });
}

/**
 * Simulate slow network by adding latency to responses.
 *
 * @param page - Playwright page
 * @param urlPattern - URL glob to intercept
 * @param delayMs - Delay in milliseconds before response
 */
export async function mockSlowNetwork(
          page: Page,
          urlPattern: string,
          delayMs: number
) {
          await page.route(urlPattern, async (route: Route) => {
                    await new Promise((resolve) => setTimeout(resolve, delayMs));
                    await route.continue();
          });
}
