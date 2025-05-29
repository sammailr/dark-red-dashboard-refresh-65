import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Settings, AlertTriangle, ArrowLeftRight, Plus } from 'lucide-react';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { useOrders } from '@/contexts/OrderContext';
import ImportDomainModal from '@/components/domain/ImportDomainModal';
import SwapDomainModal from '@/components/domain/SwapDomainModal';
import SwapConfirmationDialog from '@/components/domain/SwapConfirmationDialog';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useNavigate } from 'react-router-dom';

const DomainsPage = () => {
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isSwapModalOpen, setIsSwapModalOpen] = useState(false);
  const [isSwapConfirmOpen, setIsSwapConfirmOpen] = useState(false);
  const [selectedDomainForSwap, setSelectedDomainForSwap] = useState<any>(null);
  const [newDomain, setNewDomain] = useState('');
  const [hoveredRowId, setHoveredRowId] = useState<number | null>(null);
  
  const navigate = useNavigate();
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
  const availableDomainSlots = subscriptions.filter(sub => sub.status === 'active').reduce((total, sub) => total + (sub.availableDomainSlots || 0), 0);

  const handleAddDomain = () => {
    if (!newDomain.trim()) {
      toast({
        title: "Error",
        description: "Please enter a domain name.",
        variant: "destructive"
      });
      return;
    }

    const domainToAdd = {
      id: Math.max(0, ...domains.map(d => d.id)) + 1,
      domain: newDomain,
      url: `https://${newDomain}`,
      status: 'Pending',
      provider: 'Google'
    };

    setDomains(prev => [...prev, domainToAdd]);
    setNewDomain('');
    toast({
      title: "Domain Added",
      description: `Successfully added ${newDomain}.`
    });
  };

  const handleImportDomains = (newDomains: Array<{ domain: string; url: string; }>) => {
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
      description: `Successfully imported ${newDomains.length} domain${newDomains.length > 1 ? 's' : ''}.`
    });
  };

  const handleSwapDomain = (domainData: { domain: string; provider: 'google' | 'microsoft'; }) => {
    // Update the selected domain with new domain name
    setDomains(prev => prev.map(domain => 
      domain.id === selectedDomainForSwap?.id 
        ? { ...domain, domain: domainData.domain, status: 'Update Nameservers' }
        : domain
    ));
    
    // Navigate to nameserver update page
    navigate(`/nameserver-update/${selectedDomainForSwap?.id}`);
  };

  const openSwapConfirmation = (domain: any) => {
    setSelectedDomainForSwap(domain);
    setIsSwapConfirmOpen(true);
  };

  const handleConfirmSwap = () => {
    setIsSwapConfirmOpen(false);
    setIsSwapModalOpen(true);
  };

  const handleNameserverClick = (domainId: number) => {
    navigate(`/nameserver-update/${domainId}`);
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

  const getStatusBadge = (status: string) => {
    const statusStyles = {
      'Active': 'bg-green-900/30 text-green-400',
      'Pending': 'bg-yellow-900/30 text-yellow-400',
      'Update Nameservers': 'bg-orange-900/30 text-orange-400 cursor-pointer hover:bg-orange-800/40'
    };
    
    return (
      <span className={`px-2 py-1 rounded text-xs ${statusStyles[status as keyof typeof statusStyles] || statusStyles.Pending}`}>
        {status}
      </span>
    );
  };

  return (
    <MainLayout title="Manage Domains">
      <div className="flex items-center justify-between mb-8">
        <Button variant="outline" size="sm" className="bg-mailr-darkgray border-mailr-lightgray hover:bg-mailr-lightgray">
          <Settings className="h-4 w-4" />
        </Button>
      </div>
      
      {availableDomainSlots === 0 && (
        <Alert className="bg-red-900/30 border-red-400/30 text-red-400 mb-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            You have no domain slots available. Please upgrade your subscription to add more domains.
          </AlertDescription>
        </Alert>
      )}

      {/* Add Domain Bar */}
      <div className="bg-mailr-darkgray rounded-md border border-mailr-lightgray p-4 mb-4">
        <div className="flex gap-3 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-2 text-gray-300">Add New Domain</label>
            <Input
              type="text"
              className="bg-[#1E1E1E] border-[#444] text-white placeholder:text-gray-500"
              value={newDomain}
              onChange={(e) => setNewDomain(e.target.value)}
              placeholder="Enter domain name"
            />
          </div>
          <Button 
            onClick={handleAddDomain}
            className="bg-[#E00000] hover:bg-[#CC0000] text-white"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
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
              <TableHead className="w-32">Swap Domain</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {domains.map(domain => (
              <TableRow 
                key={domain.id} 
                className="hover:bg-mailr-lightgray/10 border-mailr-lightgray relative"
                onMouseEnter={() => setHoveredRowId(domain.id)}
                onMouseLeave={() => setHoveredRowId(null)}
              >
                <TableCell>
                  <Checkbox />
                </TableCell>
                <TableCell>{domain.domain}</TableCell>
                <TableCell>{domain.url}</TableCell>
                <TableCell>
                  <div onClick={() => domain.status === 'Update Nameservers' ? handleNameserverClick(domain.id) : undefined}>
                    {getStatusBadge(domain.status)}
                  </div>
                </TableCell>
                <TableCell>{getProviderBadge(domain.provider)}</TableCell>
                <TableCell>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => openSwapConfirmation(domain)} 
                    className="h-8 w-8 p-0"
                  >
                    <ArrowLeftRight className="h-4 w-4" />
                  </Button>
                </TableCell>
                
                {/* Hover button for Update Nameservers status */}
                {hoveredRowId === domain.id && domain.status === 'Update Nameservers' && (
                  <TableCell className="absolute right-2 top-1/2 transform -translate-y-1/2">
                    <Button 
                      size="sm" 
                      onClick={() => handleNameserverClick(domain.id)}
                      className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-2 py-1"
                    >
                      View Instructions
                    </Button>
                  </TableCell>
                )}
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

      <SwapConfirmationDialog
        open={isSwapConfirmOpen}
        onOpenChange={setIsSwapConfirmOpen}
        onConfirm={handleConfirmSwap}
        domain={selectedDomainForSwap}
      />
    </MainLayout>
  );
};

export default DomainsPage;
