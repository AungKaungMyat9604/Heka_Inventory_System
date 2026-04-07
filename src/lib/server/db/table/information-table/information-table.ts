import { sql } from 'drizzle-orm';
import {
	type AnyPgColumn,
	boolean,
	check,
	date,
	decimal,
	foreignKey,
	integer,
	pgTable,
	primaryKey,
	serial,
	text,
	timestamp,
	jsonb,
	uuid,
	unique,
	uniqueIndex,
	varchar
} from 'drizzle-orm/pg-core';
import { uuidv7 } from 'uuidv7';
import { StatusEnum, YesNoEnum } from '../../../../model/enum/db-link';
import { userTable } from '../auth-table/auth-table';
import {
	bloodTypeTable,
	categoryTable,
	cityTable,
	countryTable,
	departmentTable,
	genderTable,
	identityTypeTable,
	maritalStatusTable,
	nationalityTable,
	postalCodeTable,
	positionTable,
	specializationTable,
	staffEmploymentTypeTable,
	staffTypeTable,
	stateTable,
	statusTable,
	titleTable,
	unitTable
} from '../master-table/master-table';
import { index } from 'drizzle-orm/pg-core';

const timestamps = {
	createdAt: timestamp('created_at', {
		withTimezone: true,
		mode: 'string'
	})
		.notNull()
		.defaultNow(),
	updatedAt: timestamp('updated_at', {
		withTimezone: true,
		mode: 'string'
	})
		.notNull()
		.defaultNow()
		.$onUpdate(() => sql`now()`),
	deletedAt: timestamp('deleted_at', {
		withTimezone: true,
		mode: 'string'
	}),
	createdBy: text('created_by').references(
		(): AnyPgColumn => userTable.id,
		{
			onDelete: 'set null',
			onUpdate: 'cascade'
		}
	),
	updatedBy: text('updated_by').references(
		(): AnyPgColumn => userTable.id,
		{
			onDelete: 'set null',
			onUpdate: 'cascade'
		}
	),
	deletedBy: text('deleted_by').references(
		(): AnyPgColumn => userTable.id,
		{
			onDelete: 'set null',
			onUpdate: 'cascade'
		}
	)
} as const;

/** Many-to-many junction tables: timestamps + user tracking, no soft delete. */
const junctionTimestamps = {
	createdAt: timestamp('created_at', {
		withTimezone: true,
		mode: 'string'
	})
		.notNull()
		.defaultNow(),
	updatedAt: timestamp('updated_at', {
		withTimezone: true,
		mode: 'string'
	})
		.notNull()
		.defaultNow()
		.$onUpdate(() => sql`now()`),
	createdBy: text('created_by').references(
		(): AnyPgColumn => userTable.id,
		{
			onDelete: 'set null',
			onUpdate: 'cascade'
		}
	),
	updatedBy: text('updated_by').references(
		(): AnyPgColumn => userTable.id,
		{
			onDelete: 'set null',
			onUpdate: 'cascade'
		}
	)
} as const;

// Information Tables (alphabetical) - business/transactional data
export const hospitalTable = pgTable('hospital', {
	id: uuid('id')
		.primaryKey()
		.$defaultFn(() => uuidv7()),
	name: varchar('name', { length: 512 }),
	code: varchar('code', { length: 128 }),
	address: text('address'),
	phone: varchar('phone', { length: 64 }),
	phoneCountryId: integer('phone_country_id').references(
		() => countryTable.id
	),
	email: varchar('email', { length: 256 }),
	website: varchar('website', { length: 512 }),
	/** One hospital belongs to one owner (user with role OWNER). One owner has many hospitals. */
	ownerId: text('owner_id').references(() => userTable.id),
	postalCodeId: integer('postal_code_id').references(
		() => postalCodeTable.id
	),
	cityId: integer('city_id').references(() => cityTable.id),
	stateId: integer('state_id').references(() => stateTable.id),
	countryId: integer('country_id').references(() => countryTable.id),
	logoUrl: text('logo_url'),
	description: text('description'),
	establishedDate: date('established_date'),
	statusId: integer('status_id')
		.references(() => statusTable.id)
		.notNull()
		.default(StatusEnum.ACTIVE),
	...timestamps
});

