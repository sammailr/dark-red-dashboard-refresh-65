
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Plus, X } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import SendingPlatformSelect from '@/components/order/SendingPlatformSelect';
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
import { toast } from 'sonner';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';

interface DisplayName {
  fullName: string;
  emailPrefixes: string[];
}

interface Inbox {
  id: number;
  domain: string;
  displayNames: DisplayName[];
}

const OrderGoogleInboxesPage = () => {
  const [inboxes, setInboxes] = useState<Inbox[]>([
    {
      id: 1,
      domain: 'trygoogle.com',
      displayNames: []
    },
    {
      id: 2,
      domain: 'trygoogle2.com',
      displayNames: []
    }
  ]);

  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
  const [displayNameCount, setDisplayNameCount] = useState<number>(1);
  const [newDisplayNameInputs, setNewDisplayNameInputs] = useState<{[key: number]: string}>({});

  const handlePlatformSelect = (value: string) => {
    setSelectedPlatform(value);
  };

  const handleAddPlatform = () => {
    toast.info('Add new platform functionality to be implemented');
  };

  const handleDisplayNameCountChange = (value: string) => {
    setDisplayNameCount(parseInt(value));
  };

  const generateEmailPrefixes = (fullName: string): string[] => {
    if (!fullName || !fullName.trim()) return [];
    
    const nameParts = fullName.trim().split(' ');
    if (nameParts.length < 2) return [fullName.toLowerCase()];
    
    const firstName = nameParts[0].toLowerCase();
    const lastName = nameParts[nameParts.length - 1].toLowerCase();
    
    return [
      `${firstName}.${lastName}`,
      `${firstName}`,
      `${lastName}`
    ];
  };

  const handleAddDisplayName = (inboxId: number) => {
    const fullName = newDisplayNameInputs[inboxId];
    if (!fullName || !fullName.trim()) {
      toast.error('Please enter a valid full name');
      return;
    }

    setInboxes(prevInboxes => 
      prevInboxes.map(inbox => 
        inbox.id === inboxId ? {
          ...inbox,
          displayNames: [...inbox.displayNames, {
            fullName,
            emailPrefixes: generateEmailPrefixes(fullName)
          }]
        } : inbox
      )
    );

    // Clear the input field
    setNewDisplayNameInputs(prev => ({...prev, [inboxId]: ''}));
    toast.success(`Added display name: ${fullName}`);
  };

  const handleDeleteDisplayName = (inboxId: number, fullName: string) => {
    setInboxes(prevInboxes => 
      prevInboxes.map(inbox => 
        inbox.id === inboxId ? {
          ...inbox,
          displayNames: inbox.displayNames.filter(dn => dn.fullName !== fullName)
        } : inbox
      )
    );
    toast.success(`Removed display name: ${fullName}`);
  };

  const handleSubmit = () => {
    if (!selectedPlatform) {
      toast.error('Please select a sending platform first');
      return;
    }

    // Perform submission logic here
    toast.success(`Order submitted with platform: ${selectedPlatform}`);
  };

  return (
    <MainLayout title="Order Google Inboxes">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" className="bg-mailr-darkgray border-mailr-lightgray hover:bg-mailr-lightgray">
              <Plus className="h-4 w-4 mr-1" />
              Add Domain
            </Button>
            <Button variant="outline" size="sm" className="bg-mailr-darkgray border-mailr-lightgray hover:bg-mailr-lightgray">
              Bulk Add
            </Button>
            <Button variant="outline" size="sm" className="bg-mailr-darkgray border-mailr-lightgray hover:bg-mailr-lightgray">
              Reset Names
            </Button>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <span className="text-sm text-gray-400 mr-2">Display names:</span>
              <Select 
                defaultValue="1"
                onValueChange={handleDisplayNameCountChange}
              >
                <SelectTrigger className="w-20 bg-mailr-darkgray border-mailr-lightgray">
                  <SelectValue placeholder="Count" />
                </SelectTrigger>
                <SelectContent className="bg-mailr-darkgray border-mailr-lightgray">
                  {[1, 2, 3, 4, 5].map(count => (
                    <SelectItem key={count} value={count.toString()}>
                      {count}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-400">Sending platform:</span>
              <SendingPlatformSelect 
                onSelect={handlePlatformSelect}
                onAddNew={handleAddPlatform}
              />
            </div>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="default" size="sm" className="bg-mailr-red hover:bg-red-600">
                  Submit
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirm Google Order Submission</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to submit this Google order with the selected sending platform?
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
        
        <div className="bg-mailr-darkgray rounded-md border border-mailr-lightgray overflow-hidden">
          <Table>
            <TableHeader className="bg-black/30">
              <TableRow className="hover:bg-transparent border-mailr-lightgray">
                <TableHead className="w-12">
                  <Checkbox />
                </TableHead>
                <TableHead>Domain</TableHead>
                <TableHead>Add display name's</TableHead>
                <TableHead>Display name's</TableHead>
                <TableHead>Delete</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inboxes.map((inbox) => (
                <TableRow key={inbox.id} className="hover:bg-mailr-lightgray/10 border-mailr-lightgray">
                  <TableCell>
                    <Checkbox />
                  </TableCell>
                  <TableCell>{inbox.domain}</TableCell>
                  <TableCell>
                    <div className="flex">
                      <Input 
                        type="text" 
                        className="bg-mailr-darkgray border border-mailr-lightgray rounded px-3 py-1 mr-2"
                        placeholder="John Smith" 
                        value={newDisplayNameInputs[inbox.id] || ''}
                        onChange={(e) => setNewDisplayNameInputs({...newDisplayNameInputs, [inbox.id]: e.target.value})}
                      />
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleAddDisplayName(inbox.id)}
                        className="h-9 w-9 bg-mailr-lightgray/20"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-2">
                      {inbox.displayNames.slice(0, displayNameCount).map((displayName, index) => (
                        <div key={index} className="flex flex-col">
                          <div className="font-medium">{displayName.fullName}</div>
                          <div className="text-xs text-gray-400">
                            {displayName.emailPrefixes.map(prefix => `${prefix}@${inbox.domain}`).join(', ')}
                          </div>
                        </div>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-2">
                      {inbox.displayNames.slice(0, displayNameCount).map((displayName, index) => (
                        <Button 
                          key={index}
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleDeleteDisplayName(inbox.id, displayName.fullName)}
                          className="text-mailr-red hover:text-red-400 hover:bg-transparent p-0"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      ))}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </MainLayout>
  );
};

export default OrderGoogleInboxesPage;
