import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Plus, Upload, X, ChevronDown } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import SendingPlatformSelect from '@/components/order/SendingPlatformSelect';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from '@/components/ui/scroll-area';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface Domain {
  id: number;
  domain: string;
  forwardingUrl: string;
  displayNames: string[];
  selected?: boolean;
}

const OrderMicrosoftInboxesPage = () => {
  const [domains, setDomains] = useState<Domain[]>([]);
  const [newDomain, setNewDomain] = useState('');
  const [newDisplayNameInputs, setNewDisplayNameInputs] = useState<{
    [key: number]: string;
  }>({});
  const [bulkDisplayName, setBulkDisplayName] = useState('');
  const [bulkDisplayNames, setBulkDisplayNames] = useState<string[]>([]);
  const [selectedSendingPlatform, setSelectedSendingPlatform] = useState<string | null>(null);

  // Calculate total monthly cost
  const totalMonthlyCost = domains.length * 60;

  const handleAddDomain = () => {
    if (!newDomain.trim()) {
      toast.error('Please enter a domain');
      return;
    }
    setDomains([...domains, {
      id: Date.now(),
      domain: newDomain,
      forwardingUrl: '',
      displayNames: []
    }]);
    setNewDomain('');
    toast.success(`Domain ${newDomain} added`);
  };

  const handleRemoveDomain = (id: number) => {
    setDomains(domains.filter(domain => domain.id !== id));
    toast.success('Domain removed');
  };

  const handleAddDisplayName = (domainId: number) => {
    const fullName = newDisplayNameInputs[domainId];
    if (!fullName || !fullName.trim()) {
      toast.error('Please enter a valid display name');
      return;
    }
    setDomains(prevDomains => prevDomains.map(domain => domain.id === domainId ? {
      ...domain,
      displayNames: [...domain.displayNames, fullName]
    } : domain));
    setNewDisplayNameInputs(prev => ({
      ...prev,
      [domainId]: ''
    }));
    toast.success(`Added display name: ${fullName}`);
  };

  const handleCSVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = event => {
      const text = event.target?.result as string;
      const lines = text.split('\n');
      const newDomains: Domain[] = [];
      const startRow = lines[0].toLowerCase().includes('domain') || lines[0].toLowerCase().includes('forwarding') || lines[0].toLowerCase().includes('url') ? 1 : 0;
      for (let i = startRow; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        const parts = line.split(',');
        const domain = parts[0]?.trim();
        const forwardingUrl = parts[1]?.trim() || '';
        if (domain) {
          newDomains.push({
            id: Date.now() + newDomains.length,
            domain,
            forwardingUrl,
            displayNames: []
          });
        }
      }
      if (newDomains.length > 0) {
        setDomains([...domains, ...newDomains]);
        toast.success(`Added ${newDomains.length} domains from CSV`);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleUpdateForwardingUrl = (domainId: number, url: string) => {
    setDomains(prevDomains => prevDomains.map(domain => domain.id === domainId ? {
      ...domain,
      forwardingUrl: url
    } : domain));
  };

  const handleDeleteDisplayName = (domainId: number, displayName: string) => {
    setDomains(prevDomains => prevDomains.map(domain => domain.id === domainId ? {
      ...domain,
      displayNames: domain.displayNames.filter(name => name !== displayName)
    } : domain));
    toast.success(`Removed display name: ${displayName}`);
  };

  const handleAddBulkDisplayName = () => {
    if (!bulkDisplayName.trim()) {
      toast.error('Please enter a display name');
      return;
    }
    setBulkDisplayNames([...bulkDisplayNames, bulkDisplayName]);
    setBulkDisplayName('');
  };

  const handleRemoveBulkDisplayName = (name: string) => {
    setBulkDisplayNames(bulkDisplayNames.filter(n => n !== name));
  };

  const applyBulkDisplayNames = () => {
    if (bulkDisplayNames.length === 0) {
      toast.error('Please add at least one display name');
      return;
    }
    const selectedDomains = domains.filter(domain => domain.selected);
    if (selectedDomains.length === 0) {
      toast.error('Please select at least one domain');
      return;
    }
    setDomains(prevDomains => prevDomains.map(domain => domain.selected ? {
      ...domain,
      displayNames: [...new Set([...domain.displayNames, ...bulkDisplayNames])]
    } : domain));
    toast.success(`Added display names to ${selectedDomains.length} domains`);
  };

  const toggleDomainSelection = (domainId: number) => {
    setDomains(prevDomains => prevDomains.map(domain => domain.id === domainId ? {
      ...domain,
      selected: !domain.selected
    } : domain));
  };

  const toggleAllDomains = (selected: boolean) => {
    setDomains(prevDomains => prevDomains.map(domain => ({
      ...domain,
      selected
    })));
  };

  const resetDisplayNames = () => {
    const selectedCount = domains.filter(domain => domain.selected).length;
    if (selectedCount === 0) {
      toast.error('Please select at least one domain');
      return;
    }
    setDomains(prevDomains => prevDomains.map(domain => domain.selected ? {
      ...domain,
      displayNames: []
    } : domain));
    toast.success(`Reset display names for ${selectedCount} domains`);
  };

  const selectedCount = domains.filter(domain => domain.selected).length;

  const handleSubmit = () => {
    if (domains.length === 0) {
      toast.error('Please add at least one domain');
      return;
    }
    for (const domain of domains) {
      if (!domain.forwardingUrl) {
        toast.error(`Please provide a forwarding URL for domain ${domain.domain}`);
        return;
      }
      if (domain.displayNames.length === 0) {
        toast.error(`Please add at least one display name for domain ${domain.domain}`);
        return;
      }
    }
    if (!selectedSendingPlatform) {
      toast.error('Please select a sending platform');
      return;
    }
    toast.success('Order submitted successfully');
  };

  return (
    <MainLayout title="Order Microsoft Inboxes">
      <div className="space-y-8 max-w-6xl mx-auto">
        {/* Order Summary Section */}
        <div className="bg-[#1A1A1A] rounded-lg border border-[#333] p-6">
          <h2 className="text-xl font-bold mb-4 text-white">Order Summary</h2>
          <p className="text-lg font-medium text-white">
            Total Monthly Cost: <span className="font-bold text-white">${totalMonthlyCost.toLocaleString()}/month</span>
          </p>
          <p className="text-sm text-gray-400 mt-1">
            {domains.length} {domains.length === 1 ? 'domain' : 'domains'} × $60/month each
          </p>
        </div>

        {/* Domains Section */}
        <div className="bg-[#1A1A1A] rounded-lg border border-[#333] p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Domains</h2>
            
            <div className="flex gap-3 items-center">
              <Dialog>
                <DialogTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    disabled={selectedCount === 0} 
                    className={`bg-transparent border-[#444] text-white hover:bg-[#2A2A2A] rounded-md px-4 ${selectedCount === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    Bulk add names
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-[#1A1A1A] border-[#444]">
                  <DialogHeader>
                    <DialogTitle className="text-white">Enter individually, the display names you want to use:</DialogTitle>
                    <DialogDescription className="text-gray-400">Eg. John Smith</DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-4 mt-4">
                    <div className="flex gap-3">
                      <Input 
                        type="text" 
                        className="bg-[#101010] border-[#444] text-white placeholder:text-gray-500 rounded-md flex-1" 
                        placeholder="John Smith" 
                        value={bulkDisplayName} 
                        onChange={e => setBulkDisplayName(e.target.value)} 
                      />
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={handleAddBulkDisplayName} 
                        className="bg-transparent border-[#444] text-white hover:bg-[#2A2A2A] rounded-md"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    {bulkDisplayNames.length > 0 && (
                      <>
                        <div className="mt-4">
                          <h3 className="text-sm font-medium mb-2 text-gray-300">Display names to be added:</h3>
                          <div className="border rounded-md border-[#444] p-2 max-h-48 overflow-y-auto">
                            {bulkDisplayNames.map((name, index) => (
                              <div key={index} className="flex justify-between items-center py-2 border-b border-[#444] last:border-0">
                                <span className="text-white">{name}</span>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={() => handleRemoveBulkDisplayName(name)} 
                                  className="text-red-400 hover:text-red-300 hover:bg-transparent p-0"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <Button 
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-md" 
                          onClick={() => {
                            applyBulkDisplayNames();
                            document.querySelector('[data-radix-dialog-close]')?.dispatchEvent(new MouseEvent('click', {
                              bubbles: true
                            }));
                          }}
                        >
                          Add names
                        </Button>
                      </>
                    )}
                  </div>
                </DialogContent>
              </Dialog>
              
              <Button 
                variant="outline" 
                size="sm" 
                disabled={selectedCount === 0} 
                className={`bg-transparent border-[#444] text-white hover:bg-[#2A2A2A] rounded-md px-4 ${selectedCount === 0 ? 'opacity-50 cursor-not-allowed' : ''}`} 
                onClick={resetDisplayNames}
              >
                Reset names
              </Button>
            </div>
          </div>
          
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1">
              <Label htmlFor="addDomain" className="block text-sm font-medium mb-2 text-gray-300">Add Domain to list:</Label>
              <div className="flex gap-3">
                <Input 
                  id="addDomain" 
                  type="text" 
                  className="bg-[#101010] border-[#444] text-white placeholder:text-gray-500 rounded-md" 
                  value={newDomain} 
                  onChange={e => setNewDomain(e.target.value)} 
                  placeholder="Enter domain" 
                />
                <Button 
                  variant="outline" 
                  className="bg-transparent border-[#444] text-white hover:bg-[#2A2A2A] rounded-md px-4" 
                  onClick={handleAddDomain}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="flex-1">
              <Label htmlFor="csvUpload" className="block text-sm font-medium mb-2 text-gray-300">Upload CSV with Domains:</Label>
              <div className="relative">
                <Input 
                  id="csvUpload" 
                  type="file" 
                  accept=".csv" 
                  className="hidden" 
                  onChange={handleCSVUpload} 
                />
                <Button 
                  variant="outline" 
                  className="w-full bg-transparent border-[#444] border-dashed text-white hover:bg-[#2A2A2A] rounded-md py-2.5" 
                  onClick={() => document.getElementById('csvUpload')?.click()}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Click to upload a CSV
                </Button>
              </div>
            </div>
          </div>
          
          {domains.length > 0 && (
            <div className="overflow-hidden rounded-md border border-[#444]">
              <Table>
                <TableHeader className="bg-[#101010]">
                  <TableRow className="hover:bg-transparent border-[#444]">
                    <TableHead className="w-12">
                      <Checkbox 
                        checked={domains.length > 0 && domains.every(d => d.selected)} 
                        onCheckedChange={checked => toggleAllDomains(!!checked)} 
                      />
                    </TableHead>
                    <TableHead className="px-1 text-gray-300 font-medium">Domain</TableHead>
                    <TableHead className="px-1 text-gray-300 font-medium">Forwarding URL</TableHead>
                    <TableHead className="w-1/5 px-1 text-gray-300 font-medium">Add Display Names</TableHead>
                    <TableHead className="w-1/4 px-1 text-gray-300 font-medium">Display Names</TableHead>
                    <TableHead className="w-16 px-1 text-gray-300 font-medium">Delete</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {domains.map(domain => (
                    <TableRow key={domain.id} className="hover:bg-[#2A2A2A] border-[#444]">
                      <TableCell>
                        <Checkbox checked={domain.selected} onCheckedChange={() => toggleDomainSelection(domain.id)} />
                      </TableCell>
                      <TableCell className="px-1 text-white">{domain.domain}</TableCell>
                      <TableCell className="px-1">
                        <Input 
                          type="text" 
                          className="bg-[#101010] border-[#444] text-white placeholder:text-gray-500 rounded-md" 
                          value={domain.forwardingUrl} 
                          onChange={e => handleUpdateForwardingUrl(domain.id, e.target.value)} 
                          placeholder="https://example.com" 
                        />
                      </TableCell>
                      <TableCell className="px-1">
                        <div className="flex gap-2">
                          <Input 
                            type="text" 
                            className="bg-[#101010] border-[#444] text-white placeholder:text-gray-500 rounded-md flex-1" 
                            placeholder="John Smith" 
                            value={newDisplayNameInputs[domain.id] || ''} 
                            onChange={e => setNewDisplayNameInputs({
                              ...newDisplayNameInputs,
                              [domain.id]: e.target.value
                            })} 
                          />
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleAddDisplayName(domain.id)} 
                            className="bg-transparent border-[#444] text-white hover:bg-[#2A2A2A] rounded-md"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell className="px-1">
                        <div className="relative">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <div className="border border-[#444] rounded-md p-2 h-[40px] min-h-[40px] cursor-pointer flex justify-between items-center">
                                <div className="truncate max-w-[200px] text-white">
                                  {domain.displayNames.length > 0 ? (
                                    domain.displayNames.join(', ')
                                  ) : (
                                    <span className="text-gray-500">No display names</span>
                                  )}
                                </div>
                                <Button variant="ghost" size="sm" className="p-0 text-white">
                                  <ChevronDown className="h-4 w-4" />
                                </Button>
                              </div>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="bg-[#1A1A1A] border-[#444] min-w-[220px]" align="start">
                              <ScrollArea className="h-[200px] w-full p-2">
                                {domain.displayNames.length > 0 ? (
                                  <div className="space-y-2">
                                    {domain.displayNames.map((name, idx) => (
                                      <div key={idx} className="flex justify-between items-center">
                                        <div className="truncate max-w-[170px] text-white">{name}</div>
                                        <Button 
                                          variant="ghost" 
                                          size="sm" 
                                          onClick={() => handleDeleteDisplayName(domain.id, name)} 
                                          className="text-red-400 hover:text-red-300 hover:bg-transparent p-0"
                                        >
                                          <X className="h-4 w-4" />
                                        </Button>
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <div className="py-2 text-gray-500">No display names</div>
                                )}
                              </ScrollArea>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                      <TableCell className="px-1">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleRemoveDomain(domain.id)} 
                          className="text-red-400 hover:text-red-300 hover:bg-transparent"
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
        
        {/* Sending Platform Section */}
        <div className="bg-[#1A1A1A] rounded-lg border border-[#333] p-6">
          <h2 className="text-xl font-bold mb-6 text-white">Sending Platform</h2>
          
          <div>
            <Label htmlFor="sendingPlatform" className="block text-sm font-medium mb-2 text-gray-300">Sending Platform:</Label>
            <SendingPlatformSelect 
              onSelect={value => setSelectedSendingPlatform(value)} 
              onAddNew={() => toast.info('Add new platform functionality to be implemented')} 
            />
          </div>
        </div>
        
        {/* Submit Button */}
        <div className="flex justify-end">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button className="bg-[#E00000] hover:bg-[#CC0000] text-white font-bold px-6 py-3 rounded-md">
                Order Inboxes
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-[#1A1A1A] border-[#444]">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-white">Confirm Order Submission</AlertDialogTitle>
                <AlertDialogDescription className="text-gray-400">
                  Are you sure you want to submit this order? This will create Microsoft inboxes for all domains in the list.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="bg-transparent border-[#444] text-white hover:bg-[#2A2A2A]">Cancel</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={handleSubmit}
                  className="bg-[#E00000] hover:bg-[#CC0000] text-white"
                >
                  Confirm
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogFooter>
          </AlertDialog>
        </div>
      </div>
    </MainLayout>
  );
};

export default OrderMicrosoftInboxesPage;
