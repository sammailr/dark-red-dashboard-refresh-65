
import React, { useState, useRef, useCallback } from 'react';
import { Upload, X, AlertCircle, AlertTriangle, Google, Microsoft } from 'lucide-react';
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
import { useSubscription } from '@/contexts/SubscriptionContext';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

type DomainEntry = {
  domain: string;
  url: string;
  valid: boolean;
  error?: string;
};

interface ImportDomainModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImport: (domains: Array<{ domain: string; url: string }>) => void;
}

const ImportDomainModal = ({ open, onOpenChange, onImport }: ImportDomainModalProps) => {
  // Added state for the provider selection step
  const [step, setStep] = useState<'provider' | 'import'>('provider');
  const [provider, setProvider] = useState<'google' | 'microsoft' | null>(null);
  
  const [domain, setDomain] = useState('');
  const [url, setUrl] = useState('https://');
  const [csvDomains, setCsvDomains] = useState<DomainEntry[]>([]);
  const [isManual, setIsManual] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { subscriptions } = useSubscription();
  
  // Calculate available domain slots from all active subscriptions
  const availableDomainSlots = subscriptions
    .filter(sub => sub.status === 'active')
    .reduce((total, sub) => total + (sub.availableDomainSlots || 0), 0);

  const validateUrl = (url: string): boolean => {
    try {
      const urlObj = new URL(url);
      return urlObj.protocol === 'https:';
    } catch {
      return false;
    }
  };

  const validateDomain = (domain: string): boolean => {
    // Simple domain validation (should be improved for production)
    const domainRegex = /^([a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;
    return domainRegex.test(domain);
  };

  // Check if CSV domains exceed available slots
  const validCsvDomains = csvDomains.filter(entry => entry.valid);
  const exceedsAvailableSlots = validCsvDomains.length > availableDomainSlots;

  const handleManualSubmit = () => {
    if (!validateDomain(domain)) {
      toast({
        title: "Invalid Domain",
        description: "Please enter a valid domain name.",
        variant: "destructive"
      });
      return;
    }

    if (!validateUrl(url)) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid URL starting with https://",
        variant: "destructive"
      });
      return;
    }

    if (availableDomainSlots < 1) {
      toast({
        title: "No Available Slots",
        description: "You don't have any domain slots available. Please upgrade your subscription.",
        variant: "destructive"
      });
      return;
    }

    onImport([{ domain, url }]);
    onOpenChange(false);
    resetForm();
  };

  const handleCsvSubmit = () => {
    const validDomains = csvDomains.filter(entry => entry.valid);
    
    if (validDomains.length === 0) {
      toast({
        title: "No Valid Domains",
        description: "There are no valid domains to import.",
        variant: "destructive"
      });
      return;
    }

    if (availableDomainSlots < validDomains.length) {
      toast({
        title: "Not Enough Slots",
        description: `You can only import ${availableDomainSlots} domains. Please remove some domains or upgrade your subscription.`,
        variant: "destructive"
      });
      return;
    }

    onImport(validDomains.map(({ domain, url }) => ({ domain, url })));
    onOpenChange(false);
    resetForm();
  };

  const resetForm = () => {
    setStep('provider');
    setProvider(null);
    setDomain('');
    setUrl('https://');
    setCsvDomains([]);
    setIsManual(true);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleProviderSelect = (selectedProvider: 'google' | 'microsoft') => {
    setProvider(selectedProvider);
    setStep('import');
  };

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      try {
        // Parse CSV (simple implementation, could use a library for more complex CSVs)
        const lines = text.split('\n');
        
        // Skip header row if it exists
        const startRow = lines[0].toLowerCase().includes('domain') ? 1 : 0;
        
        const parsedDomains: DomainEntry[] = [];
        
        for (let i = startRow; i < lines.length; i++) {
          const line = lines[i].trim();
          if (!line) continue;
          
          const parts = line.split(',');
          const domainValue = parts[0]?.trim();
          const urlValue = parts[1]?.trim() || '';
          
          const isValidDomain = validateDomain(domainValue);
          const isValidUrl = validateUrl(urlValue);
          
          parsedDomains.push({
            domain: domainValue,
            url: urlValue,
            valid: isValidDomain && isValidUrl,
            error: !isValidDomain 
              ? "Invalid domain" 
              : !isValidUrl 
                ? "Invalid URL (must start with https://)" 
                : undefined
          });
        }
        
        setCsvDomains(parsedDomains);
      } catch (error) {
        toast({
          title: "Error Parsing CSV",
          description: "The CSV file format is invalid. Please check the file and try again.",
          variant: "destructive"
        });
      }
    };
    reader.readAsText(file);
  }, [toast]);

  const removeCsvDomain = (index: number) => {
    setCsvDomains(prev => prev.filter((_, i) => i !== index));
  };

  const handleBack = () => {
    setStep('provider');
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (!isOpen) resetForm();
      onOpenChange(isOpen);
    }}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Import Domain</DialogTitle>
          <DialogDescription>
            Add a new domain to your account. You have {availableDomainSlots} domain slots available.
          </DialogDescription>
        </DialogHeader>

        {step === 'provider' ? (
          <div className="space-y-4">
            <div className="text-center mb-2">
              <h3 className="text-lg font-medium">Select Provider</h3>
              <p className="text-sm text-muted-foreground">Choose your domain provider</p>
            </div>
            <div className="grid grid-cols-2 gap-4 py-4">
              <Button
                variant={provider === 'google' ? "default" : "outline"}
                className="flex flex-col items-center justify-center h-28 px-2 py-6"
                onClick={() => handleProviderSelect('google')}
              >
                <Google className="h-10 w-10 mb-2" />
                <span>Google Domains</span>
              </Button>
              <Button
                variant={provider === 'microsoft' ? "default" : "outline"}
                className="flex flex-col items-center justify-center h-28 px-2 py-6"
                onClick={() => handleProviderSelect('microsoft')}
              >
                <Microsoft className="h-10 w-10 mb-2" />
                <span>Microsoft Domains</span>
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center space-x-2 mb-4">
              <Button variant="outline" size="sm" onClick={handleBack}>
                Back
              </Button>
              <div className="flex-1 text-sm font-medium">
                Provider: {provider === 'google' ? 'Google' : 'Microsoft'} Domains
              </div>
            </div>
            
            <div className="flex space-x-4 mb-4">
              <Button 
                variant={isManual ? "default" : "outline"} 
                onClick={() => setIsManual(true)}
                className="flex-1"
              >
                Manual Entry
              </Button>
              <Button 
                variant={!isManual ? "default" : "outline"} 
                onClick={() => setIsManual(false)}
                className="flex-1"
              >
                CSV Upload
              </Button>
            </div>

            {isManual ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="domain">Domain Name</Label>
                  <Input
                    id="domain"
                    placeholder="example.com"
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="url">Forwarding URL (must include https://)</Label>
                  <Input
                    id="url"
                    placeholder="https://example.com"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="border-2 border-dashed rounded-md p-6 text-center cursor-pointer bg-background hover:bg-accent/50 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="h-10 w-10 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground mb-1">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-muted-foreground">
                    CSV file with domain and forwarding URL columns
                  </p>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept=".csv"
                    className="hidden"
                  />
                </div>

                {csvDomains.length > 0 && (
                  <>
                    {exceedsAvailableSlots && (
                      <Alert className="bg-yellow-900/30 border-yellow-400/30 text-yellow-400">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                          You're trying to import {validCsvDomains.length} domains but only have {availableDomainSlots} slots available.
                          Please remove {validCsvDomains.length - availableDomainSlots} domains or upgrade your subscription.
                        </AlertDescription>
                      </Alert>
                    )}

                    <div className="border rounded-md overflow-hidden">
                      <table className="w-full">
                        <thead className="bg-muted/50">
                          <tr>
                            <th className="text-xs font-medium text-left p-2">Domain</th>
                            <th className="text-xs font-medium text-left p-2">URL</th>
                            <th className="text-xs font-medium text-center p-2">Status</th>
                            <th className="text-xs font-medium text-right p-2">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {csvDomains.map((entry, index) => (
                            <tr key={index} className={`border-t ${!entry.valid ? 'bg-destructive/10' : ''}`}>
                              <td className="p-2 text-sm">{entry.domain}</td>
                              <td className="p-2 text-sm">{entry.url}</td>
                              <td className="p-2 text-center">
                                {entry.valid ? (
                                  <span className="px-2 py-1 rounded text-xs bg-green-900/30 text-green-400">Valid</span>
                                ) : (
                                  <span className="px-2 py-1 rounded text-xs bg-red-900/30 text-red-400 flex items-center gap-1 justify-center">
                                    <AlertCircle className="h-3 w-3" />
                                    {entry.error}
                                  </span>
                                )}
                              </td>
                              <td className="p-2 text-right">
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={() => removeCsvDomain(index)}
                                  className="h-7 w-7 p-0"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </>
                )}
              </div>
            )}
          </>
        )}

        <DialogFooter className="flex justify-between items-center">
          {step === 'provider' ? (
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
          ) : (
            <>
              <div className="text-sm text-muted-foreground">
                {isManual 
                  ? "1 domain will be imported"
                  : <>
                      <span className={`${exceedsAvailableSlots ? 'text-yellow-400' : ''}`}>
                        {validCsvDomains.length} valid domains out of {csvDomains.length} total
                        {exceedsAvailableSlots && ` (exceeds ${availableDomainSlots} available slots)`}
                      </span>
                    </>
                }
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => onOpenChange(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={isManual ? handleManualSubmit : handleCsvSubmit}
                  disabled={!isManual && (validCsvDomains.length === 0 || exceedsAvailableSlots)}
                  className={exceedsAvailableSlots ? 'bg-yellow-600 hover:bg-yellow-700' : ''}
                >
                  Import Domains
                </Button>
              </div>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ImportDomainModal;
