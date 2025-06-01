'use client';

import { Provider } from 'react-redux';
import { store } from './store';
import { Toaster } from 'sonner';
import { useState, useEffect } from 'react';

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <Provider store={store}>
      {children}
      {mounted && <Toaster />}
    </Provider>
  );
} 