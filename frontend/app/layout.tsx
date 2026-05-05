import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Campaign Studio",
  description:
    "Generate research-backed, multi-platform marketing campaigns with a 5-agent AI pipeline.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
