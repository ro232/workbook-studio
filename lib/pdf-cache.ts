import type { Workbook } from "@/types/workbook";

interface Entry {
  workbook: Workbook;
  expiresAt: number;
}

declare global {
  // eslint-disable-next-line no-var
  var __WORKBOOK_PDF_CACHE: Map<string, Entry> | undefined;
}

const TTL_MS = 5 * 60 * 1000;

function getCache() {
  if (!globalThis.__WORKBOOK_PDF_CACHE) {
    globalThis.__WORKBOOK_PDF_CACHE = new Map();
  }
  return globalThis.__WORKBOOK_PDF_CACHE;
}

function sweep() {
  const cache = getCache();
  const now = Date.now();
  for (const [k, v] of cache.entries()) {
    if (v.expiresAt < now) cache.delete(k);
  }
}

export function putWorkbook(id: string, workbook: Workbook) {
  sweep();
  getCache().set(id, { workbook, expiresAt: Date.now() + TTL_MS });
}

export function getWorkbook(id: string): Workbook | undefined {
  sweep();
  return getCache().get(id)?.workbook;
}
