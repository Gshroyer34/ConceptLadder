import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Concept Ladder",
  description: "An interactive concept map for drilling into hard ideas in context."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
