import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Arkansas Camper Rentals | Arkansas Adventures",
  description: "Comfortable campers, thoughtful extras, and friendly local service for your next Arkansas getaway.",
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
