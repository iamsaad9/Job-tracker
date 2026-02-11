import type { Metadata } from "next";
import "./globals.css";
import Providers from "./Providers";
import { Analytics } from "@vercel/analytics/next";

export const metadata: Metadata = {
  title: "Trackee",
  description: "Track your job applications online",
  icons: {
    icon: "/icon.png",
  },
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
  ),
  alternates: {
    canonical: "/",
  },
  verification: {
    google: "46pkxCS0WQlzOOyNSbnTJSic4u0SUYfYiYJfx5hoW7U",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
        <Analytics />
      </body>
    </html>
  );
}