/** Branches belong to a hospital (Hospital → many Branches). Branch is a separate entity, not the same level as Hospital. */
export const hospitalBranchTable = pgTable('hospital_branch', {
	id: uuid('id')
		.primaryKey()
		.$defaultFn(() => uuidv7()),
	hospitalId: uuid('hospital_id')
		.notNull()
		.references(() => hospitalTable.id, { onDelete: 'cascade' }),
	name: varchar('name', { length: 512 }),
	code: varchar('code', { length: 128 }),
	address: text('address'),
	phone: varchar('phone', { length: 64 }),
	phoneCountryId: integer('phone_country_id').references(
		() => countryTable.id
	),
	email: varchar('email', { length: 256 }),
	postalCodeId: integer('postal_code_id').references(
		() => postalCodeTable.id
	),
	cityId: integer('city_id').references(() => cityTable.id),
	stateId: integer('state_id').references(() => stateTable.id),
	countryId: integer('country_id').references(() => countryTable.id),
	statusId: integer('status_id')
		.references(() => statusTable.id)
		.notNull()
		.default(StatusEnum.ACTIVE),
	...timestamps
});

/** Financial year per hospital (e.g. FY24-25). */
export const financialYearTable = pgTable(
	'financial_year',
	{
		id: serial('id').primaryKey(),
		hospitalId: uuid('hospital_id')
			.notNull()
			.references(() => hospitalTable.id, { onDelete: 'cascade' }),
		code: varchar('code', { length: 128 }), // e.g. "FY24-25"
		startDate: date('start_date'),
		endDate: date('end_date'),
		...timestamps
	},
	(table) => [
		unique('financial_year_hospital_code_unique').on(
			table.hospitalId,
			table.code
		)
	]
);

/** Format template per hospital + purpose key (no counter). */
export const prefixFormatTable = pgTable(
	'prefix_format',
	{
		id: serial('id').primaryKey(),
		hospitalId: uuid('hospital_id')
			.notNull()
			.references(() => hospitalTable.id, { onDelete: 'cascade' }),
		key: varchar('key', { length: 128 }).notNull(),
		description: text('description'),
		format: jsonb('format').notNull(),
		/** Which dimensions participate in {@link prefixCounterTable.scopeKey} (hospital + key always). */
		counterIncludeBranch: integer('counter_include_branch')
			.notNull()
			.default(YesNoEnum.NO),
		counterIncludeFinancialYear: integer('counter_include_financial_year')
			.notNull()
			.default(YesNoEnum.YES),
		...timestamps
	},
	(table) => [
		unique('prefix_format_hospital_key_unique').on(table.hospitalId, table.key)
	]
);

/**
 * Running number per scope (hospital × branch × financial year × purpose key).
 * `scopeKey` is unique; use {@link buildPrefixCounterScopeKey}.
 */
export const prefixCounterTable = pgTable('prefix_counter', {
	id: serial('id').primaryKey(),
	hospitalId: uuid('hospital_id')
		.notNull()
		.references(() => hospitalTable.id, { onDelete: 'cascade' }),
	branchId: uuid('branch_id').references(() => hospitalBranchTable.id, {
		onDelete: 'cascade'
	}),
	financialYearId: integer('financial_year_id').references(
		() => financialYearTable.id,
		{ onDelete: 'set null' }
	),
	key: varchar('key', { length: 128 }).notNull(),
	scopeKey: text('scope_key').notNull().unique(),
	lastNo: integer('last_no').notNull().default(0),
	createdAt: timestamp('created_at', {
		withTimezone: true,
		mode: 'string'
	})
		.notNull()
		.defaultNow(),
	updatedAt: timestamp('updated_at', {
		withTimezone: true,
		mode: 'string'
	})
		.notNull()
		.defaultNow()
		.$onUpdate(() => sql`now()`)
});

export const hospitalDepartmentTable = pgTable(
	'hospital_department',
	{
		id: serial('id').primaryKey(),
		hospitalId: uuid('hospital_id')
			.references(() => hospitalTable.id)
			.notNull(),
		departmentId: integer('department_id')
			.references(() => departmentTable.id)
			.notNull(),
		...timestamps
	}
);

