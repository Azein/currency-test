import { accountsApi } from '../accounts';
import { setupApiStore } from '../../test-utils';
import { setupServer } from 'msw/node';
import { renderHook, waitFor } from '@testing-library/react';
import { act } from 'react';
import { handlers, mockAccount } from '../../../mocks/handlers';

const server = setupServer(...handlers);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('accounts api', () => {
  let storeRef: ReturnType<typeof setupApiStore>;

  beforeEach(() => {
    storeRef = setupApiStore();
  });

  it('fetches accounts', async () => {
    const { result } = renderHook(
      () => accountsApi.endpoints.getAccounts.useQuery(),
      { wrapper: storeRef.wrapper }
    );

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toEqual([mockAccount]);
  });

  it('fetches accounts by owner id', async () => {
    const { result } = renderHook(
      () => accountsApi.endpoints.getAccountsByOwnerId.useQuery(1),
      { wrapper: storeRef.wrapper }
    );

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toEqual([mockAccount]);
  });

  it('creates an account', async () => {
    const { result } = renderHook(
      () => accountsApi.endpoints.createAccount.useMutation(),
      { wrapper: storeRef.wrapper }
    );

    const [createAccount] = result.current;

    await act(async () => {
      const response = await createAccount({
        ownerName: 'John Smith',
        ownerAddress: '123 Main St',
        currency: 'USD',
        balance: 1000,
      }).unwrap();

      expect(response).toEqual(mockAccount);
    });
  });

  it('updates an account', async () => {
    const { result } = renderHook(
      () => accountsApi.endpoints.updateAccount.useMutation(),
      { wrapper: storeRef.wrapper }
    );

    const [updateAccount] = result.current;

    await act(async () => {
      const response = await updateAccount({
        id: '1',
        data: {
          ownerName: 'John Smith Updated',
        },
      }).unwrap();

      expect(response).toEqual(mockAccount);
    });
  });

  it('deletes an account', async () => {
    const { result } = renderHook(
      () => accountsApi.endpoints.deleteAccount.useMutation(),
      { wrapper: storeRef.wrapper }
    );

    const [deleteAccount] = result.current;

    await act(async () => {
      await deleteAccount('1').unwrap();
    });
  });

  it('searches accounts', async () => {
    const { result } = renderHook(
      () => accountsApi.endpoints.searchAccounts.useQuery({
        query: 'John',
      }),
      { wrapper: storeRef.wrapper }
    );

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toEqual([mockAccount]);
  });

  it('previews conversion', async () => {
    const { result } = renderHook(
      () => accountsApi.endpoints.previewConversion.useQuery({
        fromCurrency: 'USD',
        toCurrency: 'EUR',
        amount: 1000,
      }),
      { wrapper: storeRef.wrapper }
    );

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toEqual({ convertedAmount: 900 });
  });
});