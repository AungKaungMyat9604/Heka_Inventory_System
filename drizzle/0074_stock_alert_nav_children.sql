-- Stock alerts: Policy + Recipients as child pages (inventory-setup tab strip).

INSERT INTO "page" ("id", "name", "module_id", "status_id", "parent_id", "page_url", "sequence_no", "created_at", "updated_at")
VALUES
	(330001, 'Policy', 9, 1, 33, '/heka/home/inventory-setup/stock-alerts/policy', 1, now(), now()),
	(330002, 'Recipients', 9, 1, 33, '/heka/home/inventory-setup/stock-alerts/recipients', 2, now(), now())
ON CONFLICT ("id") DO UPDATE SET
	"name" = EXCLUDED."name",
	"module_id" = EXCLUDED."module_id",
	"status_id" = EXCLUDED."status_id",
	"parent_id" = EXCLUDED."parent_id",
	"page_url" = EXCLUDED."page_url",
	"sequence_no" = EXCLUDED."sequence_no",
	"updated_at" = now();
