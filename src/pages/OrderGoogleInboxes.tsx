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
const OrderGoogleInboxesPage = () => {
  const [domains, setDomains] = useState<Domain[]>([]);
  const [newDomain, setNewDomain] = useState('');
  const [newDisplayNameInputs, setNewDisplayNameInputs] = useState<{
    [key: number]: string;
  }>({});
  const [bulkDisplayName, setBulkDisplayName] = useState('');
  const [bulkDisplayNames, setBulkDisplayNames] = useState<string[]>([]);
  const [selectedSendingPlatform, setSelectedSendingPlatform] = useState<string | null>(null);
  const [mainForwardingUrl, setMainForwardingUrl] = useState('');
  const [domainRegistrar, setDomainRegistrar] = useState('');
  const [domainRegistrarLogin, setDomainRegistrarLogin] = useState('');
  const [domainRegistrarPassword, setDomainRegistrarPassword] = useState('');
  const [customDomainRegistrar, setCustomDomainRegistrar] = useState('');
  const [numberOfInboxes, setNumberOfInboxes] = useState('');
  const [userFullName, setUserFullName] = useState('');
  const [preferredPassword, setPreferredPassword] = useState('');

  // Calculate total monthly cost
  const calculateTotalCost = () => {
    const domainsCount = domains.length;
    const inboxesCount = parseInt(numberOfInboxes) || 0;
    return domainsCount * inboxesCount * 1.50;
  };
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
    if (!numberOfInboxes) {
      toast.error('Please select number of inboxes per domain');
      return;
    }
    if (!userFullName.trim()) {
      toast.error('Please enter user full name');
      return;
    }
    if (!preferredPassword.trim()) {
      toast.error('Please enter preferred inboxes password');
      return;
    }
    toast.success('Order submitted successfully');
  };
  return <MainLayout title="Order Google Inboxes">
      <div className="space-y-6">
        {/* Total Monthly Cost Section */}
        <div className="bg-mailr-darkgray rounded-lg border border-mailr-lightgray p-4">
          <h2 className="text-xl font-semibold mb-2">Order Summary</h2>
          <p className="text-lg">
            Total Monthly Cost: <span className="font-bold text-slate-50">${calculateTotalCost().toLocaleString()}/month</span>
          </p>
          
          {/* Pricing Breakdown */}
          <div className="mt-4 pt-4 border-t border-mailr-lightgray">
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-300 mb-3">Pricing Breakdown</h3>
            <div className="space-y-2">
              <div className="text-sm text-gray-400">
                1–99 inboxes: <span className="font-semibold text-white">$2.50</span> each
              </div>
              <div className="text-sm text-gray-400">
                100–299 inboxes: <span className="font-semibold text-white">$2.25</span> each
              </div>
              <div className="text-sm text-gray-400">
                300+ inboxes: <span className="font-semibold text-white">$2.00</span> each
              </div>
            </div>
          </div>
        </div>

        <div className="bg-mailr-darkgray rounded-lg border border-mailr-lightgray p-6">
          
          
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Domains</h2>
          </div>
          
          <div className="space-y-4 mb-6">
            <div>
              <Label htmlFor="mainForwardingUrl" className="block text-sm mb-2">Main ForwardingURL</Label>
              <p className="text-sm text-gray-400 mb-2">The primary website your domains will forward to</p>
              <Input id="mainForwardingUrl" type="text" className="bg-mailr-darkgray border-mailr-lightgray" value={mainForwardingUrl} onChange={e => setMainForwardingUrl(e.target.value)} placeholder="https://example.com" />
            </div>

            <div>
              <Label htmlFor="domainRegistrar" className="block text-sm mb-2">Domain Registrar:</Label>
              <p className="text-sm text-gray-400 mb-2">E.g. GoDaddy</p>
              <div className="flex gap-2">
                <Select value={domainRegistrar} onValueChange={setDomainRegistrar}>
                  <SelectTrigger className="bg-mailr-darkgray border-mailr-lightgray">
                    <SelectValue placeholder="Select registrar" />
                  </SelectTrigger>
                  <SelectContent className="bg-mailr-darkgray border-mailr-lightgray">
                    <SelectItem value="godaddy">GoDaddy</SelectItem>
                    <SelectItem value="namecheap">Namecheap</SelectItem>
                    <SelectItem value="cloudflare">Cloudflare</SelectItem>
                    <SelectItem value="google">Google Domains</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                {domainRegistrar === 'other' && <Input type="text" className="bg-mailr-darkgray border-mailr-lightgray" value={customDomainRegistrar} onChange={e => setCustomDomainRegistrar(e.target.value)} placeholder="Specify Domain Registrar" />}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="domainRegistrarLogin" className="block text-sm mb-2">Domain Registrar Login:</Label>
                <Input id="domainRegistrarLogin" type="text" className="bg-mailr-darkgray border-mailr-lightgray" value={domainRegistrarLogin} onChange={e => setDomainRegistrarLogin(e.target.value)} placeholder="username@example.com" />
              </div>
              <div>
                <Label htmlFor="domainRegistrarPassword" className="block text-sm mb-2">Domain Registrar Password:</Label>
                <Input id="domainRegistrarPassword" type="password" className="bg-mailr-darkgray border-mailr-lightgray" value={domainRegistrarPassword} onChange={e => setDomainRegistrarPassword(e.target.value)} placeholder="••••••••" />
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <Label htmlFor="addDomain" className="block text-sm mb-2">Add Domain to list:</Label>
                <div className="flex gap-2">
                  <Input id="addDomain" type="text" className="bg-mailr-darkgray border-mailr-lightgray" value={newDomain} onChange={e => setNewDomain(e.target.value)} placeholder="Enter domain" />
                  <Button variant="outline" className="bg-mailr-darkgray border-mailr-lightgray hover:bg-mailr-lightgray" onClick={handleAddDomain}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="flex-1">
                <Label htmlFor="csvUpload" className="block text-sm mb-2">Upload CSV with Domains:</Label>
                <div className="relative">
                  <Input id="csvUpload" type="file" accept=".csv" className="hidden" onChange={handleCSVUpload} />
                  <Button variant="outline" className="w-full bg-mailr-darkgray border-mailr-lightgray border-dashed hover:bg-mailr-lightgray/10" onClick={() => document.getElementById('csvUpload')?.click()}>
                    <Upload className="h-4 w-4 mr-2" />
                    Click to upload a CSV
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          {domains.length > 0 && <div className="overflow-hidden rounded-md border border-mailr-lightgray">
              <Table>
                <TableHeader className="bg-black/30">
                  <TableRow className="hover:bg-transparent border-mailr-lightgray">
                    <TableHead className="w-12">
                      <Checkbox checked={domains.length > 0 && domains.every(d => d.selected)} onCheckedChange={checked => toggleAllDomains(!!checked)} />
                    </TableHead>
                    <TableHead className="px-1">Domain</TableHead>
                    <TableHead className="w-16 px-1">Delete</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {domains.map(domain => <TableRow key={domain.id} className="hover:bg-mailr-lightgray/10 border-mailr-lightgray">
                      <TableCell>
                        <Checkbox checked={domain.selected} onCheckedChange={() => toggleDomainSelection(domain.id)} />
                      </TableCell>
                      <TableCell className="px-1">{domain.domain}</TableCell>
                      <TableCell className="px-1">
                        <Button variant="ghost" size="sm" onClick={() => handleRemoveDomain(domain.id)} className="text-mailr-red hover:text-red-400 hover:bg-transparent">
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>)}
                </TableBody>
              </Table>
            </div>}
        </div>
        
        <div className="bg-mailr-darkgray rounded-lg border border-mailr-lightgray p-6">
          <h2 className="text-xl font-semibold mb-4">Inboxes</h2>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="numberOfInboxes" className="block text-sm mb-2">Number of Inboxes per Domain:</Label>
              <Select value={numberOfInboxes} onValueChange={setNumberOfInboxes}>
                <SelectTrigger className="bg-mailr-darkgray border-mailr-lightgray">
                  <SelectValue placeholder="Select number of inboxes" />
                </SelectTrigger>
                <SelectContent className="bg-mailr-darkgray border-mailr-lightgray">
                  <SelectItem value="1">1</SelectItem>
                  <SelectItem value="2">2</SelectItem>
                  <SelectItem value="3">3</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="userFullName" className="block text-sm mb-2">User Full Name:</Label>
                <p className="text-sm text-gray-400 mb-2">E.g. John Smith</p>
                <Input id="userFullName" type="text" className="bg-mailr-darkgray border-mailr-lightgray" value={userFullName} onChange={e => setUserFullName(e.target.value)} placeholder="John Smith" />
              </div>
              <div>
                <Label htmlFor="preferredPassword" className="block text-sm mb-2">Preferred Inboxes Password:</Label>
                <p className="text-sm text-gray-400 mb-2">One Password to use on all mailboxes</p>
                <Input id="preferredPassword" type="password" className="bg-mailr-darkgray border-mailr-lightgray" value={preferredPassword} onChange={e => setPreferredPassword(e.target.value)} placeholder="••••••••" />
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-mailr-darkgray rounded-lg border border-mailr-lightgray p-6">
          <h2 className="text-xl font-semibold mb-4">Sending Platform</h2>
          
          <div className="grid grid-cols-1 gap-6">
            <div>
              <Label htmlFor="sendingPlatform" className="block text-sm mb-2">Sending Platform:</Label>
              <SendingPlatformSelect onSelect={value => setSelectedSendingPlatform(value)} onAddNew={() => toast.info('Add new platform functionality to be implemented')} />
            </div>
          </div>
        </div>
        
        <div className="flex justify-end">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="default" className="bg-mailr-red hover:bg-red-600">
                Order Inboxes
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirm Order Submission</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to submit this order? This will create Google inboxes for all domains in the list.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleSubmit}>Confirm</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </MainLayout>;
};
export default OrderGoogleInboxesPage;