export const moduleTable = pgTable('module', {
	id: serial('id').primaryKey(),
	name: varchar('name', { length: 512 }),
	imageUrl: text('image_url'),
	moduleUrl: text('module_url'),
	sequenceNo: integer('sequence_no'),
	statusId: integer('status_id')
		.notNull()
		.references(() => statusTable.id),
	...timestamps
});

export const pageTable = pgTable(
	'page',
	{
		id: serial('id').primaryKey(),
		name: varchar('name', { length: 512 }),
		parentId: integer('parent_id'),
		imageUrl: text('image_url'),
		pageUrl: text('page_url'),
		sequenceNo: integer('sequence_no'),
		moduleId: integer('module_id').references(() => moduleTable.id),
		statusId: integer('status_id')
			.references(() => statusTable.id)
			.notNull()
			.default(StatusEnum.ACTIVE),
		...timestamps
	},
	(self) => [
		foreignKey({
			columns: [self.parentId],
			foreignColumns: [self.id]
		})
	]
);

export const staffDetailTable = pgTable('staff_detail', {
	id: serial('id').primaryKey(),
	licenseNo: varchar('license_no', { length: 512 }),
	licenseExpiryDate: date('license_expiry_date'),
	signatureImageUrl: text('signature_image_url'),
	signatureText: text('signature_text'),
	designation: varchar('designation', { length: 512 }),
	education: varchar('education', { length: 512 }),
	bloodTypeId: integer('blood_type_id').references(
		() => bloodTypeTable.id
	),
	statusId: integer('status_id')
		.references(() => statusTable.id)
		.notNull()
		.default(StatusEnum.ACTIVE),
	...timestamps
});

export const staffDepartmentTable = pgTable('staff_department', {
	id: serial('id').primaryKey(),
	staffId: uuid('staff_id')
		.notNull()
		.references(() => staffTable.id),
	departmentId: integer('department_id')
		.notNull()
		.references(() => departmentTable.id),
	...junctionTimestamps
});

export const staffHospitalTable = pgTable('staff_hospital', {
	id: serial('id').primaryKey(),
	staffId: uuid('staff_id')
		.notNull()
		.references(() => staffTable.id),
	hospitalId: uuid('hospital_id')
		.notNull()
		.references(() => hospitalTable.id),
	...junctionTimestamps
});

export const staffBranchTable = pgTable(
	'staff_branch',
	{
		id: serial('id').primaryKey(),
		staffId: uuid('staff_id')
			.notNull()
			.references(() => staffTable.id),
		branchId: uuid('branch_id')
			.notNull()
			.references(() => hospitalBranchTable.id, {
				onDelete: 'cascade'
			}),
		...junctionTimestamps
	},
	(t) => [
		unique('staff_branch_staff_id_branch_id_unique').on(
			t.staffId,
			t.branchId
		)
	]
);

export const staffTable = pgTable('staff', {
	id: uuid('id')
		.primaryKey()
		.$defaultFn(() => uuidv7()),
	/** Links this staff to Better Auth user (1:1). */
	userId: text('user_id')
		.unique()
		.notNull()
		.references(() => userTable.id, { onDelete: 'cascade' }),
	firstName: varchar('first_name', { length: 512 }),
	middleName: varchar('middle_name', { length: 512 }),
	lastName: varchar('last_name', { length: 512 }),
	code: varchar('code', { length: 512 }),
	phonePrimary: varchar('phone_primary', { length: 128 }),
	phoneSecondary: varchar('phone_secondary', { length: 128 }),
	phonePrimaryCountryId: integer(
		'phone_primary_country_id'
	).references(() => countryTable.id),
	phoneSecondaryCountryId: integer(
		'phone_secondary_country_id'
	).references(() => countryTable.id),
	dateOfBirth: date('date_of_birth'),
	joinDate: date('join_date'),
	resignDate: date('resign_date'),
	photoUrl: text('photo_url'),
	address: text('address'),
	remark: text('remark'),
	identityNo: varchar('identity_no', { length: 128 }),
	identityTypeId: integer('identity_type_id').references(
		() => identityTypeTable.id
	),
	titleId: integer('title_id').references(() => titleTable.id),
	staffEmploymentTypeId: integer(
		'staff_employment_type_id'
	).references(() => staffEmploymentTypeTable.id),
	staffTypeId: integer('staff_type_id').references(
		() => staffTypeTable.id
	),
	staffDetailId: integer('staff_detail_id').references(
		() => staffDetailTable.id
	),
	cityId: integer('city_id').references(() => cityTable.id),
	stateId: integer('state_id').references(() => stateTable.id),
	countryId: integer('country_id').references(() => countryTable.id),
	maritalStatusId: integer('marital_status_id').references(
		() => maritalStatusTable.id
	),
	nationalityId: integer('nationality_id').references(
		() => nationalityTable.id
	),
	positionId: integer('position_id').references(
		() => positionTable.id
	),
	postalCodeId: integer('postal_code_id').references(
		() => postalCodeTable.id
	),
	specializationId: integer('specialization_id').references(
		() => specializationTable.id
	),
	genderId: integer('gender_id').references(() => genderTable.id),
	statusId: integer('status_id')
		.references(() => statusTable.id)
		.notNull()
		.default(StatusEnum.ACTIVE),
	//staffHospitalTable
	//staffDepartmentTable
	//staffUserGroupTable
	...timestamps
});

