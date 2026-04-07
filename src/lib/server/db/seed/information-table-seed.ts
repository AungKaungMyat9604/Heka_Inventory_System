import { sql } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { seedLogger } from '$lib/logger';

if (!process.env.DATABASE_URL) {
	throw new Error('DATABASE_URL is not set');
}

const client = neon(process.env.DATABASE_URL);
const db = drizzle(client);

/** Fixed UUID for seed staff so we can reference it in staff_hospital, staff_department, etc. */
// const SEED_STAFF_ID = '01900000-0000-7000-8000-000000000001';

/**
 * Seed information/business tables with sample data.
 *
 * Run after master-table-seed. Inserts in FK-safe order.
 *
 * Also applies inventory approval DDL (module CHECK + active unique on
 * `inv_approval_level`) so environments that use `pnpm db:seed` without a full
 * `db:migrate` run still match drizzle 0039–0041 for approval config.
 *
 * Roles come from `auth-table-seed.ts` only — do not duplicate `role` inserts here.
 *
 * npx tsx src/lib/server/db/seed/information-table-seed.ts
 */
export async function seedInformationTables() {
	seedLogger.info('Seeding information tables...');

	// 1. Modules (depends: status) — inventory-focused app: Administration, Inventory Setup, Inventory only
	await db.execute(sql`
		INSERT INTO module (id, name, sequence_no, status_id, module_url, image_url)
		VALUES 
			(1, 'Administration', 1, 1, '/heka/home/administration', '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-user-star-icon lucide-user-star"><path d="M16.051 12.616a1 1 0 0 1 1.909.024l.737 1.452a1 1 0 0 0 .737.535l1.634.256a1 1 0 0 1 .588 1.806l-1.172 1.168a1 1 0 0 0-.282.866l.259 1.613a1 1 0 0 1-1.541 1.134l-1.465-.75a1 1 0 0 0-.912 0l-1.465.75a1 1 0 0 1-1.539-1.133l.258-1.613a1 1 0 0 0-.282-.866l-1.156-1.153a1 1 0 0 1 .572-1.822l1.633-.256a1 1 0 0 0 .737-.535z"/><path d="M8 15H7a4 4 0 0 0-4 4v2"/><circle cx="10" cy="7" r="4"/></svg>'),
			(9, 'Inventory Setup', 2, 1, '/heka/home/inventory-setup', '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-box-icon lucide-box"><rect x="2" y="2" width="20" height="20" rx="2" ry="2"/><path d="M2 6h20v12H2z"/><path d="M16 10V6a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v4"/></svg>'),
			(10, 'Inventory', 3, 1, '/heka/home/inventory', '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-package"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>')
		ON CONFLICT (id) DO NOTHING;
	`);
	seedLogger.info('Seeded: module');

	// 2. Hospital (depends: status). id is UUID.
	// await db.execute(sql`
	// 	INSERT INTO hospital (id, name, code, city_id, state_id, country_id, status_id)
	// 	VALUES
	// 		('01900000-0000-7000-8000-000000000001'::uuid, 'Pun Hlaing Hospitals', 'phh', 1, 1, 118, 1)
	// 	ON CONFLICT (id) DO NOTHING;
	// `);
	// seedLogger.info('Seeded: hospital');

	// 2b. Financial year (per hospital) and prefix configuration seeds can be added here later per environment.

	// 3. Page (depends: module, status) — administration + inventory only
	await db.execute(sql`
		INSERT INTO page (id, name, module_id, status_id, parent_id, page_url, sequence_no)
		VALUES
			-- Administration
			(1, 'Staff', 1, 1, null, '/heka/home/administration/staff', 1),
			(100001, 'Staff Registration', 1, 1, 1, '/heka/home/administration/staff/registration', 1),
			(100002, 'Staff List', 1, 1, 1, '/heka/home/administration/staff/list', 2),
			(6, 'User Group', 1, 1, null, '/heka/home/administration/user-group', 3),
			(7, 'Branches', 1, 1, null, '/heka/home/administration/branches', 4),
			(17, 'Financial Year', 1, 1, null, '/heka/home/administration/financial-year', 5),
			(16, 'Prefix Configuration', 1, 1, null, '/heka/home/administration/prefix-configuration', 6),
			(18, 'Departments', 1, 1, null, '/heka/home/administration/departments', 7),

			-- Inventory Setup
			(19, 'Stores', 9, 1, null, '/heka/home/inventory-setup/stores', 1),
			(20, 'Item Master', 9, 1, null, '/heka/home/inventory-setup/item-master', 2),
			(21, 'Pharmacy Generic', 9, 1, null, '/heka/home/inventory-setup/pharmacy-generic', 3),
			(22, 'Unit Master', 9, 1, null, '/heka/home/inventory-setup/unit-master', 4),
			(23, 'Item Unit Master', 9, 1, null, '/heka/home/inventory-setup/item-unit-master', 5),
			(25, 'Supplier Setup', 9, 1, null, '/heka/home/inventory-setup/supplier-setup', 7),
			(26, 'Approval Config', 9, 1, null, '/heka/home/inventory-setup/approval-config', 8),
			(32, 'Reorder level', 9, 1, null, '/heka/home/inventory-setup/reorder-level', 9),
			(33, 'Stock alerts', 9, 1, null, '/heka/home/inventory-setup/stock-alerts', 10),
			(330001, 'Policy', 9, 1, 33, '/heka/home/inventory-setup/stock-alerts/policy', 1),
			(330002, 'Recipients', 9, 1, 33, '/heka/home/inventory-setup/stock-alerts/recipients', 2),

			-- Inventory
			(27, 'Purchase Requisition', 10, 1, null, '/heka/home/inventory/purchase-requisition', 1),
			(28, 'Purchase Order', 10, 1, null, '/heka/home/inventory/purchase-order', 2),
			(29, 'Goods Receipt', 10, 1, null, '/heka/home/inventory/grn', 3),
			(30, 'Stock', 10, 1, null, '/heka/home/inventory/stock', 4),
			(37, 'Department indent', 10, 1, null, '/heka/home/inventory/department-indent', 5),
			(38, 'Department issue', 10, 1, null, '/heka/home/inventory/department-issue', 6),
			(39, 'Receipt from store', 10, 1, null, '/heka/home/inventory/receipt-from-store', 7),
			(40, 'Department consumption', 10, 1, null, '/heka/home/inventory/department-consumption', 8),
			(41, 'Reports', 10, 1, null, '/heka/home/inventory/reports', 9),
			(410001, 'Low stock report', 10, 1, 41, '/heka/home/inventory/reports/low-stock', 1),
			(410002, 'Expired/expiring report', 10, 1, 41, '/heka/home/inventory/reports/expired', 2),
			(410003, 'Movement log', 10, 1, 41, '/heka/home/inventory/reports/movement', 3)

		ON CONFLICT (id) DO NOTHING;
		`);
	seedLogger.info('Seeded: page');

	// Status tagging types — inventory workflows only (ids 3–10 unchanged for enums/migrations)
	await db.execute(sql`
		INSERT INTO status_tagging_type (id, name)
		VALUES
			(3, 'Purchase Requisition'),
			(4, 'Purchase Order'),
			(5, 'Goods Receipt'),
			(6, 'Store Transfer'),
			(7, 'Stock Issue'),
			(8, 'Department indent'),
			(9, 'Department issue'),
			(10, 'Department consumption')
		ON CONFLICT (id) DO NOTHING;
		`);
	seedLogger.info('Seeded: status tagging type');

	// status_tagging — inventory states only (stable ids match db-link Inv*StatusTaggingEnum)
	await db.execute(sql`
		INSERT INTO status_tagging (id, name, code, sequence_no, status_tagging_type_id)
		VALUES 
			-- Purchase Requisition (ids 9–13; StatusTaggingTypeEnum.INV_PURCHASE_REQUISITION)
			(9, 'Draft', 'draft', 1, 3),
			(10, 'Pending', 'pending', 2, 3),
			(11, 'Approved', 'approved', 3, 3),
			(12, 'Rejected', 'rejected', 4, 3),
			(13, 'Sent Back', 'sent_back', 5, 3),
			(31, 'Cancelled', 'cancelled', 6, 3),

			-- Purchase Order (14–21)
			(14, 'Draft', 'draft', 1, 4),
			(15, 'Pending', 'pending', 2, 4),
			(16, 'Approved', 'approved', 3, 4),
			(17, 'Rejected', 'rejected', 4, 4),
			(18, 'Sent Back', 'sent_back', 5, 4),
			(19, 'Sent To Supplier', 'sent_to_supplier', 6, 4),
			(20, 'Partially Received', 'partially_received', 7, 4),
			(21, 'Closed', 'closed', 8, 4),

			-- Goods Receipt (22–24)
			(22, 'Draft', 'draft', 1, 5),
			(23, 'Posted', 'posted', 2, 5),
			(24, 'Cancelled', 'cancelled', 3, 5),

			-- Store Transfer (25–27)
			(25, 'Draft', 'draft', 1, 6),
			(26, 'Posted', 'posted', 2, 6),
			(27, 'Cancelled', 'cancelled', 3, 6),

			-- Stock Issue (28–30)
			(28, 'Draft', 'draft', 1, 7),
			(29, 'Posted', 'posted', 2, 7),
			(30, 'Cancelled', 'cancelled', 3, 7),

			-- Department indent (40–45; type 8 — mirrors drizzle/0039_*_dept_indent.sql; InvDepartmentIndentStatusTaggingEnum)
			(40, 'Draft', 'draft', 1, 8),
			(41, 'Pending', 'pending', 2, 8),
			(42, 'Pending central', 'pending_central', 3, 8),
			(43, 'Issued', 'issued', 4, 8),
			(44, 'Received', 'received', 5, 8),
			(45, 'Cancelled', 'cancelled', 6, 8),

			-- Department issue (46–49; type 9 — drizzle/0048_department_issue_tables_and_status.sql; InvDepartmentIssueStatusTaggingEnum)
			(46, 'Pending', 'pending', 1, 9),
			(47, 'Issued', 'issued', 2, 9),
			(48, 'Received', 'received', 3, 9),
			(49, 'Cancelled', 'cancelled', 4, 9),

			-- Department consumption (50–53; type 10 — drizzle/0050_inv_department_consumption.sql)
			(50, 'Draft', 'draft', 1, 10),
			(51, 'Pending', 'pending', 2, 10),
			(52, 'Posted', 'posted', 3, 10),
			(53, 'Cancelled', 'cancelled', 4, 10)

		ON CONFLICT (id) DO NOTHING;
		`);
	seedLogger.info('Seeded: status tagging');

	// 7b. `inv_approval_level` / `inv_approval_log`: module CHECK + partial unique index
	// (mirrors `drizzle/manual_inv_approval_module_check.sql` and 0041; no-op on already-migrated DBs)
	await db.execute(
		sql`ALTER TABLE "inv_approval_level" DROP CONSTRAINT IF EXISTS "inv_approval_level_module_chk"`
	);
	await db.execute(sql`
		ALTER TABLE "inv_approval_level" ADD CONSTRAINT "inv_approval_level_module_chk" CHECK ("module" IN ('PR', 'PO', 'DI', 'DISS', 'RFS', 'GRN', 'DC'))
		`);
	await db.execute(
		sql`ALTER TABLE "inv_approval_log" DROP CONSTRAINT IF EXISTS "inv_approval_log_module_chk"`
	);
	await db.execute(sql`
		ALTER TABLE "inv_approval_log" ADD CONSTRAINT "inv_approval_log_module_chk" CHECK ("module" IN ('PR', 'PO', 'DI', 'DISS', 'RFS', 'GRN', 'DC'))
		`);
	await db.execute(
		sql`DROP INDEX IF EXISTS "inv_approval_level_store_module_level_uidx"`
	);
	await db.execute(
		sql`DROP INDEX IF EXISTS "inv_approval_level_store_module_level_active_uidx"`
	);
	await db.execute(sql`
		CREATE UNIQUE INDEX "inv_approval_level_store_module_level_active_uidx"
		ON "inv_approval_level" ("hospital_id", "store_id", "module", "level")
		WHERE "deleted_at" IS NULL
	`);
	seedLogger.info(
		'Seeded: inv_approval_level schema (module CHECK + active unique index)'
	);
}

seedInformationTables()
	.then(() => {
		seedLogger.info('Information table seeding finished');
		process.exit(0);
	})
	.catch((error) => {
		seedLogger.error(
			'Error while seeding information tables',
			error instanceof Error ? error : new Error(String(error))
		);
		process.exit(1);
	});
