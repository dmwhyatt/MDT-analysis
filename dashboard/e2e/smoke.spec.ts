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

test('construct filter clears and switches without sticking', async ({ page }) => {
  await page.goto('/')

  const meta = page.locator('.meta')
  await expect(meta).toContainText(/Showing 3 of 5/)

  const input = page.locator('.ts-control input')

  async function pickConstruct(name: string) {
    await input.click()
    await input.fill(name)
    await page.locator('.ts-dropdown .option', { hasText: new RegExp(`^${name}$`) }).click()
  }

  await pickConstruct('Rhythm')
  await expect(meta).toContainText(/Showing 1 of 5/)
  await expect(page.getByRole('columnheader', { name: 'Note density' })).toBeVisible()

  await page.locator('.ts-control .remove').click()
  await expect(meta).toContainText(/Showing 3 of 5/)
  await expect(page.getByRole('columnheader', { name: 'Pitch range' })).toBeVisible()

  await pickConstruct('Pitch')
  await expect(meta).toContainText(/Showing 1 of 5/)
  await expect(page.getByRole('columnheader', { name: 'Pitch range' })).toBeVisible()
  await expect(page.getByRole('columnheader', { name: 'Note density' })).toHaveCount(0)
})
