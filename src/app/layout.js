import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";

const inter = Inter({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata = {
  title: {
    template: "%s | PIXELL IMPORT",
    default: "PIXELL IMPORT | Technical Monochrome Editorial",
  },
  description:
    "Direct imports of hyper-refined technology. No middleman. No noise. Just the pure essence of silicon and glass.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
        />
      </head>
      <body className="bg-[var(--color-background)] text-[var(--color-on-surface)] antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
