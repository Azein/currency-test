import { useAppSelector } from '@/lib/store';
import { Account } from '@/lib/services/accounts';
import { RootState } from '@/lib/store';

export const useAccounts = (): Account[] => {
  return useAppSelector((state: RootState) => state.accounts.accounts);
};

export const useSelectedAccount = (): Account | null => {
  return useAppSelector((state: RootState) => state.accounts.selectedAccount);
};

export const useAccountsByOwnerId = (ownerId: number): Account[] => {
  return useAppSelector((state: RootState) =>
    state.accounts.accounts.filter((account: Account) => account.ownerId === ownerId)
  );
};

export const useAccountById = (id: string): Account | undefined => {
  return useAppSelector((state: RootState) =>
    state.accounts.accounts.find((account: Account) => account.id === id)
  );
}; 