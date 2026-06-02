import type { Metadata, Viewport } from "next";
import "../styles.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: {
    default: "CRYPTONEXIS LIMITED",
    template: "%s | Cryptonexis Limited",
  },
  description:
    "Cryptonexis Limited — RAK Economic Zone licensed NFT creator and issuer for institutional digital asset creation, issuance, and compliance-first advisory.",
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

