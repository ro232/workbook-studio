import { notFound } from "next/navigation";
import { getWorkbook } from "@/lib/pdf-cache";
import { PageRenderer } from "@/components/templates/PageRenderer";
import { getPageDimensions } from "@/lib/page-sizes";

export const dynamic = "force-dynamic";

export default async function PrintPdfPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const workbook = getWorkbook(id);
  if (!workbook) notFound();

  const dim = getPageDimensions(workbook.format);

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @page {
              size: ${dim.width}mm ${dim.height}mm;
              margin: 0;
            }
            html, body {
              margin: 0 !important;
              padding: 0 !important;
              background: white !important;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            body > nav, body > header, body > footer { display: none !important; }
            .pdf-page {
              width: ${dim.width}mm;
              height: ${dim.height}mm;
              page-break-after: always;
              break-after: page;
              display: block;
              overflow: hidden;
              background: white;
            }
            .pdf-page:last-child {
              page-break-after: auto;
            }
            .pdf-page > svg {
              display: block;
              width: ${dim.width}mm;
              height: ${dim.height}mm;
            }
          `,
        }}
      />
      <main data-pdf-ready="0">
        {workbook.pages.map((page, i) => (
          <div key={page.id} className="pdf-page">
            <PageRenderer
              page={page}
              workbook={workbook}
              pageIndex={i}
              totalPages={workbook.pages.length}
            />
          </div>
        ))}
        <script
          dangerouslySetInnerHTML={{
            __html: `(async () => { try { if (document.fonts && document.fonts.ready) { await document.fonts.ready; } } finally { document.querySelector('main[data-pdf-ready]').setAttribute('data-pdf-ready','1'); } })();`,
          }}
        />
      </main>
    </>
  );
}
