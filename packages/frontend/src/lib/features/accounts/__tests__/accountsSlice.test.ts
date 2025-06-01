import accountsReducer, {
  setSelectedAccount,
  clearSearchResults,
} from '../accountsSlice';
import { Account } from '@/lib/services/accounts';

describe('accounts slice', () => {
  const mockAccount: Account = {
    id: '1',
    ownerId: 1,
    ownerName: 'John Smith',
    ownerAddress: '123 Main St',
    currency: 'USD',
    balance: 1000,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const initialState = {
    accounts: [],
    selectedAccount: null,
    searchResults: [],
  };

  describe('reducers', () => {
    it('should handle initial state', () => {
      expect(accountsReducer(undefined, { type: 'unknown' })).toEqual(initialState);
    });

    it('should handle setSelectedAccount', () => {
      const actual = accountsReducer(initialState, setSelectedAccount(mockAccount));
      expect(actual.selectedAccount).toEqual(mockAccount);
    });

    it('should handle clearSearchResults', () => {
      const stateWithResults = {
        ...initialState,
        searchResults: [mockAccount],
      };
      const actual = accountsReducer(stateWithResults, clearSearchResults());
      expect(actual.searchResults).toEqual([]);
    });
  });
}); 