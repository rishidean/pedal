import { expect, test } from '@playwright/test';

test('renders the static PEDAL shell without external application requests', async ({ page, baseURL }) => {
  const applicationOrigin = new URL(baseURL ?? 'http://127.0.0.1:4173').origin;
  const externalRequests: string[] = [];

  page.on('request', (request) => {
    const origin = new URL(request.url()).origin;
    if (origin !== applicationOrigin) {
      externalRequests.push(request.url());
    }
  });

  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/');

  await expect(page.getByLabel('PEDAL', { exact: true })).toBeVisible();
  await expect(page.getByRole('main', { name: 'PEDAL rider experience' })).toBeVisible();
  await expect(page.getByRole('heading', { level: 1, name: 'Where are you headed?' })).toBeVisible();
  await expect(page.getByText('Pickup: Current location')).toBeVisible();
  await expect(page.getByText('Union Square')).toBeVisible();
  await expect(page.getByText('Ferry Building')).toBeVisible();
  await expect(page.getByText('Oracle Park')).toBeVisible();
  await expect(page.getByTestId('static-city-map')).toBeVisible();
  await expect(page.getByTestId('demo-controls')).toHaveCount(0);
  await expect(page.getByRole('button')).toHaveCount(3);

  expect(
    await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
  ).toBe(true);

  await page.goto('/?demo=1');
  await expect(page.getByTestId('demo-controls')).toContainText('Demo Controls');
  await expect(page.getByTestId('demo-controls')).toContainText('Teaching only');
  await expect(page.getByTestId('demo-controls')).toContainText('destination_entry');
  await expect(page.getByTestId('demo-controls')).toContainText('No demo action available');

  expect(externalRequests).toEqual([]);
});
