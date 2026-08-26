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

test('test mode is audio-only and records odd-one-out choice', async ({ page }) => {
  test.setTimeout(60_000)
  await page.goto('/')

  await page.getByRole('button', { name: /melody_0002/ }).click()
  await page.getByRole('button', { name: 'Try this item in test mode' }).click()

  await expect(page.getByRole('heading', { name: 'Test item: melody_0002' })).toBeVisible()
  await expect(page.getByRole('note')).toContainText(/Visual MIDI is hidden/)

  const alternatives = page.getByRole('group', { name: 'Trial alternatives' })
  await expect(alternatives.getByText('Option 1', { exact: true })).toBeVisible()
  await expect(alternatives.getByText('Option 2', { exact: true })).toBeVisible()
  await expect(alternatives.getByText('Option 3', { exact: true })).toBeVisible()

  // No WaveRoll chrome in test mode (copy may mention "piano roll" as hidden).
  await expect(page.locator('wave-roll')).toHaveCount(0)
  await expect(page.getByRole('region', { name: /Piano roll/i })).toHaveCount(0)

  await alternatives.getByRole('button', { name: 'Play option 2' }).click()
  await expect(alternatives.getByRole('button', { name: 'Stop option 2' })).toBeVisible()

  await alternatives.getByRole('button', { name: 'Pick option 3' }).click()
  await expect(
    alternatives.getByRole('button', { name: 'Odd one out: option 3' }),
  ).toHaveAttribute('aria-pressed', 'true')

  await page.getByRole('button', { name: 'Submit choice' }).click()
  await expect(page.getByRole('status')).toContainText(/Recorded option 3/)

  await page.getByRole('button', { name: 'Back to explore' }).click()
  await expect(page.getByRole('button', { name: 'Try this item in test mode' })).toBeVisible()
  // Explore mode may show WaveRoll again.
})
