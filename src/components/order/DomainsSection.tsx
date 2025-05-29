
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Upload, X } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

interface Domain {
  id: number;
  domain: string;
  forwardingUrl: string;
  displayNames: string[];
  selected?: boolean;
}

interface DomainsSectionProps {
  domains: Domain[];
  setDomains: React.Dispatch<React.SetStateAction<Domain[]>>;
  newDomain: string;
  setNewDomain: React.Dispatch<React.SetStateAction<string>>;
  mainForwardingUrl: string;
  setMainForwardingUrl: React.Dispatch<React.SetStateAction<string>>;
  domainRegistrar: string;
  setDomainRegistrar: React.Dispatch<React.SetStateAction<string>>;
  domainRegistrarLogin: string;
  setDomainRegistrarLogin: React.Dispatch<React.SetStateAction<string>>;
  domainRegistrarPassword: string;
  setDomainRegistrarPassword: React.Dispatch<React.SetStateAction<string>>;
  customDomainRegistrar: string;
  setCustomDomainRegistrar: React.Dispatch<React.SetStateAction<string>>;
}

const DomainsSection: React.FC<DomainsSectionProps> = ({
  domains,
  setDomains,
  newDomain,
  setNewDomain,
  mainForwardingUrl,
  setMainForwardingUrl,
  domainRegistrar,
  setDomainRegistrar,
  domainRegistrarLogin,
  setDomainRegistrarLogin,
  domainRegistrarPassword,
  setDomainRegistrarPassword,
  customDomainRegistrar,
  setCustomDomainRegistrar,
}) => {
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

  const handleDeleteSelected = () => {
    const selectedCount = domains.filter(domain => domain.selected).length;
    if (selectedCount === 0) {
      toast.error('Please select at least one domain to delete');
      return;
    }
    setDomains(domains.filter(domain => !domain.selected));
    toast.success(`Deleted ${selectedCount} domain(s)`);
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

  const selectedCount = domains.filter(domain => domain.selected).length;

  return (
    <div className="bg-[#1A1A1A] rounded-lg border border-[#333] p-6">
      <h2 className="text-xl font-bold mb-6 text-white">Domains</h2>
      
      <div className="space-y-8">
        <div>
          <Label htmlFor="mainForwardingUrl" className="block text-sm font-medium mb-2 text-gray-300">Main Forwarding URL</Label>
          <p className="text-sm text-gray-500 mb-3">The primary website your domains will forward to</p>
          <Input 
            id="mainForwardingUrl" 
            type="text" 
            className="bg-[#1E1E1E] border-[#444] text-white placeholder:text-gray-500 rounded-md shadow-[inset_0_0_0_1px_#333]" 
            value={mainForwardingUrl} 
            onChange={e => setMainForwardingUrl(e.target.value)} 
            placeholder="https://example.com" 
          />
        </div>

        <div>
          <Label htmlFor="domainRegistrar" className="block text-sm font-medium mb-2 text-gray-300">Domain Registrar</Label>
          <p className="text-sm text-gray-500 mb-3">E.g. GoDaddy</p>
          <div className="flex gap-3">
            <Select value={domainRegistrar} onValueChange={setDomainRegistrar}>
              <SelectTrigger className="bg-[#1E1E1E] border-[#444] text-white rounded-md shadow-[inset_0_0_0_1px_#333]">
                <SelectValue placeholder="Select registrar" />
              </SelectTrigger>
              <SelectContent className="bg-[#1A1A1A] border-[#444] z-50">
                <SelectItem value="godaddy">GoDaddy</SelectItem>
                <SelectItem value="namecheap">Namecheap</SelectItem>
                <SelectItem value="cloudflare">Cloudflare</SelectItem>
                <SelectItem value="google">Google Domains</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            {domainRegistrar === 'other' && (
              <Input 
                type="text" 
                className="bg-[#1E1E1E] border-[#444] text-white placeholder:text-gray-500 rounded-md shadow-[inset_0_0_0_1px_#333]" 
                value={customDomainRegistrar} 
                onChange={e => setCustomDomainRegistrar(e.target.value)} 
                placeholder="Specify Domain Registrar" 
              />
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="domainRegistrarLogin" className="block text-sm font-medium mb-2 text-gray-300">Domain Registrar Login</Label>
            <Input 
              id="domainRegistrarLogin" 
              type="text" 
              className="bg-[#1E1E1E] border-[#444] text-white placeholder:text-gray-500 rounded-md shadow-[inset_0_0_0_1px_#333]" 
              value={domainRegistrarLogin} 
              onChange={e => setDomainRegistrarLogin(e.target.value)} 
              placeholder="username@example.com" 
            />
          </div>
          <div>
            <Label htmlFor="domainRegistrarPassword" className="block text-sm font-medium mb-2 text-gray-300">Domain Registrar Password</Label>
            <Input 
              id="domainRegistrarPassword" 
              type="password" 
              className="bg-[#1E1E1E] border-[#444] text-white placeholder:text-gray-500 rounded-md shadow-[inset_0_0_0_1px_#333]" 
              value={domainRegistrarPassword} 
              onChange={e => setDomainRegistrarPassword(e.target.value)} 
              placeholder="••••••••" 
            />
          </div>
        </div>
        
        {/* Enhanced Domain Entry Section */}
        <div className="bg-[#151515] rounded-lg p-4 border border-[#2A2A2A]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="addDomain" className="block text-sm font-medium mb-2 text-gray-300">Add Domain to list</Label>
              <div className="flex gap-3">
                <Input 
                  id="addDomain" 
                  type="text" 
                  className="bg-[#1E1E1E] border-[#444] text-white placeholder:text-gray-500 rounded-md shadow-[inset_0_0_0_1px_#333] focus:border-[#E00000] focus:shadow-[0_0_0_1px_#E00000]" 
                  value={newDomain} 
                  onChange={e => setNewDomain(e.target.value)} 
                  placeholder="Enter domain" 
                />
                <Button 
                  variant="outline" 
                  className="bg-[#E00000] border-[#E00000] text-white hover:bg-[#CC0000] hover:border-[#CC0000] rounded-md px-4 min-w-[44px]" 
                  onClick={handleAddDomain}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div>
              <Label htmlFor="csvUpload" className="block text-sm font-medium mb-2 text-gray-300">Upload CSV with Domains</Label>
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
                  className="w-full bg-[#1E1E1E] border-[#444] border-dashed text-white hover:bg-[#2A2A2A] hover:border-[#555] rounded-md py-2.5 shadow-[inset_0_0_0_1px_#333]" 
                  onClick={() => document.getElementById('csvUpload')?.click()}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Click to upload a CSV
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {domains.length > 0 && (
        <div className="mt-6 overflow-hidden rounded-md border border-[#444]">
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
                <TableHead className="w-16 px-1 text-gray-300 font-medium">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleDeleteSelected}
                    disabled={selectedCount === 0}
                    className="text-red-400 hover:text-red-300 hover:bg-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Delete
                  </Button>
                </TableHead>
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
  );
};

export default DomainsSection;
