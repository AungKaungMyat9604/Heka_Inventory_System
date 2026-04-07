-- Item Master / item_batch: free-text manufacturer; drop manufacturer master table.

ALTER TABLE "item_master" ADD COLUMN IF NOT EXISTS "manufacturer_name" varchar(512);
--> statement-breakpoint
ALTER TABLE "item_batch" ADD COLUMN IF NOT EXISTS "manufacturer_name" varchar(512);
--> statement-breakpoint
UPDATE "item_master" AS im
SET "manufacturer_name" = m."name"
FROM "manufacturer" AS m
WHERE im."manufacturer_id" IS NOT NULL AND im."manufacturer_id" = m."id";
--> statement-breakpoint
UPDATE "item_batch" AS ib
SET "manufacturer_name" = m."name"
FROM "manufacturer" AS m
WHERE ib."manufacturer_id" IS NOT NULL AND ib."manufacturer_id" = m."id";
--> statement-breakpoint
DROP INDEX IF EXISTS "item_batch_identity_uidx";
--> statement-breakpoint
ALTER TABLE "item_batch" DROP CONSTRAINT IF EXISTS "item_batch_manufacturer_id_manufacturer_id_fk";
--> statement-breakpoint
ALTER TABLE "item_batch" DROP COLUMN IF EXISTS "manufacturer_id";
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "item_batch_identity_uidx" ON "item_batch" (
	"hospital_id",
	"item_id",
	"batch_no",
	"expiry_date",
	"supplier_id",
	"manufacturer_name",
	"purchase_price"
) NULLS NOT DISTINCT;
--> statement-breakpoint
ALTER TABLE "item_master" DROP CONSTRAINT IF EXISTS "item_master_manufacturer_id_manufacturer_id_fk";
--> statement-breakpoint
DROP INDEX IF EXISTS "item_master_manufacturer_id_idx";
--> statement-breakpoint
ALTER TABLE "item_master" DROP COLUMN IF EXISTS "manufacturer_id";
--> statement-breakpoint
DELETE FROM "user_group_page"
WHERE "page_id" IN (
	SELECT "id" FROM "page" WHERE "page_url" = '/heka/home/inventory-setup/manufacture-setup'
);
--> statement-breakpoint
DELETE FROM "page" WHERE "page_url" = '/heka/home/inventory-setup/manufacture-setup';
--> statement-breakpoint
DROP TABLE IF EXISTS "manufacturer";
