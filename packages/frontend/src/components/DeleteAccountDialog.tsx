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

  useEffect(() => {
    setMounted(true);
    getDictionary(lang).then(setDict);
  }, [lang]);

  const handleDelete = async () => {
    if (confirmText !== 'DELETE') {
      toast.error('Please type DELETE to confirm');
      return;
    }

    try {
      await deleteAccount(account.id).unwrap();
      toast.success('Account deleted successfully');
      onOpenChange(false);
    } catch (error: any) {
      const errorMessage = error?.data?.message || 'Failed to delete account. Please try again.';
      toast.error(errorMessage);
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
            Are you sure you want to delete this account? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm text-muted-foreground mb-4">
            Type DELETE to confirm:
          </p>
          <Input
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder="DELETE"
          />
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