-- Inventory-only: Item Master schema align with UX
-- - remove barcode (no longer captured in UI)
-- - make batch tracking required by default

ALTER TABLE item_master
  ALTER COLUMN is_batch_required SET DEFAULT true;

-- Drop constraints/indexes related to barcode (created by older migrations)
DROP INDEX IF EXISTS item_master_barcode_idx;
DROP INDEX IF EXISTS item_master_hospital_barcode_unique;

ALTER TABLE item_master
  DROP COLUMN IF EXISTS barcode;

