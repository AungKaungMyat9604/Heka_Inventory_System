import { defineConfig, devices } from '@playwright/test';

const host = process.env.E2E_HOST ?? '127.0.0.1';
const port = Number(process.env.E2E_PORT ?? 4173);
const baseURL = process.env.E2E_BASE_URL ?? `http://${host}:${port}`;

export default defineConfig({
	testDir: 'e2e',
	use: {
		baseURL,
		trace: 'on-first-retry'
	},
	projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
	webServer: {
		command:
			'pnpm run build && pnpm run preview -- --host 127.0.0.1 --port 4173 --strictPort',
		url: baseURL,
		reuseExistingServer: !process.env.CI,
		timeout: 180_000
	}
});
