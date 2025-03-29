
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Filter, RefreshCw, Archive, Star, Trash2, Mail, Clock, AlertCircle, Tag } from 'lucide-react';

const MasterInboxPage = () => {
  const [selectedTab, setSelectedTab] = useState('all');
  
  // Sample data for emails
  const emails = [
    {
      id: 1,
      subject: 'New Order Confirmation #12345',
      from: 'orders@example.com',
      to: 'inbox1@yourdomain.com',
      date: '2023-09-10',
      time: '14:32',
      content: 'Thank you for your order. Your order #12345 has been confirmed and is being processed.',
      isRead: false,
      isStarred: true,
      labels: ['Order']
    },
    {
      id: 2,
      subject: 'Payment Receipt - Invoice #INV-5678',
      from: 'billing@test.org',
      to: 'payments@yourdomain.com',
      date: '2023-09-09',
      time: '09:15',
      content: 'Your payment of $120.00 has been processed successfully. Please find attached your receipt.',
      isRead: true,
      isStarred: false,
      labels: ['Payment']
    },
    {
      id: 3,
      subject: 'Shipping Notification - Order #12345',
      from: 'shipping@example.com',
      to: 'inbox1@yourdomain.com',
      date: '2023-09-08',
      time: '16:45',
      content: 'Your order has been shipped and is expected to arrive within 3-5 business days.',
      isRead: true,
      isStarred: false,
      labels: ['Shipping']
    },
    {
      id: 4,
      subject: 'Account Verification Required',
      from: 'security@service.com',
      to: 'inbox2@yourdomain.com',
      date: '2023-09-07',
      time: '11:23',
      content: 'Please verify your account to ensure continued access to our services.',
      isRead: false,
      isStarred: false,
      labels: ['Important']
    },
    {
      id: 5,
      subject: 'Weekly Report - Performance Analytics',
      from: 'reports@analytics.org',
      to: 'reports@yourdomain.com',
      date: '2023-09-06',
      time: '08:00',
      content: 'Your weekly performance report is now available. View the attached document for details.',
      isRead: true,
      isStarred: true,
      labels: ['Report']
    }
  ];

  // Filter emails based on the selected tab
  const filteredEmails = emails.filter(email => {
    if (selectedTab === 'all') return true;
    if (selectedTab === 'unread') return !email.isRead;
    if (selectedTab === 'starred') return email.isStarred;
    return true;
  });

  return (
    <MainLayout title="Master Inbox">
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div className="relative w-full md:w-1/2">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input 
              placeholder="Search messages..." 
              className="pl-10 bg-mailr-darkgray border-mailr-lightgray"
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="border-mailr-lightgray">
              <Filter size={16} className="mr-2" />
              Filter
            </Button>
            <Button variant="outline" size="sm" className="border-mailr-lightgray">
              <RefreshCw size={16} className="mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        <Card className="bg-mailr-darkgray border-mailr-lightgray">
          <Tabs defaultValue="all" onValueChange={setSelectedTab}>
            <div className="border-b border-mailr-lightgray">
              <TabsList className="bg-mailr-darkgray p-0 border-b-0">
                <TabsTrigger 
                  value="all" 
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-mailr-red data-[state=active]:bg-transparent"
                >
                  All
                </TabsTrigger>
                <TabsTrigger 
                  value="unread" 
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-mailr-red data-[state=active]:bg-transparent"
                >
                  Unread
                </TabsTrigger>
                <TabsTrigger 
                  value="starred" 
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-mailr-red data-[state=active]:bg-transparent"
                >
                  Starred
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="all" className="m-0">
              <Table>
                <TableHeader className="bg-black/20">
                  <TableRow className="hover:bg-transparent border-mailr-lightgray">
                    <TableHead className="w-[40px]"></TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead className="hidden md:table-cell">From</TableHead>
                    <TableHead className="hidden md:table-cell">To</TableHead>
                    <TableHead className="hidden md:table-cell">Date</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEmails.map((email) => (
                    <TableRow 
                      key={email.id} 
                      className={`hover:bg-mailr-lightgray/10 border-mailr-lightgray ${!email.isRead ? 'bg-black/20 font-medium' : ''}`}
                    >
                      <TableCell className="p-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Star className={`h-4 w-4 ${email.isStarred ? 'fill-yellow-500 text-yellow-500' : 'text-gray-400'}`} />
                        </Button>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {!email.isRead && (
                            <div className="h-2 w-2 rounded-full bg-mailr-red"></div>
                          )}
                          <div>
                            <div>{email.subject}</div>
                            <div className="text-xs text-gray-400 mt-1 line-clamp-1">{email.content}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">{email.from}</TableCell>
                      <TableCell className="hidden md:table-cell">{email.to}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div className="flex flex-col">
                          <span>{email.date}</span>
                          <span className="text-xs text-gray-400 flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {email.time}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Archive className="h-4 w-4 text-gray-400" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Trash2 className="h-4 w-4 text-gray-400" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
            
            <TabsContent value="unread" className="m-0">
              {/* This content will be rendered by the filter in the "all" tab */}
              <div className="py-2 px-4 text-center text-gray-400">
                {filteredEmails.length === 0 && "No unread messages"}
              </div>
            </TabsContent>
            
            <TabsContent value="starred" className="m-0">
              {/* This content will be rendered by the filter in the "all" tab */}
              <div className="py-2 px-4 text-center text-gray-400">
                {filteredEmails.length === 0 && "No starred messages"}
              </div>
            </TabsContent>
          </Tabs>
        </Card>

        <div className="flex justify-between items-center text-sm text-gray-400 px-2">
          <div>Showing {filteredEmails.length} of {emails.length} messages</div>
          <div>Last updated: Just now</div>
        </div>
      </div>
    </MainLayout>
  );
};

export default MasterInboxPage;
