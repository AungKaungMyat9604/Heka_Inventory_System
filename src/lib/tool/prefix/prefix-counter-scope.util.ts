/**
 * Which optional dimensions are part of {@link prefixCounterTable.scopeKey}.
 * Stored on `prefix_format` and used by `generatePrefix`.
 */
export type PrefixCounterScopeFlags = {
	includeBranch: boolean;
	includeFinancialYear: boolean;
};

/** Defaults when no `prefix_format` row exists (matches built-in purposes). */
export function defaultCounterScopeForPrefixKey(
	prefixKey: string
): PrefixCounterScopeFlags {
	if (
		prefixKey === 'PURCHASE_REQUISITION_NO' ||
		prefixKey === 'PURCHASE_ORDER_NO' ||
		prefixKey === 'DEPARTMENT_INDENT_NO' ||
		prefixKey === 'DEPARTMENT_ISSUE_NO' ||
		prefixKey === 'DEPARTMENT_CONSUMPTION_NO'
	) {
		return {
			includeBranch: true,
			includeFinancialYear: true
		};
	}
	return {
		includeBranch: false,
		includeFinancialYear: true
	};
}

export function defaultCounterScopeForStorageKey(
	storageKey:
		| 'PURCHASE_REQUISITION_NO'
		| 'PURCHASE_ORDER_NO'
		| 'DEPARTMENT_INDENT_NO'
		| 'DEPARTMENT_ISSUE_NO'
		| 'DEPARTMENT_CONSUMPTION_NO'
): PrefixCounterScopeFlags {
	return defaultCounterScopeForPrefixKey(storageKey);
}

/**
 * Stable key for {@link prefixCounterTable}; must stay aligned with SQL migrations
 * that rebuild `scope_key` from `prefix_format` flags.
 */
export function buildPrefixCounterScopeKey(params: {
	hospitalId: string;
	prefixKey: string;
	branchId: string | null;
	financialYearId: number | null;
	scope: PrefixCounterScopeFlags;
}): string {
	const b = params.scope.includeBranch ? (params.branchId ?? '') : '';
	const fy = params.scope.includeFinancialYear
		? params.financialYearId == null
			? ''
			: String(params.financialYearId)
		: '';
	return [params.hospitalId, b, fy, params.prefixKey].join('|');
}
