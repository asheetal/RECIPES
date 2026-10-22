export declare const REFILL_INTERVAL_UNITS: readonly ["seconds", "minutes", "hours", "days", "weeks", "months"];
export type RefillIntervalUnit = (typeof REFILL_INTERVAL_UNITS)[number];
export declare function getRefillEligibilityDate(lastRefill: Date, value: number, unit: RefillIntervalUnit): Date;
