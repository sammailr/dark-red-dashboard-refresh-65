
import React, { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

interface SwapConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (newDomain: string) => void;
  domain: any;
}

const SwapConfirmationDialog = ({ open, onOpenChange, onConfirm, domain }: SwapConfirmationDialogProps) => {
  const [newDomain, setNewDomain] = useState('');
  const [showFinalConfirm, setShowFinalConfirm] = useState(false);
  const { toast } = useToast();

  const handleSwap = () => {
    if (!newDomain.trim()) {
      toast({
        title: "Error",
        description: "Please enter a domain name.",
        variant: "destructive"
      });
      return;
    }
    setShowFinalConfirm(true);
  };

  const handleFinalConfirm = () => {
    onConfirm(newDomain);
    setNewDomain('');
    setShowFinalConfirm(false);
  };

  const handleCancel = () => {
    setNewDomain('');
    setShowFinalConfirm(false);
    onOpenChange(false);
  };

  const handleFinalCancel = () => {
    setShowFinalConfirm(false);
  };

  return (
    <>
      <AlertDialog open={open && !showFinalConfirm} onOpenChange={onOpenChange}>
        <AlertDialogContent>
          <div className="py-4">
            <Input
              type="text"
              className="bg-[#1E1E1E] border-[#444] text-white placeholder:text-gray-500"
              value={newDomain}
              onChange={(e) => setNewDomain(e.target.value)}
              placeholder="Enter new domain name"
            />
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancel}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleSwap}>Swap</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showFinalConfirm} onOpenChange={setShowFinalConfirm}>
        <AlertDialogContent>
          <div className="py-4">
            <p className="text-white text-center">
              Are you sure you want to swap the domain "{domain?.domain}"?
            </p>
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleFinalCancel}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleFinalConfirm}>Swap</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default SwapConfirmationDialog;
