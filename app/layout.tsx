import type { Metadata } from "next";
import "./globals.css";
import "./paypilot.css";

export const metadata: Metadata = {
  title: "PayPilot AI | Contractor payment review",
  description: "Review contractor invoices and approve PayPal sandbox payouts.",
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