export const staffUserGroupTable = pgTable(
	'staff_user_group',
	{
		id: serial('id').primaryKey(),
		staffId: uuid('staff_id')
			.notNull()
			.references(() => staffTable.id),
		userGroupId: integer('user_group_id')
			.notNull()
			.references(() => userGroupTable.id),
		...junctionTimestamps
	},
	(t) => [
		unique('staff_user_group_staff_id_user_group_id_unique').on(
			t.staffId,
			t.userGroupId
		)
	]
);

export const statusTaggingTable = pgTable('status_tagging', {
	id: serial('id').primaryKey(),
	name: varchar('name', { length: 512 }),
	code: varchar('code', { length: 128 }),
	sequenceNo: integer('sequence_no'),
	statusTaggingTypeId: integer('status_tagging_type_id').references(
		() => statusTaggingTypeTable.id
	),
	statusId: integer('status_id')
		.references(() => statusTable.id)
		.notNull()
		.default(StatusEnum.ACTIVE),
	...timestamps
});

export const statusTaggingTypeTable = pgTable('status_tagging_type', {
	id: serial('id').primaryKey(),
	name: varchar('name', { length: 512 }),
	statusId: integer('status_id')
		.references(() => statusTable.id)
		.notNull()
		.default(StatusEnum.ACTIVE),
	...timestamps
});

export const userGroupPageTable = pgTable('user_group_page', {
	id: serial('id').primaryKey(),
	userGroupId: integer('user_group_id').references(
		() => userGroupTable.id
	),
	pageId: integer('page_id').references(() => pageTable.id),
	...junctionTimestamps
});

export const userGroupTable = pgTable('user_group', {
	id: serial('id').primaryKey(),
	name: varchar('name', { length: 512 }),
	statusId: integer('status_id')
		.references(() => statusTable.id)
		.notNull()
		.default(StatusEnum.ACTIVE),
	hospitalId: uuid('hospital_id').references(() => hospitalTable.id),
	//userGroupPageTable
	...timestamps
});

/** Per-hospital pharmacy generic names (for Item Master Pharmacy Supply). */
export const pharmacyGenericTable = pgTable(
	'pharmacy_generic',
	{
		id: serial('id').primaryKey(),
		hospitalId: uuid('hospital_id')
			.notNull()
			.references(() => hospitalTable.id, { onDelete: 'cascade' }),
		name: varchar('name', { length: 512 }).notNull(),
		code: varchar('code', { length: 128 }),
		statusId: integer('status_id')
			.references(() => statusTable.id)
			.notNull()
			.default(StatusEnum.ACTIVE),
		...timestamps
	},
	(t) => [
		index('pharmacy_generic_hospital_id_idx').on(t.hospitalId),
		index('pharmacy_generic_name_idx').on(t.name),
		index('pharmacy_generic_status_id_idx').on(t.statusId)
	]
);

