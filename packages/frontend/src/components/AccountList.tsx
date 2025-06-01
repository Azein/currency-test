'use client';

import { useSearchAccountsQuery, useCreateAccountMutation, useUpdateAccountMutation, Account } from '@/lib/services/accounts';
import { useAccounts } from '@/lib/features/accounts/hooks';
import { useAppDispatch, useAppSelector } from '@/lib/store';
import { AccountSearch } from './AccountSearch';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { OwnerAccountsBlock } from './OwnerAccountsBlock';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useEffect } from 'react';
import { PlusCircle } from 'lucide-react';
import { toast } from 'sonner';
import { getDictionary } from '@/lib/dictionary';
import type { Locale } from '@/i18n.config';

interface EditFormData {
  ownerName: string;
  ownerAddress: string;
  balance: string;
}

interface CreateFormData {
  ownerName: string;
  ownerAddress: string;
  currency: 'USD' | 'EUR';
  balance: string;
}

interface AccountListProps {
  lang: Locale;
}

export function AccountList({ lang }: AccountListProps) {
  const dispatch = useAppDispatch();
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOwnerId, setSelectedOwnerId] = useState<number | null>(null);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [createFormData, setCreateFormData] = useState<CreateFormData>({
    ownerName: '',
    ownerAddress: '',
    currency: 'USD',
    balance: '0.00',
  });
  const [editFormData, setEditFormData] = useState<EditFormData>({
    ownerName: '',
    ownerAddress: '',
    balance: '',
  });
  const [dict, setDict] = useState<any>(null);
  
  const { data: searchResults, isLoading: isSearching } = useSearchAccountsQuery(
    { 
      query: searchQuery,
      ownerId: selectedOwnerId || undefined
    },
    { skip: !searchQuery || searchQuery.length < 3 }
  );

  const [updateAccount] = useUpdateAccountMutation();
  const [createAccount] = useCreateAccountMutation();

  useEffect(() => {
    setMounted(true);
    getDictionary(lang).then(setDict);
  }, [lang]);

  // Prevent hydration issues by not rendering until mounted and dictionary is loaded
  if (!mounted || !dict) {
    return null;
  }

  const handleSearch = (query: string, ownerId?: number) => {
    setSearchQuery(query);
    setSelectedOwnerId(ownerId ?? null);
  };

  const handleEditClick = (account: Account) => {
    setEditingAccount(account);
    setEditFormData({
      ownerName: account.ownerName,
      ownerAddress: account.ownerAddress,
      balance: account.balance.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
    });
  };

  const handleBalanceChange = (value: string, isCreate: boolean = false) => {
    const cleanValue = value.replace(/[^\d.]/g, '');
    const parts = cleanValue.split('.');
    const formattedValue = parts.length > 1 
      ? `${parts[0]}.${parts[1]}` 
      : cleanValue;

    if (isCreate) {
      setCreateFormData((prev: CreateFormData) => ({
        ...prev,
        balance: formattedValue,
      }));
    } else {
      setEditFormData((prev: EditFormData) => ({
        ...prev,
        balance: formattedValue,
      }));
    }
  };

  const handleBalanceFocus = (isCreate: boolean = false) => {
    if (isCreate) {
      setCreateFormData((prev: CreateFormData) => ({
        ...prev,
        balance: parseFloat(prev.balance).toFixed(2),
      }));
    } else if (editingAccount) {
      setEditFormData((prev: EditFormData) => ({
        ...prev,
        balance: editingAccount.balance.toFixed(2),
      }));
    }
  };

  const handleBalanceBlur = (isCreate: boolean = false) => {
    if (isCreate) {
      if (createFormData.balance) {
        const numericValue = parseFloat(createFormData.balance);
        if (!isNaN(numericValue)) {
          setCreateFormData(prev => ({
            ...prev,
            balance: numericValue.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }),
          }));
        }
      }
    } else {
      if (editFormData.balance) {
        const numericValue = parseFloat(editFormData.balance);
        if (!isNaN(numericValue)) {
          setEditFormData(prev => ({
            ...prev,
            balance: numericValue.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }),
          }));
        }
      }
    }
  };

  const handleEditSubmit = async () => {
    if (editingAccount && editFormData.ownerName && editFormData.balance) {
      try {
        const numericBalance = parseFloat(editFormData.balance.replace(/,/g, ''));
        if (isNaN(numericBalance)) {
          toast.error('Invalid balance value');
          return;
        }

        await updateAccount({
          id: editingAccount.id,
          data: {
            ownerName: editFormData.ownerName,
            ownerAddress: editFormData.ownerAddress,
            balance: numericBalance,
          },
        }).unwrap();
        toast.success('Account updated successfully');
        setEditingAccount(null);
      } catch (error: any) {
        const errorMessage = error?.data?.message || 'Failed to update account. Please try again.';
        toast.error(errorMessage);
        console.error('Failed to update account:', error);
      }
    }
  };

  const handleCreateSubmit = async () => {
    try {
      const numericBalance = parseFloat(createFormData.balance.replace(/,/g, ''));
      
      if (isNaN(numericBalance)) {
        toast.error('Invalid balance value');
        return;
      }

      await createAccount({
        ownerName: createFormData.ownerName,
        ownerAddress: createFormData.ownerAddress,
        currency: createFormData.currency,
        balance: numericBalance,
      }).unwrap();
      
      toast.success('Account created successfully');
      setCreateDialogOpen(false);
      setCreateFormData({
        ownerName: '',
        ownerAddress: '',
        currency: 'USD',
        balance: '0.00',
      });
    } catch (error: any) {
      const errorMessage = error?.data?.message || 'Failed to create account. Please try again.';
      toast.error(errorMessage);
      console.error('Failed to create account:', error);
    }
  };

  const groupedAccounts = searchResults?.reduce<Record<number, { owner: Account; accounts: Account[] }>>(
    (acc, account) => {
      // Only include accounts for the selected owner ID if one is selected
      if (selectedOwnerId && account.ownerId !== selectedOwnerId) {
        return acc;
      }

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
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <AccountSearch 
          onSearch={handleSearch} 
          className="flex-1"
          onOwnerSelect={(ownerId) => setSelectedOwnerId(ownerId)} 
          placeholder={dict.search}
          lang={lang}
        />
      </div>

      <div className="space-y-6">
        {isSearching ? (
          <div className="text-center">Searching accounts...</div>
        ) : searchQuery.length >= 3 && groupedAccounts ? (
          Object.values(groupedAccounts).length > 0 ? (
            Object.values(groupedAccounts).map(({ owner, accounts }) => (
              <OwnerAccountsBlock
                key={owner.ownerId}
                owner={owner}
                accounts={accounts}
                onAccountClick={handleEditClick}
                lang={lang}
              />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center space-y-4 py-12">
              <p className="text-center text-muted-foreground">
                {dict.noAccountsFound}
              </p>
              <Button 
                size="lg"
                className="bg-green-600 hover:bg-green-700"
                onClick={() => setCreateDialogOpen(true)}
              >
                <PlusCircle className="mr-2 h-5 w-5" />
                {dict.createNewAccount}
              </Button>
            </div>
          )
        ) : (
          <div className="flex flex-col items-center justify-center space-y-4 py-12">
            <p className="text-center text-muted-foreground">
              {dict.typeToSearch}
            </p>
            <Button 
              size="lg"
              className="bg-green-600 hover:bg-green-700"
              onClick={() => setCreateDialogOpen(true)}
            >
              <PlusCircle className="mr-2 h-5 w-5" />
              {dict.createNewAccount}
            </Button>
          </div>
        )}
      </div>

      <Dialog open={!!editingAccount} onOpenChange={(open) => !open && setEditingAccount(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{dict.editAccount}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label>{dict.ownerName}</label>
              <Input
                value={editFormData.ownerName}
                onChange={(e) => setEditFormData(prev => ({ ...prev, ownerName: e.target.value }))}
              />
            </div>
            <div className="grid gap-2">
              <label>{dict.ownerAddress}</label>
              <Input
                value={editFormData.ownerAddress}
                onChange={(e) => setEditFormData(prev => ({ ...prev, ownerAddress: e.target.value }))}
              />
            </div>
            <div className="grid gap-2">
              <label>{dict.balance}</label>
              <Input
                value={editFormData.balance}
                onChange={(e) => handleBalanceChange(e.target.value)}
                onFocus={() => handleBalanceFocus()}
                onBlur={() => handleBalanceBlur()}
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleEditSubmit}>{dict.saveChanges}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{dict.createNewAccount}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label>{dict.ownerName}</label>
              <Input
                value={createFormData.ownerName}
                onChange={(e) => setCreateFormData(prev => ({ ...prev, ownerName: e.target.value }))}
                placeholder={dict.enterOwnerName}
              />
            </div>
            <div className="grid gap-2">
              <label>{dict.ownerAddress}</label>
              <Input
                value={createFormData.ownerAddress}
                onChange={(e) => setCreateFormData(prev => ({ ...prev, ownerAddress: e.target.value }))}
                placeholder={dict.enterOwnerAddress}
              />
            </div>
            <div className="grid gap-2">
              <label>{dict.currency}</label>
              <Select
                value={createFormData.currency}
                onValueChange={(value: 'USD' | 'EUR') => 
                  setCreateFormData(prev => ({ ...prev, currency: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder={dict.selectCurrency} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">{dict.usd}</SelectItem>
                  <SelectItem value="EUR">{dict.eur}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <label>{dict.initialBalance}</label>
              <Input
                value={createFormData.balance}
                onChange={(e) => handleBalanceChange(e.target.value, true)}
                onFocus={() => handleBalanceFocus(true)}
                onBlur={() => handleBalanceBlur(true)}
                placeholder={dict.enterInitialBalance}
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              onClick={handleCreateSubmit}
              className="bg-green-600 hover:bg-green-700"
            >
              {dict.createAccount}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 