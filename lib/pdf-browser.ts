/**
 * Environment-aware Chromium launcher.
 *
 * Local dev (Linux/Mac/Windows): uses full `puppeteer` package which auto-downloads Chromium.
 * Vercel / serverless: uses `puppeteer-core` + `@sparticuz/chromium` (small binary, no download).
 *
 * Selection: WORKBOOK_PDF_ENV=serverless forces serverless mode.
 *            Otherwise we detect Vercel/AWS Lambda via env vars.
 */

import type { Browser } from "puppeteer-core";

const isServerless =
  process.env.WORKBOOK_PDF_ENV === "serverless" ||
  Boolean(process.env.AWS_LAMBDA_FUNCTION_VERSION) ||
  Boolean(process.env.VERCEL);

export async function launchBrowser(): Promise<Browser> {
  if (isServerless) {
    const [chromiumMod, pcoreMod] = await Promise.all([
      import("@sparticuz/chromium"),
      import("puppeteer-core"),
    ]);
    // @sparticuz/chromium typings have shifted across versions; cast to any to keep the
    // launcher resilient to minor shape changes.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const chromium: any = (chromiumMod as any).default ?? chromiumMod;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pcore: any = (pcoreMod as any).default ?? pcoreMod;
    return pcore.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath(),
      headless: true,
    }) as unknown as Browser;
  }

  // Local dev — use the full puppeteer package
  const { default: puppeteer } = await import("puppeteer");
  return puppeteer.launch({
    headless: true,
    pipe: true,
    args: process.platform === "linux" ? ["--no-sandbox", "--disable-setuid-sandbox"] : [],
    timeout: 60000,
  }) as unknown as Browser;
}
