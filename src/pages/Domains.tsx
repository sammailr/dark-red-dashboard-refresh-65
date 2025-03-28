
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Settings } from 'lucide-react';

const DomainsPage = () => {
  // Sample data
  const domains = [
    {
      id: 1,
      domain: 'example.com',
      url: 'https://example.com',
      status: 'Active',
      nameservers: 'ns1.example.com, ns2.example.com'
    },
    {
      id: 2,
      domain: 'test.org',
      url: 'https://test.org',
      status: 'Pending',
      nameservers: 'ns1.test.org, ns2.test.org'
    }
  ];

  return (
    <MainLayout title="Manage Domains">
      <div className="flex items-center justify-between mb-8">
        <Button variant="outline" size="sm" className="bg-mailr-darkgray border-mailr-lightgray hover:bg-mailr-lightgray">
          <Settings className="h-4 w-4" />
        </Button>
        
        <Button variant="default" size="sm" className="bg-mailr-red hover:bg-red-600">
          Import Domain
        </Button>
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
              <TableHead>Nameservers</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {domains.map((domain) => (
              <TableRow key={domain.id} className="hover:bg-mailr-lightgray/10 border-mailr-lightgray">
                <TableCell>
                  <Checkbox />
                </TableCell>
                <TableCell>{domain.domain}</TableCell>
                <TableCell>{domain.url}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded text-xs ${
                    domain.status === 'Active' ? 'bg-green-900/30 text-green-400' : 'bg-yellow-900/30 text-yellow-400'
                  }`}>
                    {domain.status}
                  </span>
                </TableCell>
                <TableCell>{domain.nameservers}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </MainLayout>
  );
};

export default DomainsPage;
