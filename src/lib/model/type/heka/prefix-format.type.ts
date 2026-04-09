/**
 * Prefix template / generator (UI + server). No `$lib/server/**` imports.
 */

export type PrefixFieldPath =
	| 'financial_year.code'
	| 'hospital.code'
	| 'branch.code';

export type PrefixSequenceSource =
	| 'prefix_counter.last_no'
	| 'prefix_configuration.last_no';

export type PrefixFormatPart =
	| { type: 'literal'; value: string }
	| { type: 'field'; path: PrefixFieldPath }
	| {
			type: 'sequence';
			source: PrefixSequenceSource;
			op: 'inc';
			padStart?: number;
	  };

export interface PrefixFormatSpec {
	parts: PrefixFormatPart[];
}

/** Inventory prefixes do not use extra context fields today. */
export interface GeneratePrefixContext {}

export interface GeneratePrefixParams {
	hospitalId: string;
	branchId?: string | null;
	financialYearId?: number | null;
	prefixKey: string;
	context?: GeneratePrefixContext;
}
