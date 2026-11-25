import { productList, type Product } from "@/content/products";
import type { Quantity } from "@/lib/format";

/**
 * The line-up capacity scale: one logarithmic axis from the smallest product
 * to the largest LITHIUMVALLEY configuration (0,87–1 044 kWh). Shared by the
 * capacity card in the home tabs and the comparison table, so a product sits
 * at the same point on both.
 */

/** Capacity in kWh. */
export const toKwh = (quantity: Quantity) => (quantity.unit === "Wh" ? quantity.value / 1000 : quantity.value);

/** A spec of a product as a quantity (maxCapacity, minCapacity…), if present. */
export function specQuantity(product: Product, key: string): Quantity | undefined {
  const spec = product.specs.find((item) => item.key === key);
  return spec && typeof spec.value !== "string" ? spec.value : undefined;
}

/** Smallest capacity to the largest, including the top LITHIUMVALLEY configuration (maxCapacity). */
export function lineupRange(products: Product[] = productList): { min: number; max: number } {
  const values = products.flatMap((product) => {
    const max = specQuantity(product, "maxCapacity");
    return [toKwh(product.capacity), ...(max ? [toKwh(max)] : [])];
  });
  return { min: Math.min(...values), max: Math.max(...values) };
}

/** Position 0–1 on the logarithmic scale: 0,87 and 1 044 kWh differ by three orders of magnitude. */
export function logPosition(kwh: number, range: { min: number; max: number } = lineupRange()): number {
  const position = (Math.log(kwh) - Math.log(range.min)) / (Math.log(range.max) - Math.log(range.min));
  return Math.min(1, Math.max(0, position));
}
