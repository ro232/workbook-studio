import { NextRequest, NextResponse } from "next/server";
import { launchBrowser } from "@/lib/pdf-browser";
import { putWorkbook } from "@/lib/pdf-cache";
import { getPageDimensions } from "@/lib/page-sizes";
import type { Workbook } from "@/types/workbook";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/pdf
 * Body: { workbook: Workbook }
 * Returns: application/pdf binary
 */
export async function POST(req: NextRequest) {
  let workbook: Workbook;
  try {
    const body = await req.json();
    workbook = body.workbook as Workbook;
    if (!workbook?.id || !workbook?.pages?.length) {
      return NextResponse.json({ error: "Invalid workbook payload" }, { status: 400 });
    }
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  putWorkbook(workbook.id, workbook);

  const dim = getPageDimensions(workbook.format);
  const origin = req.nextUrl.origin;
  const url = `${origin}/print-pdf/${workbook.id}`;

  let browser: Awaited<ReturnType<typeof launchBrowser>> | null = null;
  try {
    browser = await launchBrowser();

    const page = await browser.newPage();

    // Render at correct DPI - puppeteer pdf format takes care of paper size,
    // we just need viewport big enough for the content to lay out.
    await page.setViewport({
      width: Math.ceil(dim.width * 4),
      height: Math.ceil(dim.height * 4),
      deviceScaleFactor: 1,
    });

    await page.goto(url, { waitUntil: "networkidle0", timeout: 30000 });

    // Wait for fonts to be ready (script in /print-pdf sets data-pdf-ready=1)
    await page
      .waitForFunction(
        () => document.querySelector('main[data-pdf-ready="1"]') !== null,
        { timeout: 10000 }
      )
      .catch(() => {
        /* fall through — render even if signal didn't fire */
      });

    const pdfBuffer = await page.pdf({
      width: `${dim.width}mm`,
      height: `${dim.height}mm`,
      printBackground: true,
      preferCSSPageSize: true,
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
    });

    const safeTitle = (workbook.title || "workbook").replace(/[^a-z0-9-_]+/gi, "-").slice(0, 60) || "workbook";
    return new NextResponse(pdfBuffer as unknown as BodyInit, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${safeTitle}.pdf"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    console.error("[/api/pdf] failed:", err);
    return NextResponse.json(
      { error: "PDF generation failed", detail: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  } finally {
    if (browser) await browser.close().catch(() => {});
  }
}
