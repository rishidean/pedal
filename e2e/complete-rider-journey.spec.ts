import { expect, test } from '@playwright/test';

test('completes the canonical rider journey through lifecycle and reset', async ({ page, baseURL }, testInfo) => {
  const applicationOrigin = new URL(baseURL ?? 'http://127.0.0.1:4173').origin;
  const externalRequests: string[] = [];

  page.on('request', (request) => {
    if (new URL(request.url()).origin !== applicationOrigin) {
      externalRequests.push(request.url());
    }
  });

  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/?demo=1');
  await page.evaluate(() => window.localStorage.clear());
  await page.reload();

  const ferryBuilding = page.getByRole('button', { name: 'Ferry Building' });
  await ferryBuilding.focus();
  await ferryBuilding.press('Enter');
  await expect(page.getByRole('heading', { level: 1, name: 'Your PEDAL' })).toBeVisible();
  await expect(page.getByText('Pickup in 4 min')).toBeVisible();
  await expect(page.getByText('Estimated fare $18')).toBeVisible();

  const requestPedal = page.getByRole('button', { name: 'Request PEDAL' });
  await requestPedal.focus();
  await requestPedal.press('Enter');
  await expect(page.getByRole('heading', { level: 1, name: 'Finding a nearby pedicab' })).toBeVisible();
  await expect(page.getByRole('status')).toContainText('Finding a nearby pedicab');

  await expect(page.getByRole('heading', { level: 1, name: 'Maya is on the way' })).toBeVisible();
  await expect(page.getByText('Maya Chen')).toBeVisible();
  await expect(page.getByText('PEDAL 14')).toBeVisible();
  await expect(page.getByText('3 min away')).toBeVisible();
  await page.reload();
  await expect(page.getByRole('heading', { level: 1, name: 'Maya is on the way' })).toBeVisible();

  const arrival = page.getByRole('button', { name: 'Simulate driver arrival' });
  await arrival.focus();
  await arrival.press('Enter');
  await expect(page.getByRole('heading', { level: 1, name: 'Your pedicab is here' })).toBeVisible();
  await expect(page.getByText('Meet Maya at Current location', { exact: true })).toBeVisible();
  await expect(page.getByRole('status')).toContainText('Driver arrived');
  await page.screenshot({ path: testInfo.outputPath('driver-arrived.png'), fullPage: true });
  await page.reload();
  await expect(page.getByRole('heading', { level: 1, name: 'Your pedicab is here' })).toBeVisible();

  const startRide = page.getByRole('button', { name: 'Start simulated ride' });
  await startRide.focus();
  await startRide.press('Enter');
  await expect(page.getByRole('heading', { level: 1, name: 'Heading to Ferry Building' })).toBeVisible();
  await expect(page.getByText('Estimated fare $18', { exact: true })).toBeVisible();
  await expect(page.getByRole('status')).toContainText('Ride in progress');
  await page.screenshot({ path: testInfo.outputPath('ride-in-progress.png'), fullPage: true });
  await page.reload();
  await expect(page.getByRole('heading', { level: 1, name: 'Heading to Ferry Building' })).toBeVisible();

  const completeRide = page.getByRole('button', { name: 'Complete simulated ride' });
  await completeRide.focus();
  await completeRide.press('Enter');
  await expect(page.getByRole('heading', { level: 1, name: 'You’ve arrived' })).toBeVisible();
  await expect(page.getByText('Ferry Building', { exact: true })).toBeVisible();
  await expect(page.getByText('$18', { exact: true })).toBeVisible();
  await expect(page.getByText('Pay the driver directly')).toBeVisible();
  await expect(page.getByRole('status')).toContainText('Ride complete');
  await page.screenshot({ path: testInfo.outputPath('ride-complete.png'), fullPage: true });
  await page.reload();
  await expect(page.getByRole('heading', { level: 1, name: 'You’ve arrived' })).toBeVisible();

  const reset = page.getByRole('button', { name: 'Start another ride' });
  await reset.focus();
  await reset.press('Enter');
  await expect(page.getByRole('heading', { level: 1, name: 'Where are you headed?' })).toBeVisible();
  await expect(page.getByText('No demo action available')).toBeVisible();
  await expect(page.getByText('Maya Chen')).toHaveCount(0);
  await page.screenshot({ path: testInfo.outputPath('final-reset.png'), fullPage: true });
  await page.reload();
  await expect(page.getByRole('heading', { level: 1, name: 'Where are you headed?' })).toBeVisible();

  await page.goto('/');
  await expect(page.getByTestId('demo-controls')).toHaveCount(0);
  await expect(page.getByRole('button', { name: /simulate driver arrival|start simulated ride|complete simulated ride/i })).toHaveCount(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  expect(externalRequests).toEqual([]);
});
