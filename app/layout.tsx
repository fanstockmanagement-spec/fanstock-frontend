import type { Metadata } from "next";
import { Quicksand } from "next/font/google";
import "./globals.css";
import "@radix-ui/themes/styles.css";
import { Theme } from "@radix-ui/themes";
import { Toaster } from "react-hot-toast";

const quicksand = Quicksand({
  variable: "--font-quicksand",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "FAN-STOCK",
  description: "FAN-STOCK",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${quicksand.variable} ${quicksand.className} antialiased`}
      >
        <Theme>
          <Toaster 
            toastOptions={{
              className: "text-sm font-light"
            }}
          />
          <div className="font-sans">
            {children}
          </div>
        </Theme>
      </body>
    </html>
  );
}