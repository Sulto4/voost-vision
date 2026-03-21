import { test, expect } from '@playwright/test'

test.use({ baseURL: 'http://127.0.0.1:4173' })

test('home renders live projects, testimonials, blog cards, and local thumbnails', async ({ page }) => {
  await page.goto('/')
  await page.waitForLoadState('networkidle')

  await expect(page.getByText('Voost Voice')).toBeVisible()
  await expect(page.getByText('Voost Level CRM')).toBeVisible()
  await expect(page.getByText('Adrian')).toBeVisible()
  await expect(page.getByText('Cum să lansezi', { exact: false }).first()).toBeVisible()
  await expect(page.locator('img[src="/thumbnails/thumb-voost-level-crm.svg"]').first()).toBeVisible()
})

test('portfolio page exposes ecommerce filter and project thumbnails', async ({ page }) => {
  await page.goto('/portofoliu')
  await page.waitForLoadState('networkidle')

  await expect(page.getByText('Voost Level CRM')).toBeVisible()
  await expect(page.getByRole('button', { name: 'eCommerce' })).toBeVisible()

  await page.getByRole('button', { name: 'eCommerce' }).click()
  await expect(page.getByText('vreaumagnet.ro')).toBeVisible()
  await expect(page.locator('img[src="/thumbnails/thumb-vreaumagnet.svg"]').first()).toBeVisible()
})

test('blog page loads published articles from the repaired dataset', async ({ page }) => {
  await page.goto('/blog')
  await page.waitForLoadState('networkidle')

  await expect(page.getByPlaceholder('Caută articole...')).toBeVisible()
  await expect(page.getByText('Cum să lansezi', { exact: false }).first()).toBeVisible()
  await expect(page.getByText('AI Agents', { exact: false }).first()).toBeVisible()
})
