import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/lib/providers";
import type { Locale } from '@/i18n.config';
import { i18n } from "@/i18n.config";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Currency Transfer App",
  description: "A simple currency transfer application",
};

export default function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params?: { lang?: Locale };
}>) {
  const lang = params?.lang && i18n.locales.includes(params.lang) 
    ? params.lang 
    : i18n.defaultLocale;

  return (
    <html lang={lang} suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
