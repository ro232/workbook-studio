import type { Metadata, Viewport } from "next";
import "./globals.css";

const SITE_URL = "https://workbook-studio.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Workbook Studio — Premium Printable Workbooks for Kids",
  description:
    "Generate personalized printable workbooks for children: tracing, alphabet, numbers, shapes, dictando — print or PDF in seconds.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    title: "Workbook Studio — Premium Printable Workbooks for Kids",
    description:
      "Personalized tracing books, alphabet & numbers workbooks, dictando — printed at home or saved as PDF in under a minute.",
    siteName: "Workbook Studio",
    locale: "ro_RO",
  },
  twitter: {
    card: "summary_large_image",
    title: "Workbook Studio — Premium Printable Workbooks for Kids",
    description:
      "Personalized tracing books, alphabet & numbers workbooks — print or PDF in seconds.",
  },
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#2f6b5e",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ro">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Quicksand:wght@400;500;600;700&family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=Patrick+Hand&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
