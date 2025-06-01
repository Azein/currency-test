'use client';

import { useState, useEffect } from 'react';
import { Account, useTransferMutation, usePreviewConversionQuery } from '@/lib/services/accounts';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { AccountSearch } from './AccountSearch';
import { Card, CardContent } from '@/components/ui/card';
import { getDictionary } from '@/lib/dictionary';
import type { Locale } from '@/i18n.config';
import { useSearchAccountsQuery } from '@/lib/services/accounts';
import { TargetAccountsList } from './TargetAccountsList';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface TransferDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sourceAccount: Account;
  lang: Locale;
}

export function TransferDialog({ open, onOpenChange, sourceAccount, lang }: TransferDialogProps) {
  const [mounted, setMounted] = useState(false);
  const [dict, setDict] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOwnerId, setSelectedOwnerId] = useState<number | null>(null);
  const [selectedTargetAccount, setSelectedTargetAccount] = useState<Account | null>(null);
  const [transferAmount, setTransferAmount] = useState('');
  const [debouncedAmount, setDebouncedAmount] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [transfer] = useTransferMutation();

  const { data: searchResults, isLoading: isSearching } = useSearchAccountsQuery(
    { 
      query: searchQuery,
      ownerId: selectedOwnerId || undefined
    },
    { skip: !searchQuery || searchQuery.length < 3 }
  );

  const { data: previewData } = usePreviewConversionQuery({
    fromCurrency: sourceAccount.currency,
    toCurrency: selectedTargetAccount?.currency || '',
    amount: Number(debouncedAmount.replace(/,/g, ''))
  }, { 
    skip: !selectedTargetAccount || 
      selectedTargetAccount.currency === sourceAccount.currency ||
      !debouncedAmount ||
      isNaN(Number(debouncedAmount.replace(/,/g, ''))),
    pollingInterval: 0
  });

  useEffect(() => {
    setMounted(true);
    getDictionary(lang).then(setDict);
  }, [lang]);

  useEffect(() => {
    // Clear amount and error when target account changes
    setTransferAmount('');
    setDebouncedAmount('');
    setError(null);
  }, [selectedTargetAccount]);

  // Debounce effect for transfer amount
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedAmount(transferAmount);
    }, 500); // 500ms debounce delay

    return () => clearTimeout(timer);
  }, [transferAmount]);

  if (!mounted || !dict) {
    return null;
  }

  const handleSearch = (query: string, ownerId?: number) => {
    setSearchQuery(query);
    setSelectedOwnerId(ownerId ?? null);
    if (!query) {
      setSelectedTargetAccount(null); // Clear selected target account when search is cleared
    }
  };

  const handleTargetAccountSelect = (account: Account) => {
    setSelectedTargetAccount(account);
    setSearchQuery(''); // Clear search when target is selected
    setSelectedOwnerId(null); // Clear selected owner when target is selected
  };

  const handleAmountChange = (value: string) => {
    // Remove any non-numeric characters except dots and commas
    const sanitizedValue = value.replace(/[^\d.,]/g, '');
    
    // Replace comma with dot for decimal
    const normalizedValue = sanitizedValue.replace(/,/g, '.');
    
    // Ensure only one decimal point
    const parts = normalizedValue.split('.');
    const finalValue = parts[0] + (parts.length > 1 ? '.' + parts[1] : '');
    
    setTransferAmount(finalValue);
    setError(null);
  };

  const handleAmountBlur = () => {
    if (!transferAmount) return;

    try {
      const numericAmount = Number(transferAmount);
      const formattedAmount = numericAmount.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
      setTransferAmount(formattedAmount);
    } catch (error) {
      console.error('Error formatting amount:', error);
    }
  };

  const handleAmountFocus = () => {
    // Remove formatting when focusing
    if (!transferAmount) return;
    const numericValue = transferAmount.replace(/,/g, '');
    setTransferAmount(numericValue);
  };

  const handleTransfer = async () => {
    if (!selectedTargetAccount) return;

    try {
      const numericAmount = Number(transferAmount.replace(/,/g, ''));

      // Validate amount
      if (isNaN(numericAmount)) {
        setError(dict.invalidAmount);
        return;
      }

      if (numericAmount <= 0) {
        setError(dict.amountMustBePositive);
        return;
      }

      if (numericAmount > sourceAccount.balance) {
        setError(dict.insufficientBalance);
        return;
      }

      // Perform transfer
      await transfer({
        fromAccountId: sourceAccount.id,
        toAccountId: selectedTargetAccount.id,
        amount: numericAmount
      }).unwrap();

      // Show success message
      toast.success(dict.transferSuccess);

      // Close dialog and reset state
      onOpenChange(false);
      setSelectedTargetAccount(null);
      setTransferAmount('');
      setError(null);
    } catch (error: any) {
      const errorMessage = error?.data?.error || dict.transferError;
      setError(errorMessage);
    }
  };

  // Filter accounts based on selectedOwnerId if it exists
  const filteredAccounts = searchResults?.filter(account =>
    account.id !== sourceAccount.id // Only filter out the source account
  );

  const renderAccountCard = (account: Account, isSource: boolean) => (
    <Card>
      <CardContent className="pt-4 sm:pt-6">
        <div className="grid gap-2">
          <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
            <span className="text-xs sm:text-sm text-muted-foreground">{dict.ownerName}:</span>
            <span className="text-sm font-medium">{account.ownerName}</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
            <span className="text-xs sm:text-sm text-muted-foreground">{dict.ownerId}:</span>
            <span className="text-sm font-medium">{account.ownerId}</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
            <span className="text-xs sm:text-sm text-muted-foreground">{dict.balance}:</span>
            <span className="text-sm font-medium">
              {account.balance.toLocaleString(undefined, {
                style: 'currency',
                currency: account.currency,
              })}
            </span>
          </div>
          <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
            <span className="text-xs sm:text-sm text-muted-foreground">{dict.address}:</span>
            <span className="text-sm font-medium break-words sm:text-right sm:max-w-[60%]">{account.ownerAddress}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  // Skip preview if currencies are the same or no amount entered
  const skipPreview = !selectedTargetAccount || 
    selectedTargetAccount.currency === sourceAccount.currency ||
    !transferAmount ||
    isNaN(Number(transferAmount.replace(/,/g, '')));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">{dict.makeTransfer}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 sm:space-y-6">
          {/* Source Account Info */}
          <div>
            <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3">{dict.sourceAccount}</h3>
            {renderAccountCard(sourceAccount, true)}
          </div>

          {/* Target Account Section */}
          <div>
            <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3">
              {selectedTargetAccount ? dict.targetAccount : dict.selectTargetAccount}
            </h3>
            
            {selectedTargetAccount ? (
              <>
                {renderAccountCard(selectedTargetAccount, false)}
                
                {/* Transfer Amount Input */}
                <div className="mt-6 space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">{dict.transferAmount}</label>
                    <Input
                      value={transferAmount}
                      onChange={(e) => handleAmountChange(e.target.value)}
                      onFocus={handleAmountFocus}
                      onBlur={handleAmountBlur}
                      placeholder={`0.00 ${sourceAccount.currency}`}
                      className={error ? 'border-red-500' : ''}
                    />
                    {error && (
                      <p className="text-sm text-red-500">{error}</p>
                    )}
                    {!skipPreview && previewData && (
                      <p className="text-sm text-muted-foreground">
                        {dict.targetAccountWillGet}: {previewData.convertedAmount.toLocaleString(undefined, {
                          style: 'currency',
                          currency: selectedTargetAccount.currency
                        })}
                      </p>
                    )}
                  </div>
                  
                  <Button
                    onClick={handleTransfer}
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    {dict.proceedWithTransfer}
                  </Button>
                </div>
              </>
            ) : (
              <>
                <AccountSearch
                  onSearch={handleSearch}
                  onOwnerSelect={(ownerId) => setSelectedOwnerId(ownerId)}
                  placeholder={dict.searchByOwnerName}
                  lang={lang}
                />

                {/* Target Accounts List */}
                {isSearching ? (
                  <div className="text-center py-4">{dict.searching}</div>
                ) : searchQuery.length >= 3 && filteredAccounts ? (
                  filteredAccounts.length > 0 ? (
                    <TargetAccountsList
                      accounts={filteredAccounts}
                      onAccountSelect={handleTargetAccountSelect}
                      lang={lang}
                    />
                  ) : (
                    <div className="text-center py-4 text-muted-foreground">
                      {dict.noResults}
                    </div>
                  )
                ) : null}
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 