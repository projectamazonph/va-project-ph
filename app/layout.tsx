import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "The VA Project Philippines",
    template: "%s | The VA Project Philippines",
  },
  description: "Zero experience in. Skilled, hired-ready VA out.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
