import { defineConfig } from 'drizzle-kit';

/** Neon: pooled URLs often break drizzle-kit push; use direct URL here (see .env.example). */
const drizzleKitUrl =
	process.env.DATABASE_URL_MIGRATE ?? process.env.DATABASE_URL;
if (!drizzleKitUrl) throw new Error('DATABASE_URL (or DATABASE_URL_MIGRATE) is not set');

export default defineConfig({
	schema: [
		'./src/lib/server/db/table/auth-table/auth-table.ts',
		'./src/lib/server/db/table/master-table/master-table.ts',
		'./src/lib/server/db/table/information-table/information-table.ts',
		'./src/lib/server/db/table/information-table/inventory-transaction-table.ts',
		'./src/lib/server/db/table/notification-table/notification-table.ts'
	],
	dialect: 'postgresql',
	dbCredentials: { url: drizzleKitUrl },
	verbose: true,
	strict: true
});
