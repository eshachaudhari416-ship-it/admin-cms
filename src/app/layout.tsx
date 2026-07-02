import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "The AI Signal — Admin CMS",
  description: "Admin CMS for The AI Signal platform",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
