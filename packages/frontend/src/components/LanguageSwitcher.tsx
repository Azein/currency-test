'use client';

import { usePathname, useRouter } from 'next/navigation';
import { i18n } from '@/i18n.config';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useState, useEffect } from 'react';
import { getDictionary } from '@/lib/dictionary';
import type { Locale } from '@/i18n.config';

interface LanguageSwitcherProps {
  initialLang: Locale;
}

export function LanguageSwitcher({ initialLang }: LanguageSwitcherProps) {
  const router = useRouter();
  const pathName = usePathname();
  const [mounted, setMounted] = useState(false);
  const [dict, setDict] = useState<any>(null);
  const [currentLang, setCurrentLang] = useState(initialLang);

  useEffect(() => {
    setMounted(true);
    setCurrentLang(initialLang);
    getDictionary(initialLang).then(setDict);
  }, [initialLang]);

  const redirectedPathName = (locale: string) => {
    if (!pathName) return '/';
    const segments = pathName.split('/');
    segments[1] = locale;
    return segments.join('/');
  };

  // Prevent hydration issues by not rendering until mounted
  if (!mounted || !dict) {
    return <div className="h-10 w-[180px]" />; // Placeholder with same dimensions
  }

  return (
    <div className="flex items-center gap-2">
      <Select 
        value={currentLang}
        onValueChange={(value) => {
          setCurrentLang(value as Locale);
          const newPath = redirectedPathName(value);
          router.push(newPath);
        }}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {i18n.locales.map(locale => (
            <SelectItem key={locale} value={locale}>
              {locale === currentLang ? dict.languageName : (locale === 'en' ? 'English' : 'Français')}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
} 