import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, DollarSign, Globe, Inbox, Mail, FileText, TrendingUp, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';

const Index = () => {
  // Example data - would typically come from an API
  const totalDomains = 28;
  const pricePerDomain = 60;
  const emailsPerDomain = 990;
  
  const dashboardStats = [
    {
      title: 'Total Domains',
      value: totalDomains.toString(),
      icon: Globe,
      color: 'text-mailr-red'
    },
    {
      title: 'Total Inboxes',
      value: '154',
      icon: Inbox,
      color: 'text-blue-500'
    },
    {
      title: 'Sending Volume per Month',
      value: `${(totalDomains * emailsPerDomain).toLocaleString()}`,
      icon: TrendingUp,
      color: 'text-green-500'
    },
    {
      title: 'Pending Domains',
      value: '4',
      icon: Clock,
      color: 'text-amber-500'
    }
  ];

  const orderHistory = [
    {
      id: 'ORD-1234',
      domain: 'example.com',
      date: '2023-09-01',
      amount: '$60.00',
      invoiceId: 'INV-5678'
    },
    {
      id: 'ORD-1235',
      domain: 'testdomain.io',
      date: '2023-08-15',
      amount: '$60.00',
      invoiceId: 'INV-5679'
    },
    {
      id: 'ORD-1236',
      domain: 'newsite.org',
      date: '2023-07-22',
      amount: '$60.00',
      invoiceId: 'INV-5680'
    }
  ];

  const pendingDomains = [
    { domain: 'newdomain.com', status: 'DNS Verification', progress: 65 },
    { domain: 'awaiting.org', status: 'Payment Processing', progress: 30 },
    { domain: 'verify-me.net', status: 'Email Verification', progress: 85 },
    { domain: 'setup-pending.io', status: 'Setup Pending', progress: 15 },
    { domain: 'extra-domain1.net', status: 'DNS Verification', progress: 45 },
    { domain: 'extra-domain2.com', status: 'Email Verification', progress: 55 }
  ];

  return (
    <MainLayout title="Dashboard">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {dashboardStats.map((stat) => (
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
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <Card className="bg-mailr-darkgray border-mailr-lightgray shadow-lg h-full">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-sm font-medium text-gray-400">Subscription</CardTitle>
                <DollarSign className="h-5 w-5 text-yellow-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-gray-400 text-sm">Total</p>
                  <p className="text-2xl font-bold">${(totalDomains * pricePerDomain).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Next Billing</p>
                  <p className="text-2xl font-bold">$1,680</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Next Billing Date</p>
                  <p className="text-2xl font-bold">Oct 15, 2023</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card className="bg-mailr-darkgray border-mailr-lightgray shadow-lg h-[300px]">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-sm font-medium text-gray-400">Pending Domains</CardTitle>
                <Clock className="h-5 w-5 text-amber-500" />
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[210px] pr-4">
                <div className="space-y-3">
                  {pendingDomains.map((domain) => (
                    <div key={domain.domain} className="space-y-1">
                      <div className="flex justify-between">
                        <p className="text-sm font-medium">{domain.domain}</p>
                        <p className="text-xs text-gray-400">{domain.status}</p>
                      </div>
                      <div className="w-full bg-mailr-lightgray rounded-full h-2">
                        <div 
                          className="bg-mailr-red h-2 rounded-full" 
                          style={{ width: `${domain.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="bg-mailr-darkgray rounded-md border border-mailr-lightgray p-4 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Orders History</h2>
          <FileText className="h-5 w-5 text-gray-400" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-mailr-lightgray">
              <tr>
                <th className="text-left py-3 text-gray-400 font-medium">Order ID</th>
                <th className="text-left py-3 text-gray-400 font-medium">Domain</th>
                <th className="text-left py-3 text-gray-400 font-medium">Date</th>
                <th className="text-left py-3 text-gray-400 font-medium">Amount</th>
                <th className="text-right py-3 text-gray-400 font-medium">Invoice</th>
              </tr>
            </thead>
            <tbody>
              {orderHistory.map((order) => (
                <tr 
                  key={order.id} 
                  className="border-b border-mailr-lightgray last:border-b-0"
                >
                  <td className="py-4">{order.id}</td>
                  <td className="py-4">{order.domain}</td>
                  <td className="py-4">{order.date}</td>
                  <td className="py-4">{order.amount}</td>
                  <td className="py-4 text-right">
                    <Link to={`/invoices/${order.invoiceId}`} className="text-mailr-red hover:underline">
                      View Invoice
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </MainLayout>
  );
};

export default Index;
