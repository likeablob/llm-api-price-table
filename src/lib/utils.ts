import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { ModelData } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number): string {
  if (price < 0.01) {
    return `$${price.toPrecision(3)}`;
  }
  return `$${price.toFixed(2)}`;
}

export function formatContextLength(length: number): string {
  return length.toLocaleString();
}

export function formatModalities(modalities: string[]): string {
  return modalities.join(", ");
}

export type SortColumn = keyof ModelData | null;
export type SortDirection = "asc" | "desc";

export function sortModels(
  models: ModelData[],
  column: SortColumn,
  direction: SortDirection,
): ModelData[] {
  if (!column) return models;

  const sorted = [...models];
  sorted.sort((a, b) => {
    const aValue = a[column];
    const bValue = b[column];

    if (
      column === "inputPrice" ||
      column === "outputPrice" ||
      column === "inputCacheReadPrice" ||
      column === "inputCacheWritePrice"
    ) {
      const aHasValue = aValue != null;
      const bHasValue = bValue != null;
      const aNum = aHasValue ? (aValue as number) : Infinity;
      const bNum = bHasValue ? (bValue as number) : Infinity;
      return direction === "asc" ? aNum - bNum : bNum - aNum;
    }

    if (column === "contextLength") {
      return direction === "asc"
        ? (aValue as number) - (bValue as number)
        : (bValue as number) - (aValue as number);
    }

    if (column === "inputModalities" || column === "outputModalities") {
      const aArr = Array.isArray(aValue) ? aValue : [];
      const bArr = Array.isArray(bValue) ? bValue : [];
      const aLen = aArr.length;
      const bLen = bArr.length;

      return direction === "asc" ? aLen - bLen : bLen - aLen;
    }

    const aStr = String(aValue ?? "").toLowerCase();
    const bStr = String(bValue ?? "").toLowerCase();

    return direction === "asc"
      ? aStr.localeCompare(bStr)
      : bStr.localeCompare(aStr);
  });

  return sorted;
}
