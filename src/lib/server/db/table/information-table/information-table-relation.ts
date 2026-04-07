import { relations } from 'drizzle-orm';
import { userTable } from '../auth-table/auth-table';
import {
	categoryTable,
	cityTable,
	countryTable,
	departmentTable,
	genderTable,
	identityTypeTable,
	maritalStatusTable,
	nationalityTable,
	positionTable,
	postalCodeTable,
	specializationTable,
	staffEmploymentTypeTable,
	bloodTypeTable,
	staffTypeTable,
	stateTable,
	statusTable,
	titleTable,
	unitTable
} from '../master-table/master-table';
import {
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

export const hospitalTableRelations = relations(
	hospitalTable,
	({ one, many }) => ({
		branches: many(hospitalBranchTable),
		owner: one(userTable, {
			fields: [hospitalTable.ownerId],
			references: [userTable.id]
		}),
		status: one(statusTable, {
			fields: [hospitalTable.statusId],
			references: [statusTable.id]
		}),
		city: one(cityTable, {
			fields: [hospitalTable.cityId],
			references: [cityTable.id]
		}),
		state: one(stateTable, {
			fields: [hospitalTable.stateId],
			references: [stateTable.id]
		}),
		country: one(countryTable, {
			fields: [hospitalTable.countryId],
			references: [countryTable.id]
		}),
		phoneCountry: one(countryTable, {
			fields: [hospitalTable.phoneCountryId],
			references: [countryTable.id]
		}),
		postalCode: one(postalCodeTable, {
			fields: [hospitalTable.postalCodeId],
			references: [postalCodeTable.id]
		}),
		userGroups: many(userGroupTable),
		financialYears: many(financialYearTable),
		prefixFormats: many(prefixFormatTable),
		hospitalDepartments: many(hospitalDepartmentTable),
		staffHospitals: many(staffHospitalTable),
		supportTickets: many(supportTicketTable),
		itemMasters: many(itemMasterTable),
		pharmacyGenerics: many(pharmacyGenericTable),
		suppliers: many(supplierTable),
		itemUnitMasters: many(itemUnitMasterTable)
	})
);

export const hospitalBranchTableRelations = relations(
	hospitalBranchTable,
	({ one, many }) => ({
		hospital: one(hospitalTable, {
			fields: [hospitalBranchTable.hospitalId],
			references: [hospitalTable.id]
		}),
		status: one(statusTable, {
			fields: [hospitalBranchTable.statusId],
			references: [statusTable.id]
		}),
		city: one(cityTable, {
			fields: [hospitalBranchTable.cityId],
			references: [cityTable.id]
		}),
		state: one(stateTable, {
			fields: [hospitalBranchTable.stateId],
			references: [stateTable.id]
		}),
		country: one(countryTable, {
			fields: [hospitalBranchTable.countryId],
			references: [countryTable.id]
		}),
		phoneCountry: one(countryTable, {
			fields: [hospitalBranchTable.phoneCountryId],
			references: [countryTable.id]
		}),
		postalCode: one(postalCodeTable, {
			fields: [hospitalBranchTable.postalCodeId],
			references: [postalCodeTable.id]
		}),
		staffBranches: many(staffBranchTable),
		stores: many(storeTable),
		prefixCounters: many(prefixCounterTable)
	})
);

export const financialYearTableRelations = relations(
	financialYearTable,
	({ one, many }) => ({
		hospital: one(hospitalTable, {
			fields: [financialYearTable.hospitalId],
			references: [hospitalTable.id]
		}),
		prefixCounters: many(prefixCounterTable)
	})
);

export const prefixFormatTableRelations = relations(
	prefixFormatTable,
	({ one }) => ({
		hospital: one(hospitalTable, {
			fields: [prefixFormatTable.hospitalId],
			references: [hospitalTable.id]
		})
	})
);

export const prefixCounterTableRelations = relations(
	prefixCounterTable,
	({ one }) => ({
		hospital: one(hospitalTable, {
			fields: [prefixCounterTable.hospitalId],
			references: [hospitalTable.id]
		}),
		branch: one(hospitalBranchTable, {
			fields: [prefixCounterTable.branchId],
			references: [hospitalBranchTable.id]
		}),
		financialYear: one(financialYearTable, {
			fields: [prefixCounterTable.financialYearId],
			references: [financialYearTable.id]
		})
	})
);

export const hospitalDepartmentTableRelations = relations(
	hospitalDepartmentTable,
	({ one }) => ({
		hospital: one(hospitalTable, {
			fields: [hospitalDepartmentTable.hospitalId],
			references: [hospitalTable.id]
		}),
		department: one(departmentTable, {
			fields: [hospitalDepartmentTable.departmentId],
			references: [departmentTable.id]
		})
	})
);

export const moduleTableRelations = relations(moduleTable, ({ one, many }) => ({
	status: one(statusTable, {
		fields: [moduleTable.statusId],
		references: [statusTable.id]
	}),
	pages: many(pageTable)
}));

export const pageTableRelations = relations(pageTable, ({ one, many }) => ({
	module: one(moduleTable, {
		fields: [pageTable.moduleId],
		references: [moduleTable.id]
	}),
	status: one(statusTable, {
		fields: [pageTable.statusId],
		references: [statusTable.id]
	}),
	parent: one(pageTable, {
		fields: [pageTable.parentId],
		references: [pageTable.id]
	}),
	userGroupPages: many(userGroupPageTable)
}));

export const staffDetailTableRelations = relations(
	staffDetailTable,
	({ one }) => ({
		bloodType: one(bloodTypeTable, {
			fields: [staffDetailTable.bloodTypeId],
			references: [bloodTypeTable.id]
		}),
		status: one(statusTable, {
			fields: [staffDetailTable.statusId],
			references: [statusTable.id]
		})
	})
);

export const staffDepartmentTableRelations = relations(
	staffDepartmentTable,
	({ one }) => ({
		staff: one(staffTable, {
			fields: [staffDepartmentTable.staffId],
			references: [staffTable.id]
		}),
		department: one(departmentTable, {
			fields: [staffDepartmentTable.departmentId],
			references: [departmentTable.id]
		})
	})
);

export const staffHospitalTableRelations = relations(
	staffHospitalTable,
	({ one }) => ({
		staff: one(staffTable, {
			fields: [staffHospitalTable.staffId],
			references: [staffTable.id]
		}),
		hospital: one(hospitalTable, {
			fields: [staffHospitalTable.hospitalId],
			references: [hospitalTable.id]
		})
	})
);

export const staffBranchTableRelations = relations(
	staffBranchTable,
	({ one }) => ({
		staff: one(staffTable, {
			fields: [staffBranchTable.staffId],
			references: [staffTable.id]
		}),
		branch: one(hospitalBranchTable, {
			fields: [staffBranchTable.branchId],
			references: [hospitalBranchTable.id]
		})
	})
);

export const staffTableRelations = relations(staffTable, ({ one, many }) => ({
	user: one(userTable, {
		fields: [staffTable.userId],
		references: [userTable.id]
	}),
	staffDetail: one(staffDetailTable, {
		fields: [staffTable.staffDetailId],
		references: [staffDetailTable.id]
	}),
	identityType: one(identityTypeTable, {
		fields: [staffTable.identityTypeId],
		references: [identityTypeTable.id]
	}),
	title: one(titleTable, {
		fields: [staffTable.titleId],
		references: [titleTable.id]
	}),
	staffEmploymentType: one(staffEmploymentTypeTable, {
		fields: [staffTable.staffEmploymentTypeId],
		references: [staffEmploymentTypeTable.id]
	}),
	staffType: one(staffTypeTable, {
		fields: [staffTable.staffTypeId],
		references: [staffTypeTable.id]
	}),
	city: one(cityTable, {
		fields: [staffTable.cityId],
		references: [cityTable.id]
	}),
	state: one(stateTable, {
		fields: [staffTable.stateId],
		references: [stateTable.id]
	}),
	country: one(countryTable, {
		fields: [staffTable.countryId],
		references: [countryTable.id]
	}),
	maritalStatus: one(maritalStatusTable, {
		fields: [staffTable.maritalStatusId],
		references: [maritalStatusTable.id]
	}),
	nationality: one(nationalityTable, {
		fields: [staffTable.nationalityId],
		references: [nationalityTable.id]
	}),
	position: one(positionTable, {
		fields: [staffTable.positionId],
		references: [positionTable.id]
	}),
	postalCode: one(postalCodeTable, {
		fields: [staffTable.postalCodeId],
		references: [postalCodeTable.id]
	}),
	specialization: one(specializationTable, {
		fields: [staffTable.specializationId],
		references: [specializationTable.id]
	}),
	gender: one(genderTable, {
		fields: [staffTable.genderId],
		references: [genderTable.id]
	}),
	status: one(statusTable, {
		fields: [staffTable.statusId],
		references: [statusTable.id]
	}),
	phonePrimaryCountry: one(countryTable, {
		fields: [staffTable.phonePrimaryCountryId],
		references: [countryTable.id]
	}),
	phoneSecondaryCountry: one(countryTable, {
		fields: [staffTable.phoneSecondaryCountryId],
		references: [countryTable.id]
	}),
	staffDepartments: many(staffDepartmentTable),
	staffHospitals: many(staffHospitalTable),
	staffBranches: many(staffBranchTable),
	staffUserGroups: many(staffUserGroupTable)
}));

export const staffUserGroupTableRelations = relations(
	staffUserGroupTable,
	({ one }) => ({
		staff: one(staffTable, {
			fields: [staffUserGroupTable.staffId],
			references: [staffTable.id]
		}),
		userGroup: one(userGroupTable, {
			fields: [staffUserGroupTable.userGroupId],
			references: [userGroupTable.id]
		})
	})
);

export const statusTaggingTableRelations = relations(
	statusTaggingTable,
	({ one }) => ({
		statusTaggingType: one(statusTaggingTypeTable, {
			fields: [statusTaggingTable.statusTaggingTypeId],
			references: [statusTaggingTypeTable.id]
		}),
		status: one(statusTable, {
			fields: [statusTaggingTable.statusId],
			references: [statusTable.id]
		})
	})
);

export const statusTaggingTypeTableRelations = relations(
	statusTaggingTypeTable,
	({ one, many }) => ({
		status: one(statusTable, {
			fields: [statusTaggingTypeTable.statusId],
			references: [statusTable.id]
		}),
		statusTaggings: many(statusTaggingTable)
	})
);

export const userGroupPageTableRelations = relations(
	userGroupPageTable,
	({ one }) => ({
		userGroup: one(userGroupTable, {
			fields: [userGroupPageTable.userGroupId],
			references: [userGroupTable.id]
		}),
		page: one(pageTable, {
			fields: [userGroupPageTable.pageId],
			references: [pageTable.id]
		})
	})
);

export const userGroupTableRelations = relations(
	userGroupTable,
	({ one, many }) => ({
		hospital: one(hospitalTable, {
			fields: [userGroupTable.hospitalId],
			references: [hospitalTable.id]
		}),
		status: one(statusTable, {
			fields: [userGroupTable.statusId],
			references: [statusTable.id]
		}),
		userGroupPages: many(userGroupPageTable),
		staffUserGroups: many(staffUserGroupTable),
		storeUserGroups: many(storeUserGroupTable)
	})
);

export const pharmacyGenericTableRelations = relations(
	pharmacyGenericTable,
	({ one, many }) => ({
		hospital: one(hospitalTable, {
			fields: [pharmacyGenericTable.hospitalId],
			references: [hospitalTable.id]
		}),
		status: one(statusTable, {
			fields: [pharmacyGenericTable.statusId],
			references: [statusTable.id]
		}),
		itemMasters: many(itemMasterTable)
	})
);

export const supplierTableRelations = relations(supplierTable, ({ one }) => ({
	hospital: one(hospitalTable, {
		fields: [supplierTable.hospitalId],
		references: [hospitalTable.id]
	}),
	status: one(statusTable, {
		fields: [supplierTable.statusId],
		references: [statusTable.id]
	})
}));

export const itemMasterTableRelations = relations(
	itemMasterTable,
	({ one, many }) => ({
		hospital: one(hospitalTable, {
			fields: [itemMasterTable.hospitalId],
			references: [hospitalTable.id]
		}),
		category: one(categoryTable, {
			fields: [itemMasterTable.categoryId],
			references: [categoryTable.id]
		}),
		pharmacyGeneric: one(pharmacyGenericTable, {
			fields: [itemMasterTable.pharmacyGenericId],
			references: [pharmacyGenericTable.id]
		}),
		status: one(statusTable, {
			fields: [itemMasterTable.statusId],
			references: [statusTable.id]
		}),
		itemMasterItemUnitMasters: many(itemMasterItemUnitMasterTable)
	})
);

export const itemUnitMasterTableRelations = relations(
	itemUnitMasterTable,
	({ one, many }) => ({
		hospital: one(hospitalTable, {
			fields: [itemUnitMasterTable.hospitalId],
			references: [hospitalTable.id]
		}),
		purchaseUnit: one(unitTable, {
			fields: [itemUnitMasterTable.purchaseUnitId],
			references: [unitTable.id]
		}),
		issueUnit: one(unitTable, {
			fields: [itemUnitMasterTable.issueUnitId],
			references: [unitTable.id]
		}),
		status: one(statusTable, {
			fields: [itemUnitMasterTable.statusId],
			references: [statusTable.id]
		}),
		itemMasterLinks: many(itemMasterItemUnitMasterTable)
	})
);

export const itemMasterItemUnitMasterTableRelations = relations(
	itemMasterItemUnitMasterTable,
	({ one }) => ({
		hospital: one(hospitalTable, {
			fields: [itemMasterItemUnitMasterTable.hospitalId],
			references: [hospitalTable.id]
		}),
		itemMaster: one(itemMasterTable, {
			fields: [itemMasterItemUnitMasterTable.itemMasterId],
			references: [itemMasterTable.id]
		}),
		itemUnitMaster: one(itemUnitMasterTable, {
			fields: [itemMasterItemUnitMasterTable.itemUnitMasterId],
			references: [itemUnitMasterTable.id]
		})
	})
);

export const storeTableRelations = relations(storeTable, ({ one, many }) => ({
	branch: one(hospitalBranchTable, {
		fields: [storeTable.branchId],
		references: [hospitalBranchTable.id]
	}),
	status: one(statusTable, {
		fields: [storeTable.statusId],
		references: [statusTable.id]
	}),
	storeUserGroups: many(storeUserGroupTable)
}));

export const storeUserGroupTableRelations = relations(
	storeUserGroupTable,
	({ one }) => ({
		store: one(storeTable, {
			fields: [storeUserGroupTable.storeId],
			references: [storeTable.id]
		}),
		userGroup: one(userGroupTable, {
			fields: [storeUserGroupTable.userGroupId],
			references: [userGroupTable.id]
		})
	})
);

export const supportTicketTableRelations = relations(
	supportTicketTable,
	({ one }) => ({
		requester: one(userTable, {
			fields: [supportTicketTable.requesterId],
			references: [userTable.id]
		}),
		hospital: one(hospitalTable, {
			fields: [supportTicketTable.hospitalId],
			references: [hospitalTable.id]
		}),
		assignedTo: one(userTable, {
			fields: [supportTicketTable.assignedToUserId],
			references: [userTable.id]
		})
	})
);
