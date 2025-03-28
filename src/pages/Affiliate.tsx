
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Share2, Users, DollarSign, Link, Copy, ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const AffiliatePage = () => {
  // Sample affiliate data
  const affiliateStats = {
    referralLink: 'https://mailr.io/ref/user123',
    referrals: 37,
    pendingCommissions: '$840.00',
    paidCommissions: '$3,240.00',
    commissionRate: '15%'
  };

  // Sample referral history
  const referralHistory = [
    { id: 1, email: 'user1@example.com', date: '2023-09-15', status: 'Active', commission: '$60.00' },
    { id: 2, email: 'user2@example.com', date: '2023-09-12', status: 'Active', commission: '$60.00' },
    { id: 3, email: 'user3@example.com', date: '2023-09-08', status: 'Pending', commission: '$60.00' },
    { id: 4, email: 'user4@example.com', date: '2023-09-05', status: 'Active', commission: '$60.00' },
    { id: 5, email: 'user5@example.com', date: '2023-08-28', status: 'Inactive', commission: '$0.00' },
  ];

  return (
    <MainLayout title="Affiliate Portal">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        <Card className="bg-mailr-darkgray border-mailr-lightgray shadow-lg col-span-4 lg:col-span-2">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <CardTitle className="text-lg font-medium">Your Referral Link</CardTitle>
              <Share2 className="h-5 w-5 text-blue-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex-1 bg-black/30 rounded-md px-3 py-2 text-sm">
                {affiliateStats.referralLink}
              </div>
              <Button size="sm" variant="outline" className="bg-mailr-darkgray border-mailr-lightgray hover:bg-mailr-lightgray">
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-sm text-gray-400">Share this link to earn {affiliateStats.commissionRate} on all referral purchases.</p>
          </CardContent>
        </Card>
        
        <Card className="bg-mailr-darkgray border-mailr-lightgray shadow-lg">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <CardTitle className="text-sm font-medium text-gray-400">Total Referrals</CardTitle>
              <Users className="h-5 w-5 text-green-500" />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{affiliateStats.referrals}</p>
          </CardContent>
        </Card>
        
        <Card className="bg-mailr-darkgray border-mailr-lightgray shadow-lg">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <CardTitle className="text-sm font-medium text-gray-400">Pending Commission</CardTitle>
              <DollarSign className="h-5 w-5 text-yellow-500" />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{affiliateStats.pendingCommissions}</p>
          </CardContent>
        </Card>

        <Card className="bg-mailr-darkgray border-mailr-lightgray shadow-lg">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <CardTitle className="text-sm font-medium text-gray-400">Total Paid</CardTitle>
              <DollarSign className="h-5 w-5 text-blue-500" />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{affiliateStats.paidCommissions}</p>
          </CardContent>
        </Card>
      </div>

      <div className="bg-mailr-darkgray rounded-md border border-mailr-lightgray overflow-hidden">
        <div className="p-4 border-b border-mailr-lightgray flex justify-between items-center">
          <h2 className="text-xl font-bold">Referral History</h2>
          <Button variant="outline" size="sm" className="bg-mailr-darkgray border-mailr-lightgray hover:bg-mailr-lightgray">
            View All <ArrowUpRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
        
        <Table>
          <TableHeader className="bg-black/30">
            <TableRow className="hover:bg-transparent border-mailr-lightgray">
              <TableHead>Email</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Commission</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {referralHistory.map((referral) => (
              <TableRow key={referral.id} className="hover:bg-mailr-lightgray/10 border-mailr-lightgray">
                <TableCell className="font-medium">{referral.email}</TableCell>
                <TableCell>{referral.date}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded text-xs ${
                    referral.status === 'Active' ? 'bg-green-900/30 text-green-400' : 
                    referral.status === 'Pending' ? 'bg-yellow-900/30 text-yellow-400' : 
                    'bg-red-900/30 text-red-400'
                  }`}>
                    {referral.status}
                  </span>
                </TableCell>
                <TableCell className="text-right">{referral.commission}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </MainLayout>
  );
};

export default AffiliatePage;
