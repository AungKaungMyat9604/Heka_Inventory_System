import type { PageServerLoad } from './$types';
import { ensureDb } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { StatusEnum } from '$lib/model/enum/db-link';
import { and, count, eq, inArray, isNull } from 'drizzle-orm';
import {
	evaluateStockAlertsForHospital,
	scheduleStockAlertsDispatch,
	type StockAlertsSummary
} from '$lib/server/heka/inventory/stock-alerts.server';

/** Matches `home/+layout.server.ts` “All Branches” sentinel. */
const BRANCH_ALL_VALUE = '__all__';

export type InventoryDashboardCounts = {
	storeCount: number;
	itemMasterCount: number;
	stockLotCount: number;
};

export type InventoryDashboardStockAlertCounts = StockAlertsSummary;

type ParentLayoutData = {
	selectedBranchId: string | null;
	allowedBranches: { id: string; name: string | null }[];
	currentHospitalName?: string | null;
};

function resolveBranchIdsForScope(parent: ParentLayoutData): {
	branchIds: string[];
	scopeLabel: string | null;
} {
	const { selectedBranchId, allowedBranches } = parent;
	if (allowedBranches.length === 0) {
		return { branchIds: [], scopeLabel: null };
	}
	if (selectedBranchId === BRANCH_ALL_VALUE) {
		return {
			branchIds: allowedBranches.map((b) => b.id),
			scopeLabel: 'All branches'
		};
	}
	if (
		selectedBranchId != null &&
		allowedBranches.some((b) => b.id === selectedBranchId)
	) {
		const b = allowedBranches.find((x) => x.id === selectedBranchId);
		return {
			branchIds: [selectedBranchId],
			scopeLabel: b?.name?.trim() || null
		};
	}
	const first = allowedBranches[0]!;
	return {
		branchIds: [first.id],
		scopeLabel: first.name?.trim() || null
	};
}

export const load: PageServerLoad = async (event) => {
	const hospitalId = event.params.hospital_id;
	const parentData = (await event.parent()) as ParentLayoutData;
	const { branchIds, scopeLabel: branchScopeName } =
		resolveBranchIdsForScope(parentData);

	const empty: InventoryDashboardCounts = {
		storeCount: 0,
		itemMasterCount: 0,
		stockLotCount: 0
	};
	const emptyAlerts: InventoryDashboardStockAlertCounts = {
		lowStockCount: 0,
		expiredLotCount: 0,
		expiringSoonLotCount: 0
	};

	if (!hospitalId || branchIds.length === 0) {
		return {
			branchScopeName,
			inventoryDashboard: empty,
			inventoryStockAlerts: emptyAlerts
		};
	}

	const db = ensureDb();
	const branchFilter =
		branchIds.length === 1
			? eq(table.storeTable.branchId, branchIds[0]!)
			: inArray(table.storeTable.branchId, branchIds);

	const storeWhere = and(
		eq(table.hospitalBranchTable.hospitalId, hospitalId),
		branchFilter,
		eq(table.storeTable.statusId, StatusEnum.ACTIVE)
	);

	const branchStoresPromise = db
		.select({ id: table.storeTable.id })
		.from(table.storeTable)
		.innerJoin(
			table.hospitalBranchTable,
			eq(table.storeTable.branchId, table.hospitalBranchTable.id)
		)
		.where(storeWhere);

	const alertEvalPromise = branchStoresPromise.then((rows) =>
		evaluateStockAlertsForHospital(event, {
			hospitalId,
			storeIdsInScope: rows.map((r) => r.id)
		})
	);

	const [[storesRow], [itemsRow], [stockRow], alertEval] = await Promise.all([
		db
			.select({ n: count() })
			.from(table.storeTable)
			.innerJoin(
				table.hospitalBranchTable,
				eq(table.storeTable.branchId, table.hospitalBranchTable.id)
			)
			.where(storeWhere),
		db
			.select({ n: count() })
			.from(table.itemMasterTable)
			.where(
				and(
					eq(table.itemMasterTable.hospitalId, hospitalId),
					eq(table.itemMasterTable.statusId, StatusEnum.ACTIVE)
				)
			),
		db
			.select({ n: count() })
			.from(table.invStockTable)
			.innerJoin(
				table.storeTable,
				eq(table.invStockTable.storeId, table.storeTable.id)
			)
			.innerJoin(
				table.hospitalBranchTable,
				eq(table.storeTable.branchId, table.hospitalBranchTable.id)
			)
			.where(
				and(
					eq(table.invStockTable.hospitalId, hospitalId),
					eq(table.hospitalBranchTable.hospitalId, hospitalId),
					branchFilter,
					isNull(table.invStockTable.deletedAt)
				)
			),
		alertEvalPromise
	]);

	scheduleStockAlertsDispatch({
		hospitalId,
		settings: alertEval.settings,
		baselineSoon: alertEval.baselineSoon,
		sendEmail: true
	});

	const inventoryDashboard: InventoryDashboardCounts = {
		storeCount: Number(storesRow?.n ?? 0),
		itemMasterCount: Number(itemsRow?.n ?? 0),
		stockLotCount: Number(stockRow?.n ?? 0)
	};

	return {
		branchScopeName,
		inventoryDashboard,
		inventoryStockAlerts: alertEval.summary
	};
};
