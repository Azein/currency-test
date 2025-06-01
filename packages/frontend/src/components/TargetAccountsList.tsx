'use client';

import { Account } from '@/lib/services/accounts';
import { Card, CardContent } from '@/components/ui/card';
import { getDictionary } from '@/lib/dictionary';
import type { Locale } from '@/i18n.config';
import { useState, useEffect } from 'react';

interface TargetAccountsListProps {
  accounts: Account[];
  onAccountSelect: (account: Account) => void;
  lang: Locale;
}

export function TargetAccountsList({ accounts, onAccountSelect, lang }: TargetAccountsListProps) {
  const [mounted, setMounted] = useState(false);
  const [dict, setDict] = useState<any>(null);

  useEffect(() => {
    setMounted(true);
    getDictionary(lang).then(setDict);
  }, [lang]);

  if (!mounted || !dict) {
    return null;
  }

  // Group accounts by owner
  const groupedAccounts = accounts.reduce<Record<number, { owner: Account; accounts: Account[] }>>(
    (acc, account) => {
      if (!acc[account.ownerId]) {
        acc[account.ownerId] = {
          owner: account,
          accounts: [],
        };
      }
      acc[account.ownerId].accounts.push(account);
      return acc;
    },
    {}
  );

  return (
    <div className="space-y-6">
      {Object.values(groupedAccounts).map(({ owner, accounts }) => (
        <div key={owner.ownerId} className="space-y-3">
          <div className="flex flex-col">
            <span className="text-lg font-semibold">{owner.ownerName}</span>
            <span className="text-sm text-muted-foreground">
              {dict.ownerId}: {owner.ownerId}
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {accounts.map((account) => (
              <Card
                key={account.id}
                className="cursor-pointer hover:bg-accent/50 transition-colors"
                onClick={() => onAccountSelect(account)}
              >
                <CardContent className="pt-6">
                  <div className="flex flex-col gap-2">
                    <div className="text-sm text-muted-foreground">
                      {dict.balance}
                    </div>
                    <div className="text-xl font-bold">
                      {account.balance.toLocaleString(undefined, {
                        style: 'currency',
                        currency: account.currency,
                      })}
                    </div>
                    <div className="text-sm text-muted-foreground mt-2">
                      {dict.address}
                    </div>
                    <div className="text-sm">
                      {account.ownerAddress}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
} 