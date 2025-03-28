
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const SendingPlatformPage = () => {
  // Sample data
  const platforms = [
    {
      id: 1,
      name: 'SendGrid',
      platform: 'Email API',
      domains: 5
    },
    {
      id: 2,
      name: 'Mailchimp',
      platform: 'Email Marketing',
      domains: 3
    }
  ];

  return (
    <MainLayout title="Sending Platform">
      <div className="flex items-center justify-between mb-8">
        <Button variant="ghost" size="sm" className="text-mailr-red hover:text-red-400 hover:bg-transparent">
          Delete
        </Button>
        
        <Button variant="default" size="sm" className="bg-mailr-red hover:bg-red-600">
          <Plus className="h-4 w-4 mr-1" />
          Add account
        </Button>
      </div>
      
      <div className="bg-mailr-darkgray rounded-md border border-mailr-lightgray overflow-hidden">
        <Table>
          <TableHeader className="bg-black/30">
            <TableRow className="hover:bg-transparent border-mailr-lightgray">
              <TableHead>Name</TableHead>
              <TableHead>Platform</TableHead>
              <TableHead className="text-right"># of Domains</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {platforms.map((platform) => (
              <TableRow key={platform.id} className="hover:bg-mailr-lightgray/10 border-mailr-lightgray">
                <TableCell>{platform.name}</TableCell>
                <TableCell>{platform.platform}</TableCell>
                <TableCell className="text-right">{platform.domains}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </MainLayout>
  );
};

export default SendingPlatformPage;
