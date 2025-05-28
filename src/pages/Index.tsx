
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, DollarSign, Globe, Inbox, Mail, FileText, TrendingUp, Clock, AlertCircle, CreditCard } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

const Index = () => {
  const { isFreeTrial, daysRemaining, hasPaymentMethod, subscriptions } = useSubscription();

  // Example data - would typically come from an API
  const totalDomains = 8;
  const totalInboxes = 792;
  const sendingVolume = 237600;
  
  const dashboardStats = [
    {
      title: 'Active Domains',
      value: totalDomains.toString(),
      icon: Globe,
      color: 'text-mailr-red'
    },
    {
      title: 'Total Inboxes',
      value: totalInboxes.toString(),
      icon: Inbox,
      color: 'text-blue-500'
    },
    {
      title: 'Sending Volume per Month',
      value: sendingVolume.toLocaleString(),
      icon: TrendingUp,
      color: 'text-green-500'
    }
  ];

  const orderHistory = [
    {
      id: 'ordlgcLwveoDwOOBOWqNnEi',
      totalDomains: 1,
      date: 'Apr 15, 2025',
      status: 'canceled'
    },
    {
      id: 'ordDYfy4M5FkmloHlIyMls8',
      totalDomains: 2,
      date: 'Apr 18, 2025',
      status: 'canceled'
    },
    {
      id: 'ordAgVdFyRiSEsg9VpmaTOM',
      totalDomains: 2,
      date: 'Apr 18, 2025',
      status: 'canceled'
    },
    {
      id: 'ordZZzHA1pWq9Cauiz7CA0o',
      totalDomains: 2,
      date: 'Apr 18, 2025',
      status: 'in progress'
    },
    {
      id: 'ordlZ0LHSDi87RSIWBjmLqw',
      totalDomains: 1,
      date: 'Apr 22, 2025',
      status: 'in progress'
    }
  ];

  const totalSubscriptionCost = subscriptions
    .filter(sub => sub.status === 'active')
    .reduce((total, sub) => total + (sub.price * sub.quantity), 0);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'canceled':
        return <Badge className="bg-[#9b1313] text-white px-2 py-1 text-xs">Canceled</Badge>;
      case 'in progress':
        return <Badge className="bg-amber-600 text-white px-2 py-1 text-xs">In Progress</Badge>;
      default:
        return <Badge className="bg-gray-600 text-white px-2 py-1 text-xs">Unknown</Badge>;
    }
  };

  return (
    <MainLayout title="Dashboard">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
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

      <div className="grid grid-cols-1 gap-6 mb-6">
        <Card className="bg-mailr-darkgray border-mailr-lightgray shadow-lg">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                <CardTitle className="text-sm font-medium text-gray-400">Subscription</CardTitle>
              </div>
              <DollarSign className="h-5 w-5 text-yellow-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="py-4">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <p className="text-sm text-gray-400">Total</p>
                  <p className="text-2xl font-bold">${totalSubscriptionCost.toLocaleString()}<span className="text-lg text-gray-400 ml-1">/ month</span></p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-400">Next Billing Date</p>
                  <p className="font-medium">Jun 25, 2025</p>
                </div>
              </div>
              
              <div className="mt-4">
                <Link to="/subscriptions">
                  <Button variant="outline" className="w-full">
                    View All
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="bg-mailr-darkgray rounded-md border border-mailr-lightgray p-4 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Orders</h2>
          <FileText className="h-5 w-5 text-gray-400" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-mailr-lightgray">
              <tr>
                <th className="text-left py-3 text-gray-400 font-medium">ID</th>
                <th className="text-left py-3 text-gray-400 font-medium">Created</th>
                <th className="text-left py-3 text-gray-400 font-medium">Total Domains</th>
                <th className="text-right py-3 text-gray-400 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {orderHistory.map((order) => (
                <tr 
                  key={order.id} 
                  className="border-b border-mailr-lightgray last:border-b-0"
                >
                  <td className="py-4 font-mono text-sm">{order.id}</td>
                  <td className="py-4">{order.date}</td>
                  <td className="py-4">{order.totalDomains}</td>
                  <td className="py-4 text-right">
                    {getStatusBadge(order.status)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4">
          <Link to="/orders">
            <Button variant="outline" className="w-full">
              View All
            </Button>
          </Link>
        </div>
      </div>
    </MainLayout>
  );
};

export default Index;
