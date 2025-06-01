import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Account } from '@/lib/services/accounts';
import { accountsApi } from '@/lib/services/accounts';

interface AccountsState {
  accounts: Account[];
  selectedAccount: Account | null;
  searchResults: Account[];
}

const initialState: AccountsState = {
  accounts: [],
  selectedAccount: null,
  searchResults: [],
};

const accountsSlice = createSlice({
  name: 'accounts',
  initialState,
  reducers: {
    setSelectedAccount: (state, action: PayloadAction<Account | null>) => {
      state.selectedAccount = action.payload;
    },
    clearSearchResults: (state) => {
      state.searchResults = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        accountsApi.endpoints.getAccounts.matchFulfilled,
        (state, { payload }) => {
          state.accounts = payload;
        }
      )
      .addMatcher(
        accountsApi.endpoints.getAccountsByOwnerId.matchFulfilled,
        (state, { payload }) => {
          state.accounts = payload;
        }
      )
      .addMatcher(
        accountsApi.endpoints.searchAccounts.matchFulfilled,
        (state, { payload }) => {
          state.searchResults = payload;
        }
      )
      .addMatcher(
        accountsApi.endpoints.createAccount.matchFulfilled,
        (state, { payload }) => {
          state.accounts.push(payload);
        }
      )
      .addMatcher(
        accountsApi.endpoints.updateAccount.matchFulfilled,
        (state, { payload }) => {
          const index = state.accounts.findIndex(account => account.id === payload.id);
          if (index !== -1) {
            state.accounts[index] = payload;
          }
        }
      )
      .addMatcher(
        accountsApi.endpoints.deleteAccount.matchFulfilled,
        (state, { meta }) => {
          const id = meta.arg.originalArgs;
          state.accounts = state.accounts.filter(account => account.id !== id);
        }
      );
  },
});

export const { setSelectedAccount, clearSearchResults } = accountsSlice.actions;
export default accountsSlice.reducer; 