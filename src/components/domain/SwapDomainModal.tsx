import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';

interface SwapDomainModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSwap: (data: { domain: string; provider: 'google' | 'microsoft' }) => void;
  selectedDomain: any;
}

const SwapDomainModal = ({ open, onOpenChange, onSwap, selectedDomain }: SwapDomainModalProps) => {
  const [domain, setDomain] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    if (selectedDomain && open) {
      setDomain(selectedDomain.domain || '');
    }
  }, [selectedDomain, open]);

  const validateDomain = (domain: string): boolean => {
    const domainRegex = /^([a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;
    return domainRegex.test(domain);
  };

  const handleSubmit = () => {
    if (!validateDomain(domain)) {
      toast({
        title: "Invalid Domain",
        description: "Please enter a valid domain name.",
        variant: "destructive"
      });
      return;
    }

    // Keep the existing provider when swapping domain name
    const currentProvider = selectedDomain?.provider?.toLowerCase() === 'google' ? 'google' : 'microsoft';
    onSwap({ domain, provider: currentProvider });
    onOpenChange(false);
    resetForm();
  };

  const resetForm = () => {
    setDomain('');
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (!isOpen) resetForm();
      onOpenChange(isOpen);
    }}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Change Domain Name</DialogTitle>
          <DialogDescription>
            Update the domain name for: {selectedDomain?.domain}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="domain">New Domain Name</Label>
            <Input
              id="domain"
              placeholder="example.com"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter className="flex justify-between items-center">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={!domain || domain === selectedDomain?.domain}
          >
            Update Domain
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SwapDomainModal;
