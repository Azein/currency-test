'use client';

import { Account } from '@/lib/services/accounts';
import { AccountCard } from './AccountCard';
import { useState, useEffect } from 'react';
import { getDictionary } from '@/lib/dictionary';
import type { Locale } from '@/i18n.config';

interface OwnerAccountsBlockProps {
  owner: Account;
  accounts: Account[];
  onAccountClick: (account: Account) => void;
  lang: Locale;
}

export function OwnerAccountsBlock({ owner, accounts, onAccountClick, lang }: OwnerAccountsBlockProps) {
  const [mounted, setMounted] = useState(false);
  const [dict, setDict] = useState<any>(null);

  useEffect(() => {
    setMounted(true);
    getDictionary(lang).then(setDict);
  }, [lang]);

  if (!mounted || !dict) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="p-3 sm:p-4 rounded-lg border border-border">
        <div className="grid gap-2">
          <div className="grid grid-cols-1 sm:grid-cols-[auto,1fr] gap-x-4 gap-y-1">
            <span className="text-xs sm:text-sm text-muted-foreground">Owner ID:</span>
            <span className="text-sm">{owner.ownerId}</span>
            <span className="text-xs sm:text-sm text-muted-foreground">{dict.ownerName}:</span>
            <span className="text-sm">{owner.ownerName}</span>
            <span className="text-xs sm:text-sm text-muted-foreground">{dict.ownerAddress}:</span>
            <span className="text-sm break-words">{owner.ownerAddress}</span>
          </div>
        </div>
      </div>
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {accounts.map((account) => (
          <AccountCard 
            key={account.id} 
            account={account}
            showOwnerInfo={false}
            onClick={() => onAccountClick(account)}
            lang={lang}
          />
        ))}
      </div>
    </div>
  );
} 