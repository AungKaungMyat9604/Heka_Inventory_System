import type {
	InferInsertModel,
	InferSelectModel as DrizzleInferSelectModel,
	Table
} from 'drizzle-orm';
import type {
	financialYearTable,
	hospitalBranchTable,
	hospitalDepartmentTable,
	hospitalTable,
	itemMasterItemUnitMasterTable,
	itemMasterTable,
	itemUnitMasterTable,
	moduleTable,
	pageTable,
	pharmacyGenericTable,
	prefixCounterTable,
	prefixFormatTable,
	staffBranchTable,
	staffDepartmentTable,
	staffDetailTable,
	staffHospitalTable,
	staffTable,
	staffUserGroupTable,
	statusTaggingTable,
	statusTaggingTypeTable,
	storeTable,
	storeUserGroupTable,
	supplierTable,
	supportTicketTable,
	userGroupPageTable,
	userGroupTable
} from './information-table';

type OptionalAuditKeys =
	| 'createdBy'
	| 'updatedBy'
	| 'deletedBy'
	| 'deletedAt';

type WithOptionalAudit<T> = Omit<
	T,
	Extract<keyof T, OptionalAuditKeys>
> &
	Partial<Pick<T, Extract<keyof T, OptionalAuditKeys>>>;

type InferSelectModel<TTable extends Table> = WithOptionalAudit<
	DrizzleInferSelectModel<TTable>
>;

export type HospitalBranchSchema = InferSelectModel<
	typeof hospitalBranchTable
>;
export type HospitalBranchSchemaInsert = InferInsertModel<
	typeof hospitalBranchTable
>;
export type HospitalBranchSchemaUpdate =
	Partial<HospitalBranchSchemaInsert>;

export type HospitalDepartmentSchema = InferSelectModel<
	typeof hospitalDepartmentTable
>;
export type HospitalDepartmentSchemaInsert = InferInsertModel<
	typeof hospitalDepartmentTable
>;
export type HospitalDepartmentSchemaUpdate =
	Partial<HospitalDepartmentSchemaInsert>;

export type HospitalSchema = InferSelectModel<typeof hospitalTable>;
export type HospitalSchemaInsert = InferInsertModel<
	typeof hospitalTable
>;
export type HospitalSchemaUpdate = Partial<HospitalSchemaInsert>;

export type FinancialYearSchema = InferSelectModel<typeof financialYearTable>;
export type FinancialYearSchemaInsert = InferInsertModel<
	typeof financialYearTable
>;
export type FinancialYearSchemaUpdate =
	Partial<FinancialYearSchemaInsert>;

export type PrefixFormatSchema = InferSelectModel<typeof prefixFormatTable>;
export type PrefixFormatSchemaInsert = InferInsertModel<
	typeof prefixFormatTable
>;
export type PrefixFormatSchemaUpdate = Partial<PrefixFormatSchemaInsert>;

export type PrefixCounterSchema = InferSelectModel<typeof prefixCounterTable>;
export type PrefixCounterSchemaInsert = InferInsertModel<
	typeof prefixCounterTable
>;
export type PrefixCounterSchemaUpdate = Partial<PrefixCounterSchemaInsert>;

export type ModuleSchema = InferSelectModel<typeof moduleTable>;
export type ModuleSchemaInsert = InferInsertModel<typeof moduleTable>;
export type ModuleSchemaUpdate = Partial<ModuleSchemaInsert>;

export type PageSchema = InferSelectModel<typeof pageTable>;
export type PageSchemaInsert = InferInsertModel<typeof pageTable>;
export type PageSchemaUpdate = Partial<PageSchemaInsert>;

export type StaffDetailSchema = InferSelectModel<
	typeof staffDetailTable
>;
export type StaffDetailSchemaInsert = InferInsertModel<
	typeof staffDetailTable
>;
export type StaffDetailSchemaUpdate =
	Partial<StaffDetailSchemaInsert>;

export type StaffDepartmentSchema = InferSelectModel<
	typeof staffDepartmentTable
>;
export type StaffDepartmentSchemaInsert = InferInsertModel<
	typeof staffDepartmentTable
>;
export type StaffDepartmentSchemaUpdate =
	Partial<StaffDepartmentSchemaInsert>;

export type StaffHospitalSchema = InferSelectModel<
	typeof staffHospitalTable
>;
export type StaffHospitalSchemaInsert = InferInsertModel<
	typeof staffHospitalTable
>;
export type StaffHospitalSchemaUpdate =
	Partial<StaffHospitalSchemaInsert>;

