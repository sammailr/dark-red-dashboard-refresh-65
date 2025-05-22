
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Plus, Upload, X } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogTrigger 
} from '@/components/ui/alert-dialog';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

interface Domain {
  id: number;
  domain: string;
  forwardingUrl: string;
  displayNames: string[];
}

const OrderInboxesPage = () => {
  // State management
  const [domains, setDomains] = useState<Domain[]>([]);
  const [newDomain, setNewDomain] = useState('');
  const [selectedSendingPlatform, setSelectedSendingPlatform] = useState<string | null>(null);
  const [customSendingPlatform, setCustomSendingPlatform] = useState('');
  const [sendingPlatformLogin, setSendingPlatformLogin] = useState('');
  const [sendingPlatformPassword, setSendingPlatformPassword] = useState('');
  const [newDisplayNameInputs, setNewDisplayNameInputs] = useState<{[key: number]: string}>({});
  
  // Handle adding a new domain
  const handleAddDomain = () => {
    if (!newDomain.trim()) {
      toast.error('Please enter a domain');
      return;
    }

    setDomains([
      ...domains,
      {
        id: Date.now(),
        domain: newDomain,
        forwardingUrl: '',
        displayNames: []
      }
    ]);
    setNewDomain('');
    toast.success(`Domain ${newDomain} added`);
  };

  // Handle removing a domain
  const handleRemoveDomain = (id: number) => {
    setDomains(domains.filter(domain => domain.id !== id));
    toast.success('Domain removed');
  };

  // Handle adding a display name
  const handleAddDisplayName = (domainId: number) => {
    const fullName = newDisplayNameInputs[domainId];
    if (!fullName || !fullName.trim()) {
      toast.error('Please enter a valid display name');
      return;
    }

    setDomains(prevDomains => 
      prevDomains.map(domain => 
        domain.id === domainId ? {
          ...domain,
          displayNames: [...domain.displayNames, fullName]
        } : domain
      )
    );

    // Clear the input field
    setNewDisplayNameInputs(prev => ({...prev, [domainId]: ''}));
    toast.success(`Added display name: ${fullName}`);
  };

  // Handle CSV upload
  const handleCSVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const lines = text.split('\n');
      
      const newDomains: Domain[] = [];
      lines.forEach(line => {
        const domain = line.trim();
        if (domain) {
          newDomains.push({
            id: Date.now() + newDomains.length,
            domain,
            forwardingUrl: '',
            displayNames: []
          });
        }
      });

      if (newDomains.length > 0) {
        setDomains([...domains, ...newDomains]);
        toast.success(`Added ${newDomains.length} domains from CSV`);
      }
    };
    reader.readAsText(file);
    
    // Reset the file input
    e.target.value = '';
  };

  // Handle updating forwarding URL
  const handleUpdateForwardingUrl = (domainId: number, url: string) => {
    setDomains(prevDomains => 
      prevDomains.map(domain => 
        domain.id === domainId ? {
          ...domain,
          forwardingUrl: url
        } : domain
      )
    );
  };

  // Handle deleting display name
  const handleDeleteDisplayName = (domainId: number, displayName: string) => {
    setDomains(prevDomains => 
      prevDomains.map(domain => 
        domain.id === domainId ? {
          ...domain,
          displayNames: domain.displayNames.filter(name => name !== displayName)
        } : domain
      )
    );
    toast.success(`Removed display name: ${displayName}`);
  };

  // Handle form submission
  const handleSubmit = () => {
    // Validate form
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

    if (!selectedSendingPlatform && !customSendingPlatform) {
      toast.error('Please select or enter a sending platform');
      return;
    }

    if (customSendingPlatform && (!sendingPlatformLogin || !sendingPlatformPassword)) {
      toast.error('Please provide login credentials for the custom sending platform');
      return;
    }

    // Submit form
    toast.success('Order submitted successfully');
  };

  return (
    <MainLayout title="Order Inboxes">
      <div className="space-y-8">
        {/* Domains Section */}
        <div className="bg-mailr-darkgray rounded-lg border border-mailr-lightgray p-6">
          <h2 className="text-xl font-semibold mb-4">Domains</h2>
          
          {/* Add Domain Row */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1">
              <Label htmlFor="addDomain" className="block text-sm mb-2">Add Domain to list:</Label>
              <div className="flex gap-2">
                <Input 
                  id="addDomain"
                  type="text" 
                  className="bg-mailr-darkgray border-mailr-lightgray"
                  value={newDomain}
                  onChange={(e) => setNewDomain(e.target.value)}
                  placeholder="Enter domain" 
                />
                <Button 
                  variant="outline" 
                  className="bg-mailr-darkgray border-mailr-lightgray hover:bg-mailr-lightgray"
                  onClick={handleAddDomain}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="flex-1">
              <Label htmlFor="csvUpload" className="block text-sm mb-2">Upload CSV with Domains:</Label>
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
                  className="w-full bg-mailr-darkgray border-mailr-lightgray border-dashed hover:bg-mailr-lightgray/10"
                  onClick={() => document.getElementById('csvUpload')?.click()}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Click to upload a CSV
                </Button>
              </div>
            </div>
          </div>
          
          {/* Domains Table */}
          {domains.length > 0 && (
            <div className="overflow-hidden rounded-md border border-mailr-lightgray">
              <Table>
                <TableHeader className="bg-black/30">
                  <TableRow className="hover:bg-transparent border-mailr-lightgray">
                    <TableHead className="w-12">
                      <Checkbox />
                    </TableHead>
                    <TableHead>Domain</TableHead>
                    <TableHead>Forwarding URL</TableHead>
                    <TableHead>Add Display Names</TableHead>
                    <TableHead>Display Names</TableHead>
                    <TableHead>Delete</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {domains.map((domain) => (
                    <TableRow key={domain.id} className="hover:bg-mailr-lightgray/10 border-mailr-lightgray">
                      <TableCell>
                        <Checkbox />
                      </TableCell>
                      <TableCell>{domain.domain}</TableCell>
                      <TableCell>
                        <Input 
                          type="text" 
                          className="bg-mailr-darkgray border-mailr-lightgray"
                          value={domain.forwardingUrl}
                          onChange={(e) => handleUpdateForwardingUrl(domain.id, e.target.value)}
                          placeholder="https://example.com" 
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex">
                          <Input 
                            type="text" 
                            className="bg-mailr-darkgray border border-mailr-lightgray rounded px-3 py-1 mr-2"
                            placeholder="John Smith" 
                            value={newDisplayNameInputs[domain.id] || ''}
                            onChange={(e) => setNewDisplayNameInputs({...newDisplayNameInputs, [domain.id]: e.target.value})}
                          />
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleAddDisplayName(domain.id)}
                            className="h-9 w-9 bg-mailr-lightgray/20"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-2">
                          {domain.displayNames.map((name, idx) => (
                            <div key={idx} className="flex justify-between items-center">
                              <div>{name}</div>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => handleDeleteDisplayName(domain.id, name)}
                                className="text-mailr-red hover:text-red-400 hover:bg-transparent p-0"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleRemoveDomain(domain.id)}
                          className="text-mailr-red hover:text-red-400 hover:bg-transparent"
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
        <div className="bg-mailr-darkgray rounded-lg border border-mailr-lightgray p-6">
          <h2 className="text-xl font-semibold mb-4">Sending Platform</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="sendingPlatform" className="block text-sm mb-2">Sending Platform:</Label>
              <Select onValueChange={setSelectedSendingPlatform}>
                <SelectTrigger className="w-full bg-mailr-darkgray border-mailr-lightgray">
                  <SelectValue placeholder="Choose Sending Platform" />
                </SelectTrigger>
                <SelectContent className="bg-mailr-darkgray border-mailr-lightgray">
                  <SelectItem value="platform1">Platform 1</SelectItem>
                  <SelectItem value="platform2">Platform 2</SelectItem>
                  <SelectItem value="platform3">Platform 3</SelectItem>
                  <SelectItem value="custom">Custom Platform</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {selectedSendingPlatform === 'custom' && (
              <>
                <div>
                  <Label htmlFor="customPlatform" className="block text-sm mb-2">Custom Platform Name:</Label>
                  <Input 
                    id="customPlatform"
                    type="text" 
                    className="bg-mailr-darkgray border-mailr-lightgray"
                    value={customSendingPlatform}
                    onChange={(e) => setCustomSendingPlatform(e.target.value)}
                    placeholder="Enter platform name" 
                  />
                </div>
                <div>
                  <Label htmlFor="platformLogin" className="block text-sm mb-2">Sending Platform Login:</Label>
                  <Input 
                    id="platformLogin"
                    type="text" 
                    className="bg-mailr-darkgray border-mailr-lightgray"
                    value={sendingPlatformLogin}
                    onChange={(e) => setSendingPlatformLogin(e.target.value)}
                    placeholder="Enter login" 
                  />
                </div>
                <div>
                  <Label htmlFor="platformPassword" className="block text-sm mb-2">Sending Platform Password:</Label>
                  <Input 
                    id="platformPassword"
                    type="password" 
                    className="bg-mailr-darkgray border-mailr-lightgray"
                    value={sendingPlatformPassword}
                    onChange={(e) => setSendingPlatformPassword(e.target.value)}
                    placeholder="Enter password" 
                  />
                </div>
              </>
            )}
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
                  Are you sure you want to submit this order? This will create inboxes for all domains in the list.
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
    </MainLayout>
  );
};

export default OrderInboxesPage;
