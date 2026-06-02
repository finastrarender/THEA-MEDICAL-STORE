import type { Metadata, Viewport } from "next";
import "../styles.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: {
    default: "THEA Medical Store",
    template: "%s | THEA Medical Store",
  },
  description:
    "THEA Medical Store delivers premium pharmaceutical products and cutting-edge medical equipment solutions for healthcare providers across the UAE.",
  metadataBase: new URL(process.env.AUTH_URL ?? "http://localhost:3000"),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  /* suppressHydrationWarning on html/body: browser extensions often inject attrs (e.g. cz-shortcut-listen). */
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="owtc-app" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}

