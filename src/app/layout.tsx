import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Joault - Premium Real-Time Group Spaces",
  description: "A professional group-focused social platform featuring secure Auth Protocol codes, approval-controlled space access, and structured member-box communication layouts.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full scroll-smooth">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="min-h-full bg-bg-deep text-txt-primary font-sans antialiased flex flex-col">
        {children}
      </body>
    </html>
  );
}
