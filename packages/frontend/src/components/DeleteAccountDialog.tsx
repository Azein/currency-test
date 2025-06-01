'use client';

import { useState, useEffect } from 'react';
import { Account, useDeleteAccountMutation } from '@/lib/services/accounts';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { getDictionary } from '@/lib/dictionary';
import type { Locale } from '@/i18n.config';

interface DeleteAccountDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  account: Account;
  lang: Locale;
}

export function DeleteAccountDialog({ open, onOpenChange, account, lang }: DeleteAccountDialogProps) {
  const [deleteAccount] = useDeleteAccountMutation();
  const [confirmText, setConfirmText] = useState('');
  const [mounted, setMounted] = useState(false);
  const [dict, setDict] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    getDictionary(lang).then(setDict);
  }, [lang]);

  // Reset error and confirm text when dialog opens/closes
  useEffect(() => {
    if (!open) {
      setError(null);
      setConfirmText('');
    }
  }, [open]);

  const handleDelete = async () => {
    if (confirmText !== 'DELETE') {
      toast.error(dict.pleaseTypeDelete);
      return;
    }

    try {
      await deleteAccount(account.id).unwrap();
      toast.success(dict.accountDeleted);
      onOpenChange(false);
    } catch (error: any) {
      const errorMessage = error?.data?.error || dict.deleteError;
      setError(errorMessage);
      console.error('Failed to delete account:', error);
    }
  };

  if (!mounted || !dict) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{dict.delete}</DialogTitle>
          <DialogDescription>
            {dict.confirmDelete}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm text-muted-foreground mb-4">
            {dict.typeDeleteToConfirm}
          </p>
          <Input
            value={confirmText}
            onChange={(e) => {
              setConfirmText(e.target.value);
              setError(null); // Clear error when user types
            }}
            placeholder={dict.deleteConfirmPlaceholder}
            className={error ? 'border-red-500' : ''}
          />
          {error && (
            <p className="mt-2 text-sm text-red-500">{error}</p>
          )}
        </div>
        <DialogFooter>
          <Button variant="destructive" onClick={handleDelete}>
            {dict.delete}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}