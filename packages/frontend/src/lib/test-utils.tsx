import React from 'react';
import { configureStore, Store } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { accountsApi } from './services/accounts';
import { setupListeners } from '@reduxjs/toolkit/query';

export interface TestWrapperProps {
  children: React.ReactNode;
}

export interface TestUtilsReturn {
  store: Store;
  wrapper: React.FC<TestWrapperProps>;
}

export function setupApiStore(): TestUtilsReturn {
  const store = configureStore({
    reducer: {
      [accountsApi.reducerPath]: accountsApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(accountsApi.middleware),
  });

  setupListeners(store.dispatch);

  const wrapper: React.FC<TestWrapperProps> = ({ children }) => (
    <Provider store={store}>{children}</Provider>
  );

  return {
    store,
    wrapper,
  };
} 