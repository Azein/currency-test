import { i18n } from "@/i18n.config";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import type { Locale } from '@/i18n.config';

export async function generateStaticParams() {
  return i18n.locales.map(locale => ({ lang: locale }));
}

interface RootLayoutProps {
  children: React.ReactNode;
  params: { lang: Locale };
}

export default async function RootLayout({
  children,
  params,
}: RootLayoutProps) {
  const validatedParams = await Promise.resolve(params);
  const lang = i18n.locales.includes(validatedParams.lang as Locale) 
    ? validatedParams.lang 
    : i18n.defaultLocale;

  return (
    <>
      <header className="border-b">
        <div className="container mx-auto py-4 px-4">
          <LanguageSwitcher initialLang={lang} />
        </div>
      </header>
      {children}
    </>
  );
} 