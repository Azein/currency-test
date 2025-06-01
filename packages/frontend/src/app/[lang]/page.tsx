import type { Locale } from '@/i18n.config';
import { getDictionary } from '@/lib/dictionary';
import { HomeContent } from '@/components/HomeContent';
import { i18n } from '@/i18n.config';

export default async function Home({ params }: { params: { lang: Locale } }) {
  const validatedParams = await Promise.resolve(params);
  const lang = i18n.locales.includes(validatedParams.lang as Locale)
    ? validatedParams.lang
    : i18n.defaultLocale;
  const dict = await getDictionary(lang);
  return <HomeContent lang={lang} title={dict.title} />;
} 