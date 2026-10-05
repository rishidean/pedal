import { expect, test } from '@playwright/test';

test('completes the canonical S2 request through deterministic driver assignment', async ({ page, baseURL }, testInfo) => {
  const applicationOrigin = new URL(baseURL ?? 'http://127.0.0.1:4173').origin;
  const externalRequests: string[] = [];

  page.on('request', (request) => {
    if (new URL(request.url()).origin !== applicationOrigin) {
      externalRequests.push(request.url());
    }
  });

  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/');
  await page.evaluate(() => window.localStorage.clear());
  await page.reload();

  const ferryBuilding = page.getByRole('button', { name: 'Ferry Building' });
  await ferryBuilding.focus();
  await ferryBuilding.press('Enter');

  await expect(page.getByRole('heading', { level: 1, name: 'Your PEDAL' })).toBeVisible();
  await expect(page.getByText('Current location → Ferry Building')).toBeVisible();
  await expect(page.getByText('Pickup in 4 min')).toBeVisible();
  await expect(page.getByText('Estimated fare $18')).toBeVisible();
  await page.screenshot({ path: testInfo.outputPath('ride-review.png'), fullPage: true });

  const requestPedal = page.getByRole('button', { name: 'Request PEDAL' });
  await requestPedal.focus();
  await requestPedal.press('Enter');

  await expect(page.getByRole('heading', { level: 1, name: 'Finding a nearby pedicab' })).toBeVisible();
  await expect(page.getByRole('status')).toContainText('Finding a nearby pedicab');
  await expect(page.getByLabel('Trip summary')).toContainText('Current location');
  await expect(page.getByLabel('Trip summary')).toContainText('Ferry Building');
  await expect(page.getByLabel('Trip summary')).toContainText('4 min');
  await expect(page.getByLabel('Trip summary')).toContainText('$18');
  await page.screenshot({ path: testInfo.outputPath('matching.png'), fullPage: true });

  await expect(page.getByRole('heading', { level: 1, name: 'Maya is on the way' })).toBeVisible();
  await expect(page.getByText('Driver assigned')).toBeVisible();
  await expect(page.getByText('Maya Chen')).toBeVisible();
  await expect(page.getByText('PEDAL 14')).toBeVisible();
  await expect(page.getByText('3 min away')).toBeVisible();
  await expect(page.getByText('Current location → Ferry Building')).toBeVisible();
  await page.screenshot({ path: testInfo.outputPath('driver-assigned.png'), fullPage: true });

  await page.reload();
  await expect(page.getByRole('heading', { level: 1, name: 'Maya is on the way' })).toBeVisible();
  await expect(page.getByText('Maya Chen')).toBeVisible();
  await expect(page.getByTestId('demo-controls')).toHaveCount(0);
  await expect(page.getByRole('button')).toHaveCount(0);

  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  expect(externalRequests).toEqual([]);
});
