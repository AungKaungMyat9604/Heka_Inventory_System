-- Inventory-only schema: drop legacy clinical / billing / scheduling / medication-order domains,
-- trim prefix_format / prefix_counter / notification columns, and remove unused masters.
-- FK-safe order; CASCADE handles leftover dependents on older databases.

ALTER TABLE "notification" DROP COLUMN IF EXISTS "visit_id";
ALTER TABLE "notification" DROP COLUMN IF EXISTS "refer_history_id";

ALTER TABLE "prefix_format" DROP COLUMN IF EXISTS "counter_include_visit_type";
ALTER TABLE "prefix_format" DROP COLUMN IF EXISTS "counter_include_visit";

ALTER TABLE "prefix_counter" DROP COLUMN IF EXISTS "visit_type_id";

DROP TABLE IF EXISTS "op_billing_line" CASCADE;
DROP TABLE IF EXISTS "op_billing" CASCADE;

DROP TABLE IF EXISTS "medication_order_line" CASCADE;
DROP TABLE IF EXISTS "medication_order_batch" CASCADE;

DROP TABLE IF EXISTS "med_order_frequency_inactive" CASCADE;
DROP TABLE IF EXISTS "med_order_route_inactive" CASCADE;
DROP TABLE IF EXISTS "med_order_form_inactive" CASCADE;
DROP TABLE IF EXISTS "med_order_order_type_inactive" CASCADE;
DROP TABLE IF EXISTS "med_order_dose_unit_inactive" CASCADE;
DROP TABLE IF EXISTS "med_order_food_relation_inactive" CASCADE;
DROP TABLE IF EXISTS "med_order_duration_unit_inactive" CASCADE;

DROP TABLE IF EXISTS "med_order_frequency" CASCADE;
DROP TABLE IF EXISTS "med_order_form" CASCADE;
DROP TABLE IF EXISTS "med_order_route" CASCADE;
DROP TABLE IF EXISTS "med_order_order_type" CASCADE;
DROP TABLE IF EXISTS "med_order_dose_unit" CASCADE;
DROP TABLE IF EXISTS "med_order_food_relation" CASCADE;
DROP TABLE IF EXISTS "med_order_duration_unit" CASCADE;

DROP TABLE IF EXISTS "service_order_detail" CASCADE;
DROP TABLE IF EXISTS "service_order" CASCADE;
DROP TABLE IF EXISTS "service_tagging" CASCADE;
DROP TABLE IF EXISTS "service_item" CASCADE;
DROP TABLE IF EXISTS "sub_category" CASCADE;

DROP TABLE IF EXISTS "refer_history" CASCADE;

DROP TABLE IF EXISTS "progress_note" CASCADE;
DROP TABLE IF EXISTS "plan_of_care" CASCADE;
DROP TABLE IF EXISTS "patient_form_entry" CASCADE;

DROP TABLE IF EXISTS "diagnosis" CASCADE;

DROP TABLE IF EXISTS "patient_diagnosis" CASCADE;
DROP TABLE IF EXISTS "patient_document" CASCADE;
DROP TABLE IF EXISTS "patient_attachment" CASCADE;
DROP TABLE IF EXISTS "patient_insurance" CASCADE;
DROP TABLE IF EXISTS "patient_allergies" CASCADE;
DROP TABLE IF EXISTS "patient_visit" CASCADE;
DROP TABLE IF EXISTS "patient" CASCADE;

DROP TABLE IF EXISTS "appointment_block" CASCADE;
DROP TABLE IF EXISTS "appointment" CASCADE;
DROP TABLE IF EXISTS "doctor_schedule" CASCADE;
DROP TABLE IF EXISTS "external_refer" CASCADE;

DROP TABLE IF EXISTS "hospital_patient_code_counter" CASCADE;
DROP TABLE IF EXISTS "hospital_visit_code_counter" CASCADE;

DROP TABLE IF EXISTS "insurance_table" CASCADE;

DROP TABLE IF EXISTS "document" CASCADE;
DROP TABLE IF EXISTS "document_setting" CASCADE;
DROP TABLE IF EXISTS "document_type" CASCADE;

DROP TABLE IF EXISTS "diagnosis_type" CASCADE;

DROP TABLE IF EXISTS "billing_discount_type" CASCADE;
DROP TABLE IF EXISTS "form_name" CASCADE;
DROP TABLE IF EXISTS "refer_type" CASCADE;
DROP TABLE IF EXISTS "weekday" CASCADE;
DROP TABLE IF EXISTS "visit_type" CASCADE;
DROP TABLE IF EXISTS "severity" CASCADE;

DROP TABLE IF EXISTS "prefix_configuration" CASCADE;

DROP TABLE IF EXISTS "store_type" CASCADE;
DROP TABLE IF EXISTS "hospital_inventory_config" CASCADE;
