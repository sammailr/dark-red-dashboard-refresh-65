
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Clock, Mail, ShoppingCart, Users } from 'lucide-react';

const MasterInboxPage = () => {
  // Sample data
  const emails = [
    {
      id: 1,
      subject: 'New Order Confirmation',
      sender: 'orders@example.com',
      date: '2023-09-10',
      time: '14:32'
    },
    {
      id: 2,
      subject: 'Payment Receipt',
      sender: 'billing@test.org',
      date: '2023-09-09',
      time: '09:15'
    },
    {
      id: 3,
      subject: 'Shipping Notification',
      sender: 'shipping@example.com',
      date: '2023-09-08',
      time: '16:45'
    }
  ];

  const stats = [
    {
      title: 'Total Orders',
      value: '1,254',
      icon: ShoppingCart,
      trend: '+12%',
      color: 'text-mailr-red'
    },
    {
      title: 'Active Domains',
      value: '28',
      icon: Globe,
      trend: '+3',
      color: 'text-blue-500'
    },
    {
      title: 'Total Messages',
      value: '8,742',
      icon: Mail,
      trend: '+24%',
      color: 'text-green-500'
    },
    {
      title: 'Subscribers',
      value: '3,891',
      icon: Users,
      trend: '+7%',
      color: 'text-yellow-500'
    }
  ];
  
  return (
    <MainLayout title="Master Inbox">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <Card key={stat.title} className="bg-mailr-darkgray border-mailr-lightgray shadow-lg">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-sm font-medium text-gray-400">{stat.title}</CardTitle>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-end">
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-xs text-green-400">{stat.trend}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="bg-mailr-darkgray rounded-md border border-mailr-lightgray overflow-hidden">
        <div className="p-4 border-b border-mailr-lightgray">
          <h2 className="text-xl font-bold">Recent Messages</h2>
        </div>
        
        <Table>
          <TableHeader className="bg-black/30">
            <TableRow className="hover:bg-transparent border-mailr-lightgray">
              <TableHead>Subject</TableHead>
              <TableHead>Sender</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {emails.map((email) => (
              <TableRow key={email.id} className="hover:bg-mailr-lightgray/10 border-mailr-lightgray">
                <TableCell className="font-medium">{email.subject}</TableCell>
                <TableCell>{email.sender}</TableCell>
                <TableCell>{email.date}</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <Clock className="h-3 w-3 mr-1 text-gray-400" />
                    {email.time}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </MainLayout>
  );
};

export default MasterInboxPage;