/** Per-hospital supplier master (inventory / purchasing). */
export const supplierTable = pgTable(
	'supplier',
	{
		id: serial('id').primaryKey(),
		hospitalId: uuid('hospital_id')
			.notNull()
			.references(() => hospitalTable.id, { onDelete: 'cascade' }),
		name: varchar('name', { length: 512 }).notNull(),
		code: varchar('code', { length: 128 }),
		address: text('address'),
		phone: varchar('phone', { length: 64 }),
		phoneCountryId: integer('phone_country_id').references(
			() => countryTable.id
		),
		email: varchar('email', { length: 256 }),
		postalCodeId: integer('postal_code_id').references(
			() => postalCodeTable.id
		),
		cityId: integer('city_id').references(() => cityTable.id),
		stateId: integer('state_id').references(() => stateTable.id),
		countryId: integer('country_id').references(() => countryTable.id),
		remark: text('remark'),
		statusId: integer('status_id')
			.references(() => statusTable.id)
			.notNull()
			.default(StatusEnum.ACTIVE),
		...timestamps
	},
	(t) => [
		index('supplier_hospital_id_idx').on(t.hospitalId),
		index('supplier_name_idx').on(t.name),
		index('supplier_status_id_idx').on(t.statusId)
	]
);

/**
 * Inventory / supply item catalog per hospital. Category must be one of the Item Master rows in
 * `category` (ids 11–13: General, Pharmacy, Medical Supply — see seed / migration).
 */
export const itemMasterTable = pgTable(
	'item_master',
	{
		id: serial('id').primaryKey(),
		hospitalId: uuid('hospital_id')
			.notNull()
			.references(() => hospitalTable.id, { onDelete: 'cascade' }),
		itemName: varchar('item_name', { length: 512 }).notNull(),
		categoryId: integer('category_id')
			.notNull()
			.references(() => categoryTable.id, { onDelete: 'restrict' }),
		itemCode: varchar('item_code', { length: 128 }),
		manufacturerName: varchar('manufacturer_name', { length: 512 }),
		pharmacyGenericId: integer('pharmacy_generic_id').references(
			() => pharmacyGenericTable.id,
			{ onDelete: 'restrict' }
		),
		description: text('description'),
		remark: text('remark'),
		/** Pharmacy / regulated items: GRN must capture batch, expiry, and purchase price. */
		isBatchRequired: boolean('is_batch_required').notNull().default(true),
		/** Optional days-before-expiry window for “expiring soon” alerts; hospital default when null. */
		expiryAlertLeadDays: integer('expiry_alert_lead_days'),
		statusId: integer('status_id')
			.references(() => statusTable.id)
			.notNull()
			.default(StatusEnum.ACTIVE),
		...timestamps
	},
	(t) => [
		index('item_master_hospital_id_idx').on(t.hospitalId),
		index('item_master_category_id_idx').on(t.categoryId),
		index('item_master_item_name_idx').on(t.itemName),
		index('item_master_status_id_idx').on(t.statusId),
		check(
			'item_master_category_supply_chk',
			sql`(${t.categoryId}) IN (11, 12, 13)`
		),
		check(
			'item_master_pharmacy_supply_generic_chk',
			sql`(${t.categoryId}) <> 12 OR ${t.pharmacyGenericId} IS NOT NULL`
		)
	]
);

/** Purchase vs issue unit conversion per hospital item (one active row per item). */
export const itemUnitMasterTable = pgTable(
	'item_unit_master',
	{
		id: serial('id').primaryKey(),
		hospitalId: uuid('hospital_id')
			.notNull()
			.references(() => hospitalTable.id, { onDelete: 'cascade' }),
		purchaseUnitId: integer('purchase_unit_id')
			.notNull()
			.references(() => unitTable.id, { onDelete: 'restrict' }),
		purchaseConversionFactor: decimal('purchase_conversion_factor', {
			precision: 18,
			scale: 6
		}).notNull(),
		issueUnitId: integer('issue_unit_id')
			.notNull()
			.references(() => unitTable.id, { onDelete: 'restrict' }),
		issueConversionFactor: decimal('issue_conversion_factor', {
			precision: 18,
			scale: 6
		}).notNull(),
		statusId: integer('status_id')
			.references(() => statusTable.id)
			.notNull()
			.default(StatusEnum.ACTIVE),
		...timestamps
	},
	(t) => [
		index('item_unit_master_hospital_id_idx').on(t.hospitalId),
		index('item_unit_master_status_id_idx').on(t.statusId),
		uniqueIndex('item_unit_master_hospital_units_unique')
			.on(t.hospitalId, t.purchaseUnitId, t.issueUnitId)
			.where(sql`${t.deletedAt} IS NULL`),
		check(
			'item_unit_master_factors_positive_chk',
			sql`${t.purchaseConversionFactor}::numeric > 0 AND ${t.issueConversionFactor}::numeric > 0`
		)
	]
);

