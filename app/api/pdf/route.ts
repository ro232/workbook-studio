import { NextRequest, NextResponse } from "next/server";
import React from "react";
import { getBrowser } from "@/lib/pdf-browser";
import { getPageDimensions } from "@/lib/page-sizes";
import { PageRenderer } from "@/components/templates/PageRenderer";
import { validateWorkbook } from "@/lib/workbook-validation";
import type { Workbook } from "@/types/workbook";

const MAX_BODY_BYTES = 5 * 1024 * 1024; // 5 MB

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/pdf
 * Body: { workbook: Workbook }
 * Returns: application/pdf binary
 *
 * Renders all pages inline via React.createElement + renderToString and
 * hands the HTML to puppeteer via setContent. Avoids cross-Lambda state
 * (which would otherwise break a cache-based approach on Vercel).
 *
 * react-dom/server is loaded via dynamic import so Next 15's RSC compiler
 * doesn't flag the route file as a client component import chain.
 */
export async function POST(req: NextRequest) {
  // Reject oversized bodies before parsing JSON
  const declaredLen = Number(req.headers.get("content-length") ?? 0);
  if (Number.isFinite(declaredLen) && declaredLen > MAX_BODY_BYTES) {
    return NextResponse.json(
      { error: "Payload too large", limit: MAX_BODY_BYTES },
      { status: 413 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const validation = validateWorkbook((body as any)?.workbook);
  if (!validation.ok) {
    return NextResponse.json(
      { error: "Invalid workbook payload", details: validation.errors },
      { status: 400 }
    );
  }
  const workbook: Workbook = validation.workbook;

  const dim = getPageDimensions(workbook.format);
  const { renderToString } = await import("react-dom/server");

  const pagesHtml = workbook.pages
    .map((page, i) => {
      const svg = renderToString(
        React.createElement(PageRenderer, {
          page,
          workbook,
          pageIndex: i,
          totalPages: workbook.pages.length,
        })
      );
      return `<div class="pdf-page">${svg}</div>`;
    })
    .join("\n");

  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>${escapeHtml(workbook.title || "Workbook")}</title>
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Quicksand:wght@400;500;600;700&family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=Patrick+Hand&display=swap" rel="stylesheet" />
<style>
  @page { size: ${dim.width}mm ${dim.height}mm; margin: 0; }
  html, body {
    margin: 0; padding: 0; background: white;
    font-family: 'Quicksand', sans-serif;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  .pdf-page {
    width: ${dim.width}mm;
    height: ${dim.height}mm;
    page-break-after: always;
    break-after: page;
    display: block;
    overflow: hidden;
    background: white;
  }
  .pdf-page:last-child { page-break-after: auto; }
  .pdf-page > svg {
    display: block;
    width: ${dim.width}mm;
    height: ${dim.height}mm;
  }
</style>
</head>
<body>
${pagesHtml}
</body>
</html>`;

  let page: Awaited<ReturnType<Awaited<ReturnType<typeof getBrowser>>["newPage"]>> | null = null;
  try {
    const browser = await getBrowser();
    page = await browser.newPage();

    await page.setViewport({
      width: Math.ceil(dim.width * 4),
      height: Math.ceil(dim.height * 4),
      deviceScaleFactor: 1,
    });

    // domcontentloaded + explicit fonts.ready is enough — networkidle0 added
    // 500ms of waiting we don't need with inline SVG content.
    await page.setContent(html, { waitUntil: "domcontentloaded", timeout: 30000 });

    await page
      .evaluate(() => (document as Document).fonts?.ready)
      .catch(() => {});

    const pdfBuffer = await page.pdf({
      width: `${dim.width}mm`,
      height: `${dim.height}mm`,
      printBackground: true,
      preferCSSPageSize: true,
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
    });

    const safeTitle =
      (workbook.title || "workbook").replace(/[^a-z0-9-_]+/gi, "-").slice(0, 60) || "workbook";
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
    // Only close the page — keep the browser alive for the next warm hit.
    if (page) await page.close().catch(() => {});
  }
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
