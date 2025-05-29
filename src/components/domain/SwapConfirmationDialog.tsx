
import React, { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SwapConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (newDomain: string) => void;
  domain: any;
}

const SwapConfirmationDialog = ({ open, onOpenChange, onConfirm, domain }: SwapConfirmationDialogProps) => {
  const [newDomain, setNewDomain] = useState('');
  const { toast } = useToast();

  const handleConfirm = () => {
    if (!newDomain.trim()) {
      toast({
        title: "Error",
        description: "Please enter a domain name.",
        variant: "destructive"
      });
      return;
    }
    onConfirm(newDomain);
    setNewDomain('');
  };

  const handleCancel = () => {
    setNewDomain('');
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirm Domain Swap</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to swap the domain "{domain?.domain}"? Enter the new domain name below.
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <div className="py-4">
          <div className="flex gap-3 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-2 text-gray-300">New Domain</label>
              <Input
                type="text"
                className="bg-[#1E1E1E] border-[#444] text-white placeholder:text-gray-500"
                value={newDomain}
                onChange={(e) => setNewDomain(e.target.value)}
                placeholder="Enter new domain name"
              />
            </div>
            <Button 
              onClick={handleConfirm}
              className="bg-[#E00000] hover:bg-[#CC0000] text-white h-10 w-10 p-0"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleCancel}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm}>Swap</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default SwapConfirmationDialog;
