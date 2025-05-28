
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, DollarSign, Globe, Inbox, Mail, FileText, TrendingUp, Clock, AlertCircle, CreditCard, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

type Domain = {
  id: string;
  name: string;
  status: 'active' | 'pending' | 'cancelled';
};

type Order = {
  id: string;
  totalDomains: number;
  date: string;
  status: string;
  provider: 'google' | 'microsoft';
  domains: Domain[];
};

const Index = () => {
  const { isFreeTrial, daysRemaining, hasPaymentMethod, subscriptions } = useSubscription();
  const [currentPage, setCurrentPage] = useState(1);
  const [orderTags, setOrderTags] = useState<Record<string, string>>({});
  const navigate = useNavigate();
  const ordersPerPage = 3;

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

  const orderHistory: Order[] = [
    {
      id: 'ordlgcLwveoDwOOBOWqNnEi',
      totalDomains: 1,
      date: 'Apr 15, 2025',
      status: 'canceled',
      provider: 'google',
      domains: [
        { id: '1', name: 'example1.com', status: 'cancelled' as const }
      ]
    },
    {
      id: 'ordDYfy4M5FkmloHlIyMls8',
      totalDomains: 2,
      date: 'Apr 18, 2025',
      status: 'canceled',
      provider: 'microsoft',
      domains: [
        { id: '2', name: 'example2.com', status: 'cancelled' as const },
        { id: '3', name: 'example3.com', status: 'cancelled' as const }
      ]
    },
    {
      id: 'ordAgVdFyRiSEsg9VpmaTOM',
      totalDomains: 2,
      date: 'Apr 18, 2025',
      status: 'canceled',
      provider: 'google',
      domains: [
        { id: '4', name: 'example4.com', status: 'cancelled' as const },
        { id: '5', name: 'example5.com', status: 'cancelled' as const }
      ]
    },
    {
      id: 'ordZZzHA1pWq9Cauiz7CA0o',
      totalDomains: 2,
      date: 'Apr 18, 2025',
      status: 'in progress',
      provider: 'microsoft',
      domains: [
        { id: '6', name: 'example6.com', status: 'pending' as const },
        { id: '7', name: 'example7.com', status: 'active' as const }
      ]
    },
    {
      id: 'ordlZ0LHSDi87RSIWBjmLqw',
      totalDomains: 1,
      date: 'Apr 22, 2025',
      status: 'in progress',
      provider: 'google',
      domains: [
        { id: '8', name: 'example8.com', status: 'pending' as const }
      ]
    }
  ];

  const totalSubscriptionCost = subscriptions
    .filter(sub => sub.status === 'active')
    .reduce((total, sub) => total + (sub.price * sub.quantity), 0);

  const nextBillingAmount = subscriptions
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

  const getProviderLogo = (provider: 'google' | 'microsoft') => {
    if (provider === 'google') {
      return (
        <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center">
          <div className="text-xs font-bold text-blue-500">G</div>
        </div>
      );
    } else {
      return (
        <div className="w-6 h-6 bg-blue-500 flex items-center justify-center">
          <div className="w-3 h-3 grid grid-cols-2 gap-0.5">
            <div className="bg-white w-1 h-1"></div>
            <div className="bg-white w-1 h-1"></div>
            <div className="bg-white w-1 h-1"></div>
            <div className="bg-white w-1 h-1"></div>
          </div>
        </div>
      );
    }
  };

  const handleOrderClick = (orderId: string) => {
    navigate(`/orders/${orderId}`);
  };

  const handleTagUpdate = (orderId: string, tag: string) => {
    setOrderTags(prev => ({
      ...prev,
      [orderId]: tag
    }));
  };

  // Pagination logic
  const totalPages = Math.ceil(orderHistory.length / ordersPerPage);
  const startIndex = (currentPage - 1) * ordersPerPage;
  const paginatedOrders = orderHistory.slice(startIndex, startIndex + ordersPerPage);

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
        <Card className="bg-mailr-darkgray border-mailr-lightgray shadow-lg relative">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                <CardTitle className="text-sm font-medium text-gray-400">Monthly Total</CardTitle>
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
                  <p className="text-sm text-gray-400">Next Billing Amount</p>
                  <p className="font-medium">${nextBillingAmount.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </CardContent>
          <Link to="/subscriptions" className="absolute top-4 right-12">
            <Button variant="ghost" size="sm" className="text-xs text-gray-400 hover:text-white">
              View All
            </Button>
          </Link>
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
                <th className="text-left py-3 text-gray-400 font-medium">Created</th>
                <th className="text-left py-3 text-gray-400 font-medium">Total Domains</th>
                <th className="text-left py-3 text-gray-400 font-medium">Provider</th>
                <th className="text-left py-3 text-gray-400 font-medium">Tag</th>
                <th className="text-right py-3 text-gray-400 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {paginatedOrders.map((order) => (
                <tr 
                  key={order.id} 
                  className="border-b border-mailr-lightgray last:border-b-0 hover:bg-mailr-lightgray/10 cursor-pointer"
                  onClick={() => handleOrderClick(order.id)}
                >
                  <td className="py-4">{order.date}</td>
                  <td className="py-4">{order.totalDomains}</td>
                  <td className="py-4">
                    {getProviderLogo(order.provider)}
                  </td>
                  <td className="py-4">
                    <input
                      type="text"
                      value={orderTags[order.id] || ''}
                      onChange={(e) => handleTagUpdate(order.id, e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                      placeholder="Add tag..."
                      className="bg-transparent border-none text-sm text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-mailr-red rounded px-2 py-1"
                    />
                  </td>
                  <td className="py-4 text-right">
                    {getStatusBadge(order.status)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {totalPages > 1 && (
          <div className="mt-4">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                  />
                </PaginationItem>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      onClick={() => setCurrentPage(page)}
                      isActive={currentPage === page}
                      className="cursor-pointer"
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Index;