/** Item Master ↔ Item Unit Master (unit conversion tagging; multiple conversions per item). */
export const itemMasterItemUnitMasterTable = pgTable(
	'item_master_item_unit_master',
	{
		id: serial('id').primaryKey(),
		hospitalId: uuid('hospital_id')
			.notNull()
			.references(() => hospitalTable.id, { onDelete: 'cascade' }),
		itemMasterId: integer('item_master_id')
			.notNull()
			.references(() => itemMasterTable.id, { onDelete: 'cascade' }),
		itemUnitMasterId: integer('item_unit_master_id')
			.notNull()
			.references(() => itemUnitMasterTable.id, { onDelete: 'restrict' }),
		/** {@link YesNoEnum}: exactly one YES per item among active links. */
		isDefaultYesNo: integer('is_default_yes_no')
			.notNull()
			.default(YesNoEnum.NO),
		...timestamps
	},
	(t) => [
		index('im_ium_hospital_id_idx').on(t.hospitalId),
		index('im_ium_item_master_id_idx').on(t.itemMasterId),
		index('im_ium_item_unit_master_id_idx').on(t.itemUnitMasterId),
		uniqueIndex('im_ium_hospital_item_unit_unique')
			.on(t.hospitalId, t.itemMasterId, t.itemUnitMasterId)
			.where(sql`${t.deletedAt} IS NULL`),
		check(
			'im_ium_is_default_yes_no_chk',
			sql`${t.isDefaultYesNo} IN (0, 1)`
		),
		uniqueIndex('im_ium_one_default_per_item_unique')
			.on(t.hospitalId, t.itemMasterId)
			.where(
				sql`${t.deletedAt} IS NULL AND ${t.isDefaultYesNo} = 1`
			)
	]
);

export const storeTable = pgTable('store', {
	id: serial('id').primaryKey(),
	branchId: uuid('branch_id')
		.notNull()
		.references(() => hospitalBranchTable.id, {
			onDelete: 'cascade'
		}),
	/** When true, store may create purchase requisitions. */
	isPurchaseRequisitable: boolean('is_purchase_requisitable')
		.notNull()
		.default(false),
	storeName: varchar('store_name', { length: 512 }),
	remark: text('remark'),
	statusId: integer('status_id')
		.references(() => statusTable.id)
		.notNull()
		.default(StatusEnum.ACTIVE),
	...timestamps
});

/** Many-to-many: a store can be linked to zero or more user groups. */
export const storeUserGroupTable = pgTable(
	'store_user_group',
	{
		storeId: integer('store_id')
			.notNull()
			.references(() => storeTable.id, { onDelete: 'cascade' }),
		userGroupId: integer('user_group_id')
			.notNull()
			.references(() => userGroupTable.id, { onDelete: 'restrict' }),
		...junctionTimestamps
	},
	(t) => [
		primaryKey({
			name: 'store_user_group_pk',
			columns: [t.storeId, t.userGroupId]
		})
	]
);

/** IT / helpdesk tickets submitted from the global support dialog. */
export const supportTicketTable = pgTable('support_ticket', {
	id: serial('id').primaryKey(),
	subject: varchar('subject', { length: 512 }).notNull(),
	description: text('description').notNull(),
	/** Workflow: open | in_progress | resolved | closed */
	status: varchar('status', { length: 32 }).notNull().default('open'),
	/** 1 = low … 4 = urgent (app labels) */
	priority: integer('priority').notNull().default(2),
	requesterId: text('requester_id')
		.notNull()
		.references(() => userTable.id, { onDelete: 'restrict' }),
	hospitalId: uuid('hospital_id').references(() => hospitalTable.id, {
		onDelete: 'set null'
	}),
	/** Page URL when the ticket was created (pathname + search) */
	contextUrl: text('context_url'),
	assignedToUserId: text('assigned_to_user_id').references(
		() => userTable.id,
		{ onDelete: 'set null' }
	),
	resolution: text('resolution'),
	...timestamps
});
