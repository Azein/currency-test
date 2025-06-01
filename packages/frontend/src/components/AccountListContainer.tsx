'use client';

import { AccountList } from './AccountList';
import { Providers } from '@/lib/providers';
import type { Locale } from '@/i18n.config';

interface AccountListContainerProps {
  lang: Locale;
}

export function AccountListContainer({ lang }: AccountListContainerProps) {
  return (
    <Providers>
      <AccountList lang={lang} />
    </Providers>
  );
} 