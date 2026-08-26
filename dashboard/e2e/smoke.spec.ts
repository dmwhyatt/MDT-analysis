import { expect, test } from '@playwright/test'

test('loads fixture table and selects a melody', async ({ page }) => {
  await page.goto('/')

  await expect(page.getByRole('heading', { name: 'MDT analysis dashboard' })).toBeVisible()
  await expect(page.getByRole('button', { name: /melody_0001/ })).toBeVisible()

  // Significant-only is on by default: mean pitch (p=0.12) should be hidden.
  await expect(page.getByRole('columnheader', { name: 'Mean pitch' })).toHaveCount(0)
  await expect(page.getByRole('columnheader', { name: 'Pitch range' })).toBeVisible()

  await page.getByLabel(/Significant only/).uncheck()
  await expect(page.getByRole('columnheader', { name: 'Mean pitch' })).toBeVisible()

  await page.getByRole('button', { name: /melody_0003/ }).click()
  await expect(page.getByRole('heading', { level: 2, name: 'melody_0003' })).toBeVisible()
})
