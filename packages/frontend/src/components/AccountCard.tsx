'use client';

import { Account } from '@/lib/services/accounts';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2, ArrowRightLeft } from 'lucide-react';
import { useAppDispatch } from '@/lib/store';
import { setSelectedAccount } from '@/lib/features/accounts/accountsSlice';
import { useState, useEffect } from 'react';
import { DeleteAccountDialog } from './DeleteAccountDialog';
import { TransferDialog } from './TransferDialog';
import { getDictionary } from '@/lib/dictionary';
import type { Locale } from '@/i18n.config';

interface AccountCardProps {
  account: Account;
  showOwnerInfo?: boolean;
  onClick?: () => void;
  lang: Locale;
}

export function AccountCard({ account, showOwnerInfo = true, onClick, lang }: AccountCardProps) {
  const dispatch = useAppDispatch();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showTransferDialog, setShowTransferDialog] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [dict, setDict] = useState<any>(null);

  useEffect(() => {
    setMounted(true);
    getDictionary(lang).then(setDict);
  }, [lang]);

  const handleClick = () => {
    dispatch(setSelectedAccount(account));
    onClick?.();
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click when clicking delete button
    setShowDeleteDialog(true);
  };

  const handleTransferClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click when clicking transfer button
    setShowTransferDialog(true);
  };

  if (!mounted || !dict) {
    return null;
  }

  return (
    <>
      <Card 
        className="cursor-pointer hover:bg-accent/50 transition-colors"
        onClick={handleClick}
      >
        <CardHeader className="px-4 sm:px-6">
          <CardTitle className="text-base sm:text-lg">
            {showOwnerInfo ? `${account.ownerName}'s ` : ''}{account.currency} Account
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 sm:px-6">
          <div className="flex flex-col gap-2">
            {showOwnerInfo && (
              <>
                <div className="text-xs sm:text-sm text-muted-foreground">
                  {dict.address}
                </div>
                <div className="text-xs sm:text-sm mb-4 break-words">
                  {account.ownerAddress}
                </div>
              </>
            )}
            <div className="text-xs sm:text-sm text-muted-foreground">
              {dict.balance}
            </div>
            <div className="text-xl sm:text-2xl font-bold">
              {account.balance.toLocaleString(undefined, {
                style: 'currency',
                currency: account.currency,
              })}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row gap-2 px-4 sm:px-6">
          <Button
            variant="ghost"
            size="sm"
            className="w-full sm:w-auto sm:ml-auto text-destructive hover:bg-destructive hover:text-destructive-foreground"
            onClick={handleDeleteClick}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            {dict.delete}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="w-full sm:w-auto text-blue-600 hover:bg-blue-600 hover:text-white"
            onClick={handleTransferClick}
          >
            <ArrowRightLeft className="h-4 w-4 mr-2" />
            {dict.makeTransfer}
          </Button>
        </CardFooter>
      </Card>

      <DeleteAccountDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        account={account}
        lang={lang}
      />

      <TransferDialog
        open={showTransferDialog}
        onOpenChange={setShowTransferDialog}
        sourceAccount={account}
        lang={lang}
      />
    </>
  );
} 