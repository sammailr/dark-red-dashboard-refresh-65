
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import SendingPlatformSelect from '@/components/order/SendingPlatformSelect';

const OrderInboxesPage = () => {
  // Sample data
  const inboxes = [
    {
      id: 1,
      domain: 'example.com',
      displayName: 'Example Domain'
    },
    {
      id: 2,
      domain: 'test.org',
      displayName: 'Test Organization'
    }
  ];

  const handlePlatformSelect = (value: string) => {
    console.log('Selected platform:', value);
  };

  const handleAddPlatform = () => {
    console.log('Add new platform clicked');
  };

  return (
    <MainLayout title="Order Inboxes">
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
          </div>
          
          <Button variant="default" size="sm" className="bg-mailr-red hover:bg-red-600">
            Submit
          </Button>
        </div>

        <SendingPlatformSelect 
          onSelect={handlePlatformSelect}
          onAddNew={handleAddPlatform}
        />
        
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
                    <input 
                      type="text" 
                      className="bg-mailr-darkgray border border-mailr-lightgray rounded px-3 py-1 w-full"
                      placeholder="Enter name" 
                    />
                  </TableCell>
                  <TableCell>{inbox.displayName}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" className="text-mailr-red hover:text-red-400 hover:bg-transparent">
                      Delete
                    </Button>
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

export default OrderInboxesPage;
