/**
 * Backup runtime: usable battery energy ÷ load power.
 * Pure functions (no imports), tested in backup-runtime.test.mjs.
 */

/** Hours a battery runs a constant load: capacity × usable share ÷ load. */
export function runtimeHours(capacityWh: number, loadW: number, usableShare: number): number {
  if (loadW <= 0) return Number.POSITIVE_INFINITY;
  return (capacityWh * usableShare) / loadW;
}

/** Display rounding: one decimal below 20 h, whole hours from 20 h. */
export function roundHours(hours: number): number {
  return hours < 20 ? Math.round(hours * 10) / 10 : Math.round(hours);
}

/** True when the load is above the product's output (a bare battery has no limit). */
export function exceedsOutput(loadW: number, outputW: number | undefined): boolean {
  return outputW !== undefined && loadW > outputW;
}
