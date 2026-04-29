import { expect, test } from '@playwright/test';

test.describe('public smoke', () => {
	test('root redirects to login', async ({ page }) => {
		await page.goto('/');
		await expect(page).toHaveURL(/\/auth\/login/);
	});

	test('login page shows email and password fields', async ({
		page
	}) => {
		await page.goto('/auth/login');
		await expect(
			page.locator('#email-input input[type="email"]')
		).toBeVisible();
		await expect(page.locator('#password input')).toBeVisible();
		await expect(
			page.locator('form button[type="submit"]')
		).toBeVisible();
	});

	test('unauthenticated user cannot open hospital hub', async ({
		page
	}) => {
		await page.goto('/heka/hospital');
		await expect(page).toHaveURL(/\/auth\/login/);
	});

	test('signup page loads', async ({ page }) => {
		await page.goto('/auth/signup');
		await expect(page.locator('body')).toBeVisible();
	});
});
