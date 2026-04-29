import { expect, test } from '@playwright/test';

const email = process.env.E2E_LOGIN_EMAIL?.trim();
const password = process.env.E2E_LOGIN_PASSWORD;
const hasCredentials = Boolean(email && password);

test.describe('authenticated flows', () => {
	test('login reaches hospital area', async ({ page }) => {
		test.skip(
			!hasCredentials,
			'Set E2E_LOGIN_EMAIL and E2E_LOGIN_PASSWORD to run signed-in tests'
		);
		await page.goto('/auth/login');
		await page
			.locator('#email-input input[type="email"]')
			.fill(email!);
		await page.locator('#password input').fill(password!);
		await page.locator('form button[type="submit"]').click();
		await page.waitForURL(/\/heka\/hospital/, { timeout: 30_000 });
		expect(page.url()).toMatch(/\/heka\/hospital/);
	});

	test('after login, inventory entry redirects to purchase requisition', async ({
		page
	}) => {
		test.skip(
			!hasCredentials,
			'Set E2E_LOGIN_EMAIL and E2E_LOGIN_PASSWORD to run signed-in tests'
		);
		await page.goto('/auth/login');
		await page
			.locator('#email-input input[type="email"]')
			.fill(email!);
		await page.locator('#password input').fill(password!);
		await page.locator('form button[type="submit"]').click();
		await page.waitForURL(/\/heka\/hospital/, { timeout: 30_000 });

		const hid = page.url().match(/\/heka\/hospital\/([^/?#]+)/)?.[1];
		test.skip(
			!hid,
			'User landed on /heka/hospital without a hospital id in the URL; use a staff account or pick a hospital manually for this test'
		);

		await page.goto(`/heka/hospital/${hid}/home/inventory`);
		await expect(page).toHaveURL(/purchase-requisition/, {
			timeout: 15_000
		});
	});
});
