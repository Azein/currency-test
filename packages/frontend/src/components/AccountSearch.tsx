'use client';

import * as React from "react";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useSearchAccountsQuery } from "@/lib/services/accounts";
import { Account } from "@/lib/services/accounts";
import { useState, useCallback, useEffect } from 'react';
import { useDebounce } from '@/lib/hooks/useDebounce';
import { getDictionary } from '@/lib/dictionary';
import type { Locale } from '@/i18n.config';
import { useAppDispatch, useAppSelector } from '@/lib/store';
import { clearSearchResults } from '@/lib/features/accounts/accountsSlice';

interface AccountSearchProps {
  onSearch: (query: string, ownerId?: number) => void;
  onOwnerSelect: (ownerId: number) => void;
  className?: string;
  placeholder?: string;
  lang: Locale;
}

interface OwnerGroup {
  ownerId: number;
  ownerName: string;
  accounts: Account[];
}

export function AccountSearch({ onSearch, onOwnerSelect, className, placeholder, lang }: AccountSearchProps) {
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [mounted, setMounted] = useState(false);
  const [dict, setDict] = useState<any>(null);
  const [selectedOwnerId, setSelectedOwnerId] = useState<number | null>(null);
  const debouncedValue = useDebounce(inputValue, 500);

  const { data: searchResults, isLoading } = useSearchAccountsQuery(
    { 
      query: debouncedValue,
      ownerId: selectedOwnerId || undefined
    },
    { skip: !debouncedValue || debouncedValue.length < 3 }
  );

  useEffect(() => {
    setMounted(true);
    getDictionary(lang).then(setDict);
  }, [lang]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (inputValue.length >= 3) {
        // Pass the current selectedOwnerId to maintain filtering
        onSearch(inputValue, selectedOwnerId || undefined);
      } else {
        dispatch(clearSearchResults());
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [inputValue, onSearch, dispatch, selectedOwnerId]);

  const handleSelect = useCallback((ownerName: string, ownerId?: number) => {
    setInputValue(ownerName);
    setOpen(false);
    if (ownerId) {
      setSelectedOwnerId(ownerId);
      onSearch(ownerName, ownerId);
      onOwnerSelect(ownerId);
    }
  }, [onSearch, onOwnerSelect]);

  const handleInputChange = useCallback((value: string) => {
    setInputValue(value);
    // Only clear selectedOwnerId if the input is cleared or significantly changed
    if (!value || !inputValue.includes(value)) {
      setSelectedOwnerId(null);
    }
    onSearch(value, undefined);
    setOpen(true);
  }, [onSearch, inputValue]);

  const handleClear = useCallback(() => {
    setInputValue('');
    setSelectedOwnerId(null);
    setOpen(false);
    dispatch(clearSearchResults());
    onSearch('', undefined);
  }, [dispatch, onSearch]);

  if (!mounted || !dict) {
    return null;
  }

  // Group accounts by owner
  const owners = searchResults?.reduce<Record<number, { name: string; id: number }>>((acc, account) => {
    if (!acc[account.ownerId]) {
      acc[account.ownerId] = {
        name: account.ownerName,
        id: account.ownerId,
      };
    }
    return acc;
  }, {});

  return (
    <div className={cn("relative w-full", className)}>
      <Command shouldFilter={false} className="w-full border rounded-lg overflow-visible">
        <div className="flex items-center w-full relative">
          <div className="flex-1 relative">
            <CommandInput
              placeholder={placeholder || dict.search}
              value={inputValue}
              onValueChange={handleInputChange}
              className="w-full h-10 bg-transparent py-3 px-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
            />
            {inputValue && (
              <button
                onClick={handleClear}
                className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 opacity-50 hover:opacity-100 transition-opacity"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
        {open && inputValue.length >= 3 && (
          <div className="absolute top-[calc(100%+4px)] left-0 right-0 z-50 w-full overflow-hidden rounded-lg border bg-popover shadow-md">
            <CommandList>
              {isLoading ? (
                <CommandEmpty>{dict.searching}</CommandEmpty>
              ) : !owners || Object.keys(owners).length === 0 ? (
                <CommandEmpty>{dict.noResults}</CommandEmpty>
              ) : (
                <CommandGroup heading={dict.accountOwners}>
                  {Object.values(owners).map((owner) => (
                    <CommandItem
                      key={owner.id}
                      value={owner.name}
                      onSelect={() => handleSelect(owner.name, owner.id)}
                      className="flex flex-col items-start gap-1 px-4 py-2 cursor-pointer"
                    >
                      <div className="font-medium">{owner.name}</div>
                      <div className="text-sm text-muted-foreground">{dict.ownerId}: {owner.id}</div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
            </CommandList>
          </div>
        )}
      </Command>
    </div>
  );
}

AccountSearch.displayName = "AccountSearch"; 