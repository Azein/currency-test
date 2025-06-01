'use client';

import React, { Suspense } from 'react';
import { AccountListContainer } from '@/components/AccountListContainer';
import { AccountListSkeleton } from '@/components/AccountListSkeleton';
import type { Locale } from '@/i18n.config';
import { ErrorBoundary } from 'react-error-boundary';

interface HomeContentProps {
  lang: Locale;
  title: string;
}

export function HomeContent({ lang, title }: HomeContentProps) {
  return (
    <main className="container mx-auto py-4 sm:py-8 px-3 sm:px-4">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">{title}</h1>
      <ErrorBoundary fallback={<div>Something went wrong</div>}>
        <AccountListContainer lang={lang} />
      </ErrorBoundary>
    </main>
  );
} 