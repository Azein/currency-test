import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface Account {
  id: string;
  ownerId: number;
  ownerName: string;
  ownerAddress: string;
  currency: 'USD' | 'EUR';
  balance: number;
  createdAt: string;
  updatedAt: string;
}

export interface AccountCreateInput {
  ownerName: string;
  ownerAddress: string;
  currency: 'USD' | 'EUR';
  balance?: number;
}

export interface AccountUpdateInput {
  ownerId?: number;
  ownerName?: string;
  ownerAddress?: string;
  currency?: 'USD' | 'EUR';
  balance?: number;
}

export interface SearchAccountsParams {
  query: string;
  ownerId?: number;
}

export interface TransferInput {
  fromAccountId: string;
  toAccountId: string;
  amount: number;
}

export interface TransferResponse {
  message: string;
  fromAccount: Account;
  toAccount: Account;
}

export interface ConversionPreviewResponse {
  convertedAmount: number;
}

export interface ConversionPreviewParams {
  fromCurrency: string;
  toCurrency: string;
  amount: number;
}

export const accountsApi = createApi({
  reducerPath: 'accountsApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3001/api' }),
  tagTypes: ['Account'],
  endpoints: (builder) => ({
    getAccounts: builder.query<Account[], void>({
      query: () => '/accounts',
      providesTags: ['Account'],
    }),
    getAccountsByOwnerId: builder.query<Account[], number>({
      query: (ownerId) => `/accounts/owner/${ownerId}`,
      providesTags: ['Account'],
    }),
    getAccount: builder.query<Account, string>({
      query: (id) => `/accounts/${id}`,
      providesTags: ['Account'],
    }),
    createAccount: builder.mutation<Account, AccountCreateInput>({
      query: (data) => ({
        url: '/accounts',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Account'],
    }),
    updateAccount: builder.mutation<Account, { id: string; data: AccountUpdateInput }>({
      query: ({ id, data }) => ({
        url: `/accounts/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Account'],
    }),
    deleteAccount: builder.mutation<void, string>({
      query: (id) => ({
        url: `/accounts/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Account'],
    }),
    searchAccounts: builder.query<Account[], SearchAccountsParams>({
      query: (params) => ({
        url: '/accounts/search',
        params: {
          query: params.query,
          ownerId: params.ownerId
        }
      }),
      providesTags: ['Account'],
    }),
    transfer: builder.mutation<TransferResponse, TransferInput>({
      query: (data) => ({
        url: '/transfers',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Account'],
    }),
    previewConversion: builder.query<ConversionPreviewResponse, ConversionPreviewParams>({
      query: ({ fromCurrency, toCurrency, amount }) => ({
        url: '/transfers/preview',
        params: { fromCurrency, toCurrency, amount }
      }),
    }),
  }),
});

export const {
  useGetAccountsQuery,
  useGetAccountsByOwnerIdQuery,
  useGetAccountQuery,
  useCreateAccountMutation,
  useUpdateAccountMutation,
  useDeleteAccountMutation,
  useSearchAccountsQuery,
  useTransferMutation,
  usePreviewConversionQuery,
} = accountsApi; 