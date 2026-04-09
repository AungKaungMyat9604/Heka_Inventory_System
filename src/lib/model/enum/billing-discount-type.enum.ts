/**
 * Fixed IDs for `op_billing.discount_type_id` (legacy billing schema).
 * Not seeded in the inventory-focused fork — insert rows manually if you revive billing.
 */
export enum BillingDiscountTypeEnum {
	NONE = 1,
	PERCENT = 2,
	FIXED_AMOUNT = 3
}

/** Stable `billing_discount_type.code` values (match seed). */
export const BillingDiscountTypeCode = {
	NONE: 'none',
	PERCENT: 'percent',
	AMOUNT: 'amount'
} as const;

export type BillingDiscountTypeCode =
	(typeof BillingDiscountTypeCode)[keyof typeof BillingDiscountTypeCode];
