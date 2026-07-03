import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VAI Workbench",
  description: "Task management and image annotation workspace",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
