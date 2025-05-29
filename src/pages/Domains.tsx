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
import SwapConfirmationDialog from '@/components/domain/SwapConfirmationDialog';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useNavigate } from 'react-router-dom';

const DomainsPage = () => {
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isSwapModalOpen, setIsSwapModalOpen] = useState(false);
  const [isSwapConfirmOpen, setIsSwapConfirmOpen] = useState(false);
  const [selectedDomainForSwap, setSelectedDomainForSwap] = useState<any>(null);
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
    },
    {
      id: 3,
      domain: 'business.net',
      url: 'https://business.net',
      status: 'Active',
      provider: 'Google'
    },
    {
      id: 4,
      domain: 'startup.io',
      url: 'https://startup.io',
      status: 'Update Nameservers',
      provider: 'Microsoft'
    },
    {
      id: 5,
      domain: 'agency.co',
      url: 'https://agency.co',
      status: 'Pending',
      provider: 'Google'
    },
    {
      id: 6,
      domain: 'marketing.biz',
      url: 'https://marketing.biz',
      status: 'Active',
      provider: 'Microsoft'
    },
    {
      id: 7,
      domain: 'ecommerce.shop',
      url: 'https://ecommerce.shop',
      status: 'Active',
      provider: 'Google'
    },
    {
      id: 8,
      domain: 'consulting.pro',
      url: 'https://consulting.pro',
      status: 'Pending',
      provider: 'Microsoft'
    },
    {
      id: 9,
      domain: 'portfolio.me',
      url: 'https://portfolio.me',
      status: 'Update Nameservers',
      provider: 'Google'
    },
    {
      id: 10,
      domain: 'services.online',
      url: 'https://services.online',
      status: 'Active',
      provider: 'Microsoft'
    },
    {
      id: 11,
      domain: 'creative.design',
      url: 'https://creative.design',
      status: 'Pending',
      provider: 'Google'
    },
    {
      id: 12,
      domain: 'tech.dev',
      url: 'https://tech.dev',
      status: 'Active',
      provider: 'Microsoft'
    },
    {
      id: 13,
      domain: 'finance.money',
      url: 'https://finance.money',
      status: 'Update Nameservers',
      provider: 'Google'
    },
    {
      id: 14,
      domain: 'health.care',
      url: 'https://health.care',
      status: 'Active',
      provider: 'Microsoft'
    },
    {
      id: 15,
      domain: 'education.academy',
      url: 'https://education.academy',
      status: 'Pending',
      provider: 'Google'
    },
    {
      id: 16,
      domain: 'travel.guide',
      url: 'https://travel.guide',
      status: 'Active',
      provider: 'Microsoft'
    },
    {
      id: 17,
      domain: 'food.kitchen',
      url: 'https://food.kitchen',
      status: 'Update Nameservers',
      provider: 'Google'
    },
    {
      id: 18,
      domain: 'sports.team',
      url: 'https://sports.team',
      status: 'Active',
      provider: 'Microsoft'
    },
    {
      id: 19,
      domain: 'music.studio',
      url: 'https://music.studio',
      status: 'Pending',
      provider: 'Google'
    },
    {
      id: 20,
      domain: 'art.gallery',
      url: 'https://art.gallery',
      status: 'Active',
      provider: 'Microsoft'
    },
    {
      id: 21,
      domain: 'news.media',
      url: 'https://news.media',
      status: 'Update Nameservers',
      provider: 'Google'
    },
    {
      id: 22,
      domain: 'gaming.zone',
      url: 'https://gaming.zone',
      status: 'Active',
      provider: 'Microsoft'
    },
    {
      id: 23,
      domain: 'fashion.style',
      url: 'https://fashion.style',
      status: 'Pending',
      provider: 'Google'
    },
    {
      id: 24,
      domain: 'auto.motors',
      url: 'https://auto.motors',
      status: 'Active',
      provider: 'Microsoft'
    },
    {
      id: 25,
      domain: 'realestate.property',
      url: 'https://realestate.property',
      status: 'Update Nameservers',
      provider: 'Google'
    },
    {
      id: 26,
      domain: 'retail.store',
      url: 'https://retail.store',
      status: 'Active',
      provider: 'Microsoft'
    },
    {
      id: 27,
      domain: 'photography.pics',
      url: 'https://photography.pics',
      status: 'Pending',
      provider: 'Google'
    }
  ]);

  // Calculate available domain slots from all active subscriptions
  const availableDomainSlots = subscriptions.filter(sub => sub.status === 'active').reduce((total, sub) => total + (sub.availableDomainSlots || 0), 0);

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

  const handleConfirmSwap = (newDomain: string) => {
    // Update the selected domain with new domain name
    setDomains(prev => prev.map(domain => 
      domain.id === selectedDomainForSwap?.id 
        ? { ...domain, domain: newDomain, status: 'Update Nameservers' }
        : domain
    ));
    
    setIsSwapConfirmOpen(false);
    
    // Navigate to nameserver update page
    navigate(`/nameserver-update/${selectedDomainForSwap?.id}`);
  };

  const handleNameserverClick = (domainId: number) => {
    navigate(`/nameserver-update/${domainId}`);
  };

  const getProviderIcon = (provider: string) => {
    const isGoogle = provider === 'Google';
    return isGoogle ? (
      <i className="fa-brands fa-google text-blue-400"></i>
    ) : (
      <i className="fa-brands fa-microsoft text-orange-400"></i>
    );
  };

  const getStatusBadge = (status: string) => {
    const statusStyles = {
      'Active': 'bg-green-900/30 text-green-400',
      'Pending': 'bg-yellow-900/30 text-yellow-400',
      'Update Nameservers': 'bg-mailr-red hover:bg-red-700 text-white text-xs px-2 py-1'
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
                <TableCell>{getProviderIcon(domain.provider)}</TableCell>
                <TableCell>
                  {domain.provider === 'Microsoft' && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => openSwapConfirmation(domain)} 
                      className="h-8 w-8 p-0"
                    >
                      <ArrowLeftRight className="h-4 w-4" />
                    </Button>
                  )}
                </TableCell>
                
                {/* Hover button for Update Nameservers status */}
                {hoveredRowId === domain.id && domain.status === 'Update Nameservers' && (
                  <TableCell className="absolute right-2 top-1/2 transform -translate-y-1/2">
                    <Button 
                      size="sm" 
                      onClick={() => handleNameserverClick(domain.id)}
                      className="bg-mailr-red hover:bg-red-700 text-white text-xs px-2 py-1"
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