export type StaffBranchSchema = InferSelectModel<
	typeof staffBranchTable
>;
export type StaffBranchSchemaInsert = InferInsertModel<
	typeof staffBranchTable
>;
export type StaffBranchSchemaUpdate =
	Partial<StaffBranchSchemaInsert>;

export type StaffSchema = InferSelectModel<typeof staffTable>;
export type StaffSchemaInsert = InferInsertModel<typeof staffTable>;
export type StaffSchemaUpdate = Partial<StaffSchemaInsert>;

export type StaffUserGroupSchema = InferSelectModel<
	typeof staffUserGroupTable
>;
export type StaffUserGroupSchemaInsert = InferInsertModel<
	typeof staffUserGroupTable
>;
export type StaffUserGroupSchemaUpdate =
	Partial<StaffUserGroupSchemaInsert>;

export type StatusTaggingSchema = InferSelectModel<
	typeof statusTaggingTable
>;
export type StatusTaggingSchemaInsert = InferInsertModel<
	typeof statusTaggingTable
>;
export type StatusTaggingSchemaUpdate =
	Partial<StatusTaggingSchemaInsert>;

export type StatusTaggingTypeSchema = InferSelectModel<
	typeof statusTaggingTypeTable
>;
export type StatusTaggingTypeSchemaInsert = InferInsertModel<
	typeof statusTaggingTypeTable
>;
export type StatusTaggingTypeSchemaUpdate =
	Partial<StatusTaggingTypeSchemaInsert>;

export type UserGroupPageSchema = InferSelectModel<
	typeof userGroupPageTable
>;
export type UserGroupPageSchemaInsert = InferInsertModel<
	typeof userGroupPageTable
>;
export type UserGroupPageSchemaUpdate =
	Partial<UserGroupPageSchemaInsert>;

export type UserGroupSchema = InferSelectModel<typeof userGroupTable>;
export type UserGroupSchemaInsert = InferInsertModel<
	typeof userGroupTable
>;
export type UserGroupSchemaUpdate = Partial<UserGroupSchemaInsert>;

export type PharmacyGenericSchema = InferSelectModel<
	typeof pharmacyGenericTable
>;
export type PharmacyGenericSchemaInsert = InferInsertModel<
	typeof pharmacyGenericTable
>;
export type PharmacyGenericSchemaUpdate =
	Partial<PharmacyGenericSchemaInsert>;

export type SupplierSchema = InferSelectModel<typeof supplierTable>;
export type SupplierSchemaInsert = InferInsertModel<typeof supplierTable>;
export type SupplierSchemaUpdate = Partial<SupplierSchemaInsert>;

export type ItemMasterSchema = InferSelectModel<typeof itemMasterTable>;
export type ItemMasterSchemaInsert = InferInsertModel<
	typeof itemMasterTable
>;
export type ItemMasterSchemaUpdate = Partial<ItemMasterSchemaInsert>;

export type ItemUnitMasterSchema = InferSelectModel<
	typeof itemUnitMasterTable
>;
export type ItemUnitMasterSchemaInsert = InferInsertModel<
	typeof itemUnitMasterTable
>;
export type ItemUnitMasterSchemaUpdate =
	Partial<ItemUnitMasterSchemaInsert>;

export type ItemMasterItemUnitMasterSchema = InferSelectModel<
	typeof itemMasterItemUnitMasterTable
>;
export type ItemMasterItemUnitMasterSchemaInsert = InferInsertModel<
	typeof itemMasterItemUnitMasterTable
>;
export type ItemMasterItemUnitMasterSchemaUpdate =
	Partial<ItemMasterItemUnitMasterSchemaInsert>;

export type StoreSchema = InferSelectModel<typeof storeTable>;
export type StoreSchemaInsert = InferInsertModel<typeof storeTable>;
export type StoreSchemaUpdate = Partial<StoreSchemaInsert>;

export type StoreUserGroupSchema = InferSelectModel<
	typeof storeUserGroupTable
>;
export type StoreUserGroupSchemaInsert = InferInsertModel<
	typeof storeUserGroupTable
>;
export type StoreUserGroupSchemaUpdate =
	Partial<StoreUserGroupSchemaInsert>;

export type SupportTicketSchema = InferSelectModel<
	typeof supportTicketTable
>;
export type SupportTicketSchemaInsert = InferInsertModel<
	typeof supportTicketTable
>;
export type SupportTicketSchemaUpdate =
	Partial<SupportTicketSchemaInsert>;
