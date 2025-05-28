import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Settings, AlertTriangle, ArrowLeftRight } from 'lucide-react';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { useOrders } from '@/contexts/OrderContext';
import ImportDomainModal from '@/components/domain/ImportDomainModal';
import SwapDomainModal from '@/components/domain/SwapDomainModal';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';

const DomainsPage = () => {
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isSwapModalOpen, setIsSwapModalOpen] = useState(false);
  const [selectedDomainForSwap, setSelectedDomainForSwap] = useState<any>(null);
  const { subscriptions } = useSubscription();
  const { orders } = useOrders();
  const { toast } = useToast();
  
  // Sample data - in a real app this would be fetched from your backend
  const [domains, setDomains] = useState([
    {
      id: 1,
      domain: 'example.com',
      url: 'https://example.com',
      status: 'Active',
      provider: 'Google'
    },
    {
      id: 2,
      domain: 'test.org',
      url: 'https://test.org',
      status: 'Pending',
      provider: 'Microsoft'
    }
  ]);

  // Calculate available domain slots from all active subscriptions
  const availableDomainSlots = subscriptions
    .filter(sub => sub.status === 'active')
    .reduce((total, sub) => total + (sub.availableDomainSlots || 0), 0);

  const handleImportDomains = (newDomains: Array<{ domain: string; url: string }>) => {
    // In a real application, you would send this data to your backend API
    const domainsToAdd = newDomains.map((domainData, index) => ({
      id: Math.max(0, ...domains.map(d => d.id)) + index + 1,
      domain: domainData.domain,
      url: domainData.url,
      status: 'Pending',
      provider: 'Google' // Default provider for imported domains
    }));

    setDomains(prev => [...prev, ...domainsToAdd]);
    
    toast({
      title: "Domains Imported",
      description: `Successfully imported ${newDomains.length} domain${newDomains.length > 1 ? 's' : ''}.`,
    });
  };

  const handleSwapDomain = (domainData: { domain: string; provider: 'google' | 'microsoft' }) => {
    // Update the selected domain with new domain name (keeping the same provider)
    setDomains(prev => prev.map(domain => 
      domain.id === selectedDomainForSwap?.id 
        ? { ...domain, domain: domainData.domain }
        : domain
    ));
    
    toast({
      title: "Domain Updated",
      description: `Successfully updated domain to ${domainData.domain}.`,
    });
  };

  const openSwapModal = (domain: any) => {
    setSelectedDomainForSwap(domain);
    setIsSwapModalOpen(true);
  };

  const getProviderBadge = (provider: string) => {
    const isGoogle = provider === 'Google';
    return (
      <span className={`px-2 py-1 rounded text-xs font-medium ${
        isGoogle 
          ? 'bg-blue-900/30 text-blue-400 border border-blue-400/30' 
          : 'bg-orange-900/30 text-orange-400 border border-orange-400/30'
      }`}>
        {provider}
      </span>
    );
  };

  return (
    <MainLayout title="Manage Domains">
      <div className="flex items-center justify-between mb-8">
        <Button variant="outline" size="sm" className="bg-mailr-darkgray border-mailr-lightgray hover:bg-mailr-lightgray">
          <Settings className="h-4 w-4" />
        </Button>
        
        <div className="flex items-center gap-2">
          <span className={`text-sm ${availableDomainSlots === 0 ? 'text-red-400' : availableDomainSlots < 3 ? 'text-yellow-400' : 'text-muted-foreground'} mr-2 flex items-center gap-1`}>
            {availableDomainSlots === 0 && <AlertTriangle className="h-3 w-3" />}
            Available slots: {availableDomainSlots}
          </span>
          <Button 
            variant="default" 
            size="sm" 
            className="bg-mailr-red hover:bg-red-600"
            onClick={() => setIsImportModalOpen(true)}
            disabled={availableDomainSlots <= 0}
          >
            Import Domain
          </Button>
        </div>
      </div>
      
      {availableDomainSlots === 0 && (
        <Alert className="bg-red-900/30 border-red-400/30 text-red-400 mb-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            You have no domain slots available. Please upgrade your subscription to add more domains.
          </AlertDescription>
        </Alert>
      )}
      
      <div className="bg-mailr-darkgray rounded-md border border-mailr-lightgray overflow-hidden">
        <Table>
          <TableHeader className="bg-black/30">
            <TableRow className="hover:bg-transparent border-mailr-lightgray">
              <TableHead className="w-12">
                <Checkbox />
              </TableHead>
              <TableHead>Domain</TableHead>
              <TableHead>Forwarding URL</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Provider</TableHead>
              <TableHead className="w-20">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {domains.map((domain) => (
              <TableRow key={domain.id} className="hover:bg-mailr-lightgray/10 border-mailr-lightgray">
                <TableCell>
                  <Checkbox />
                </TableCell>
                <TableCell>{domain.domain}</TableCell>
                <TableCell>{domain.url}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded text-xs ${
                    domain.status === 'Active' ? 'bg-green-900/30 text-green-400' : 'bg-yellow-900/30 text-yellow-400'
                  }`}>
                    {domain.status}
                  </span>
                </TableCell>
                <TableCell>{getProviderBadge(domain.provider)}</TableCell>
                <TableCell>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => openSwapModal(domain)}
                    className="h-8 w-8 p-0"
                  >
                    <ArrowLeftRight className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <ImportDomainModal 
        open={isImportModalOpen} 
        onOpenChange={setIsImportModalOpen}
        onImport={handleImportDomains}
      />

      <SwapDomainModal 
        open={isSwapModalOpen} 
        onOpenChange={setIsSwapModalOpen}
        onSwap={handleSwapDomain}
        selectedDomain={selectedDomainForSwap}
      />
    </MainLayout>
  );
};

export default DomainsPage;
