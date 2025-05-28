
import React, { useState } from 'react';
import { Mail, Globe } from 'lucide-react';
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
  const [provider, setProvider] = useState<'google' | 'microsoft' | null>(null);
  const [domain, setDomain] = useState('');
  const { toast } = useToast();

  const validateDomain = (domain: string): boolean => {
    const domainRegex = /^([a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;
    return domainRegex.test(domain);
  };

  const handleSubmit = () => {
    if (!provider) {
      toast({
        title: "Provider Required",
        description: "Please select a provider.",
        variant: "destructive"
      });
      return;
    }

    if (!validateDomain(domain)) {
      toast({
        title: "Invalid Domain",
        description: "Please enter a valid domain name.",
        variant: "destructive"
      });
      return;
    }

    onSwap({ domain, provider });
    onOpenChange(false);
    resetForm();
  };

  const resetForm = () => {
    setProvider(null);
    setDomain('');
  };

  const handleProviderSelect = (selectedProvider: 'google' | 'microsoft') => {
    setProvider(selectedProvider);
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (!isOpen) resetForm();
      onOpenChange(isOpen);
    }}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Swap Domain Provider</DialogTitle>
          <DialogDescription>
            Change the provider for domain: {selectedDomain?.domain}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="text-center mb-2">
            <h3 className="text-lg font-medium">Select New Provider</h3>
            <p className="text-sm text-muted-foreground">Choose your new domain provider</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4 py-4">
            <Button
              variant={provider === 'google' ? "default" : "outline"}
              className="flex flex-col items-center justify-center h-28 px-2 py-6"
              onClick={() => handleProviderSelect('google')}
            >
              <Globe className="h-10 w-10 mb-2" />
              <span>Google Domains</span>
            </Button>
            <Button
              variant={provider === 'microsoft' ? "default" : "outline"}
              className="flex flex-col items-center justify-center h-28 px-2 py-6"
              onClick={() => handleProviderSelect('microsoft')}
            >
              <Mail className="h-10 w-10 mb-2" />
              <span>Microsoft Domains</span>
            </Button>
          </div>

          <div className="space-y-2">
            <Label htmlFor="domain">Domain Name</Label>
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
            disabled={!provider || !domain}
          >
            Swap Provider
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SwapDomainModal;
