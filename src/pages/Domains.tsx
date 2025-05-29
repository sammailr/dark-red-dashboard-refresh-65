import React, { useState, useMemo } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { AlertTriangle, Search, Filter, Download, ArrowLeftRight } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { useOrders } from '@/contexts/OrderContext';
import ImportDomainModal from '@/components/domain/ImportDomainModal';
import SwapDomainModal from '@/components/domain/SwapDomainModal';
import SwapConfirmationDialog from '@/components/domain/SwapConfirmationDialog';
import BulkUpdateModal from '@/components/domain/BulkUpdateModal';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useNavigate } from 'react-router-dom';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

const DomainsPage = () => {
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isSwapModalOpen, setIsSwapModalOpen] = useState(false);
  const [isSwapConfirmOpen, setIsSwapConfirmOpen] = useState(false);
  const [isBulkUpdateOpen, setIsBulkUpdateOpen] = useState(false);
  const [selectedDomainForSwap, setSelectedDomainForSwap] = useState<any>(null);
  const [selectedDomainIds, setSelectedDomainIds] = useState<number[]>([]);
  const [hoveredRowId, setHoveredRowId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [providerFilter, setProviderFilter] = useState<string>('all');
  
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
    },
    {
      id: 28,
      domain: 'blog.writer',
      url: 'https://blog.writer',
      status: 'Active',
      provider: 'Microsoft'
    },
    {
      id: 29,
      domain: 'social.network',
      url: 'https://social.network',
      status: 'Pending',
      provider: 'Google'
    },
    {
      id: 30,
      domain: 'fitness.gym',
      url: 'https://fitness.gym',
      status: 'Update Nameservers',
      provider: 'Microsoft'
    },
    {
      id: 31,
      domain: 'beauty.salon',
      url: 'https://beauty.salon',
      status: 'Active',
      provider: 'Google'
    },
    {
      id: 32,
      domain: 'pet.care',
      url: 'https://pet.care',
      status: 'Pending',
      provider: 'Microsoft'
    },
    {
      id: 33,
      domain: 'home.garden',
      url: 'https://home.garden',
      status: 'Active',
      provider: 'Google'
    },
    {
      id: 34,
      domain: 'hobby.craft',
      url: 'https://hobby.craft',
      status: 'Update Nameservers',
      provider: 'Microsoft'
    },
    {
      id: 35,
      domain: 'science.lab',
      url: 'https://science.lab',
      status: 'Active',
      provider: 'Google'
    },
    {
      id: 36,
      domain: 'history.museum',
      url: 'https://history.museum',
      status: 'Pending',
      provider: 'Microsoft'
    },
    {
      id: 37,
      domain: 'nature.wildlife',
      url: 'https://nature.wildlife',
      status: 'Active',
      provider: 'Google'
    },
    {
      id: 38,
      domain: 'space.cosmos',
      url: 'https://space.cosmos',
      status: 'Update Nameservers',
      provider: 'Microsoft'
    },
    {
      id: 39,
      domain: 'ocean.marine',
      url: 'https://ocean.marine',
      status: 'Active',
      provider: 'Google'
    },
    {
      id: 40,
      domain: 'mountain.hiking',
      url: 'https://mountain.hiking',
      status: 'Pending',
      provider: 'Microsoft'
    },
    {
      id: 41,
      domain: 'city.urban',
      url: 'https://city.urban',
      status: 'Active',
      provider: 'Google'
    },
    {
      id: 42,
      domain: 'country.rural',
      url: 'https://country.rural',
      status: 'Update Nameservers',
      provider: 'Microsoft'
    },
    {
      id: 43,
      domain: 'weather.forecast',
      url: 'https://weather.forecast',
      status: 'Active',
      provider: 'Google'
    },
    {
      id: 44,
      domain: 'climate.change',
      url: 'https://climate.change',
      status: 'Pending',
      provider: 'Microsoft'
    },
    {
      id: 45,
      domain: 'energy.renewable',
      url: 'https://energy.renewable',
      status: 'Active',
      provider: 'Google'
    },
    {
      id: 46,
      domain: 'transport.mobility',
      url: 'https://transport.mobility',
      status: 'Update Nameservers',
      provider: 'Microsoft'
    },
    {
      id: 47,
      domain: 'communication.network',
      url: 'https://communication.network',
      status: 'Active',
      provider: 'Google'
    },
    {
      id: 48,
      domain: 'innovation.future',
      url: 'https://innovation.future',
      status: 'Pending',
      provider: 'Microsoft'
    },
    {
      id: 49,
      domain: 'tradition.heritage',
      url: 'https://tradition.heritage',
      status: 'Active',
      provider: 'Google'
    },
    {
      id: 50,
      domain: 'culture.arts',
      url: 'https://culture.arts',
      status: 'Update Nameservers',
      provider: 'Microsoft'
    },
    {
      id: 51,
      domain: 'language.linguistics',
      url: 'https://language.linguistics',
      status: 'Active',
      provider: 'Google'
    },
    {
      id: 52,
      domain: 'literature.books',
      url: 'https://literature.books',
      status: 'Pending',
      provider: 'Microsoft'
    }
  ]);

  // Calculate available domain slots from all active subscriptions
  const availableDomainSlots = subscriptions.filter(sub => sub.status === 'active').reduce((total, sub) => total + (sub.availableDomainSlots || 0), 0);

  // Filter domains based on search term, status, and provider
  const filteredDomains = useMemo(() => {
    return domains.filter(domain => {
      const matchesSearch = domain.domain.toLowerCase().includes(searchTerm.toLowerCase()) ||
        domain.url.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || domain.status === statusFilter;
      const matchesProvider = providerFilter === 'all' || domain.provider === providerFilter;
      
      return matchesSearch && matchesStatus && matchesProvider;
    });
  }, [domains, searchTerm, statusFilter, providerFilter]);

  // Check if all filtered domains are selected
  const isAllSelected = filteredDomains.length > 0 && filteredDomains.every(domain => selectedDomainIds.includes(domain.id));

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedDomainIds(filteredDomains.map(domain => domain.id));
    } else {
      setSelectedDomainIds([]);
    }
  };

  const handleSelectDomain = (domainId: number, checked: boolean) => {
    if (checked) {
      setSelectedDomainIds(prev => [...prev, domainId]);
    } else {
      setSelectedDomainIds(prev => prev.filter(id => id !== domainId));
    }
  };

  const handleImportDomains = (newDomains: Array<{ domain: string; url: string; }>) => {
    // In a real application, you would send this data to your backend API
    const domainsToAdd = newDomains.map((domainData, index) => ({
      id: Math.max(0, ...domains.map(d => d.id)) + index + 1,
      domain: domainData.domain,
      url: domainData.url,
      status: 'Pending',
      provider: 'Google'
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
    navigate(`/nameserver-update/${selectedDomainForSwap?.id}`);
  };

  const handleNameserverClick = (domainId: number) => {
    navigate(`/nameserver-update/${domainId}`);
  };

  const handleBulkUpdate = (newUrl: string) => {
    setDomains(prev => prev.map(domain => 
      selectedDomainIds.includes(domain.id) 
        ? { ...domain, url: newUrl }
        : domain
    ));
    
    setSelectedDomainIds([]);
    setIsBulkUpdateOpen(false);
    
    toast({
      title: "Forwarding URLs Updated",
      description: `Successfully updated ${selectedDomainIds.length} domain${selectedDomainIds.length > 1 ? 's' : ''}.`
    });
  };

  const handleExport = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Domain,Forwarding URL,Status,Provider\n"
      + filteredDomains.map(domain => 
          `${domain.domain},${domain.url},${domain.status},${domain.provider}`
        ).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "domains.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Export Complete",
      description: "Domains have been exported to CSV file."
    });
  };

  const getProviderIcon = (provider: string) => {
    const isGoogle = provider === 'Google';
    return (
      <div className="w-6 h-6 flex items-center justify-center" title={provider}>
        {isGoogle ? (
          <i className="fa-brands fa-google text-white text-base"></i>
        ) : (
          <i className="fa-brands fa-microsoft text-white text-base"></i>
        )}
      </div>
    );
  };

  const getStatusBadge = (status: string) => {
    const statusStyles = {
      'Active': 'bg-green-500/20 text-green-400 border-green-500/30',
      'Pending': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      'Update Nameservers': 'bg-red-500/20 text-red-400 border-red-500/30'
    };
    
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border whitespace-nowrap ${statusStyles[status as keyof typeof statusStyles] || statusStyles.Pending}`}>
        {status}
      </span>
    );
  };

  return (
    <MainLayout title="Manage Domains">
      <div className="space-y-6">
        {/* Action Bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              size="sm" 
              className={`h-10 px-4 bg-[#1E1E1E] border-[#444] text-white rounded-md shadow-[inset_0_0_0_1px_#333] ${
                selectedDomainIds.length === 0 
                  ? 'opacity-50 cursor-not-allowed hover:bg-[#1E1E1E] hover:border-[#444]' 
                  : 'hover:bg-[#2A2A2A] hover:border-[#555]'
              }`}
              disabled={selectedDomainIds.length === 0}
              onClick={() => setIsBulkUpdateOpen(true)}
            >
              Bulk Update Forwarding URL
            </Button>
            
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="h-10 px-4 bg-[#1E1E1E] border-[#444] text-white hover:bg-[#2A2A2A] hover:border-[#555] rounded-md shadow-[inset_0_0_0_1px_#333]">
                  <Filter className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 bg-[#1a1a1a] border-[#333]">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-white mb-2 block">Status</label>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="bg-[#1a1a1a] border-[#333] text-white">
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#1a1a1a] border-[#333]">
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="Update Nameservers">Update Nameservers</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-white mb-2 block">Provider</label>
                    <Select value={providerFilter} onValueChange={setProviderFilter}>
                      <SelectTrigger className="bg-[#1a1a1a] border-[#333] text-white">
                        <SelectValue placeholder="Filter by provider" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#1a1a1a] border-[#333]">
                        <SelectItem value="all">All Providers</SelectItem>
                        <SelectItem value="Google">Google</SelectItem>
                        <SelectItem value="Microsoft">Microsoft</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search domains or URLs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-80 h-10 bg-[#1E1E1E] border-[#444] text-white placeholder:text-gray-500 focus:border-[#E00000] focus:ring-0 shadow-[inset_0_0_0_1px_#333]"
              />
            </div>
            
            {/* Export Button */}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-10 px-4 bg-[#1E1E1E] border-[#444] text-white hover:bg-[#2A2A2A] hover:border-[#555] rounded-md shadow-[inset_0_0_0_1px_#333]"
                >
                  <Download className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-[#1a1a1a] border-[#333]">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-white">Export Domains?</AlertDialogTitle>
                  <AlertDialogDescription className="text-gray-400">
                    This will download a CSV file containing all your filtered domains.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="bg-[#1a1a1a] border-[#333] text-white hover:bg-[#262626]">
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={handleExport}
                    className="bg-[#E00000] hover:bg-[#CC0000] text-white"
                  >
                    Export
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
        
        {/* Alert for no domain slots */}
        {availableDomainSlots === 0 && (
          <Alert className="bg-red-500/10 border-red-500/30 text-red-400">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              You have no domain slots available. Please upgrade your subscription to add more domains.
            </AlertDescription>
          </Alert>
        )}
        
        {/* Table Section with Enhanced Visual Polish */}
        <div className="bg-[#1a1a1a] rounded-lg border border-[#333] shadow-[0_0_0_1px_#222,0_1px_3px_rgba(0,0,0,0.3)] overflow-hidden">
          <Table>
            <TableHeader className="bg-[#1A1A1A] border-b border-[#2d2d2d]">
              <TableRow className="hover:bg-transparent border-b border-[#2A2A2A]">
                <TableHead className="w-12 px-4 py-4 text-center">
                  <div className="flex justify-center">
                    <Checkbox 
                      checked={isAllSelected}
                      onCheckedChange={handleSelectAll}
                      className="border-gray-500 data-[state=checked]:bg-[#E00000] data-[state=checked]:border-[#E00000]"
                    />
                  </div>
                </TableHead>
                <TableHead className="px-4 py-4 text-left text-xs font-bold text-gray-300 uppercase tracking-wider min-w-[200px]">Domain</TableHead>
                <TableHead className="px-4 py-4 text-left text-xs font-bold text-gray-300 uppercase tracking-wider min-w-[280px]">Forwarding URL</TableHead>
                <TableHead className="px-4 py-4 text-left text-xs font-bold text-gray-300 uppercase tracking-wider w-[140px]">Status</TableHead>
                <TableHead className="px-4 py-4 text-center text-xs font-bold text-gray-300 uppercase tracking-wider w-[80px]">Provider</TableHead>
                <TableHead className="px-4 py-4 text-center text-xs font-bold text-gray-300 uppercase tracking-wider w-[80px]">Swap</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDomains.map((domain, index) => (
                <TableRow 
                  key={domain.id} 
                  className={`
                    border-b border-[#2A2A2A] transition-all duration-200 cursor-pointer
                    ${index % 2 === 0 ? 'bg-[#121212]' : 'bg-[#161616]'}
                    hover:bg-[#1A1A1A] hover:border-[#333]
                  `}
                  onMouseEnter={() => setHoveredRowId(domain.id)}
                  onMouseLeave={() => setHoveredRowId(null)}
                >
                  <TableCell className="w-12 px-4 py-3">
                    <div className="flex justify-center">
                      <Checkbox 
                        checked={selectedDomainIds.includes(domain.id)}
                        onCheckedChange={(checked) => handleSelectDomain(domain.id, checked as boolean)}
                        className="border-gray-500 data-[state=checked]:bg-[#E00000] data-[state=checked]:border-[#E00000]"
                      />
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-3 font-medium text-white text-left min-w-[200px]">{domain.domain}</TableCell>
                  <TableCell className="px-4 py-3 text-gray-300 text-left min-w-[280px]">{domain.url}</TableCell>
                  <TableCell className="px-4 py-3 text-left w-[140px]">
                    {getStatusBadge(domain.status)}
                  </TableCell>
                  <TableCell className="px-4 py-3 w-[80px]">
                    <div className="flex justify-center items-center">
                      {getProviderIcon(domain.provider)}
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-3 w-[80px]">
                    <div className="flex justify-center">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            variant="ghost"
                            size="sm" 
                            onClick={() => openSwapConfirmation(domain)}
                            className="h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-[#2A2A2A] rounded-md"
                          >
                            <ArrowLeftRight className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent className="bg-[#1a1a1a] border-[#333] text-white">
                          Swap domain
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Modals */}
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

      <BulkUpdateModal
        open={isBulkUpdateOpen}
        onOpenChange={setIsBulkUpdateOpen}
        onUpdate={handleBulkUpdate}
        selectedCount={selectedDomainIds.length}
      />
    </MainLayout>
  );
};

export default DomainsPage;
