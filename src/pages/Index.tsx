import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, DollarSign, Globe, Inbox, Mail, FileText, TrendingUp, Clock, AlertCircle, CreditCard, ChevronLeft, ChevronRight, ArrowUp, ArrowDown } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { useOrders } from '@/contexts/OrderContext';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import '@fortawesome/fontawesome-free/css/all.min.css';

const Index = () => {
  const {
    isFreeTrial,
    daysRemaining,
    hasPaymentMethod,
    subscriptions
  } = useSubscription();
  const {
    orders
  } = useOrders();
  const [currentPage, setCurrentPage] = useState(1);
  const [orderTags, setOrderTags] = useState<Record<string, string>>({});
  const [sortColumn, setSortColumn] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [hoveredColumn, setHoveredColumn] = useState<string>('');
  const navigate = useNavigate();
  const ordersPerPage = 10;

  // Example data - would typically come from an API
  const sendingVolume = 412800;
  const dashboardStats = [{
    title: 'Sending Volume per Month',
    value: sendingVolume.toLocaleString(),
    icon: TrendingUp,
    color: 'text-green-500'
  }];
  const providerStats = [{
    provider: 'Microsoft',
    domains: 8,
    mailboxes: 624,
    logo: <i className="fa-brands fa-microsoft text-white text-2xl"></i>
  }, {
    provider: 'Google',
    domains: 7,
    mailboxes: 623,
    logo: <i className="fa-brands fa-google text-white text-2xl"></i>
  }];
  const totalSubscriptionCost = subscriptions.filter(sub => sub.status === 'active').reduce((total, sub) => total + sub.price * sub.quantity, 0);
  const nextBillingAmount = subscriptions.filter(sub => sub.status === 'active').reduce((total, sub) => total + sub.price * sub.quantity, 0);

  // Get the earliest next billing date from active subscriptions
  const getNextBillingDate = () => {
    const activeSubscriptions = subscriptions.filter(sub => sub.status === 'active');
    if (activeSubscriptions.length === 0) return 'N/A';

    // For this example, using a fixed date - in real app, would calculate from subscription data
    return 'Oct 15, 2023';
  };
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'cancelled':
        return <Badge className="bg-[#9b1313] text-white px-2 py-1 text-xs">Canceled</Badge>;
      case 'processing':
        return <Badge className="bg-amber-600 text-white px-2 py-1 text-xs">In Progress</Badge>;
      case 'completed':
        return <Badge className="bg-green-600 text-white px-2 py-1 text-xs">Completed</Badge>;
      default:
        return <Badge className="bg-gray-600 text-white px-2 py-1 text-xs">Unknown</Badge>;
    }
  };
  const getProviderLogo = (provider: 'google' | 'microsoft') => {
    if (provider === 'google') {
      return <i className="fa-brands fa-google text-white text-lg"></i>;
    } else {
      return <i className="fa-brands fa-microsoft text-white text-lg"></i>;
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
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      // If clicking the same column, toggle between asc and desc
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // If clicking a new column, set it as the sort column with asc direction
      setSortColumn(column);
      setSortDirection('asc');
    }
    setCurrentPage(1); // Reset to first page when sorting
  };

  const getSortedOrders = () => {
    if (!sortColumn) return orders;

    const sorted = [...orders].sort((a, b) => {
      switch (sortColumn) {
        case 'created':
          const dateA = new Date(a.date).getTime();
          const dateB = new Date(b.date).getTime();
          return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
        
        case 'domains':
          const domainsA = a.domains.length;
          const domainsB = b.domains.length;
          return sortDirection === 'asc' ? domainsA - domainsB : domainsB - domainsA;
        
        case 'provider':
          return sortDirection === 'asc' 
            ? a.provider.localeCompare(b.provider)
            : b.provider.localeCompare(a.provider);
        
        case 'cost':
          const costA = a.domains.length * 25;
          const costB = b.domains.length * 25;
          return sortDirection === 'asc' ? costA - costB : costB - costA;
        
        case 'status':
          const statusOrder = ['completed', 'processing', 'cancelled'];
          const statusA = statusOrder.indexOf(a.status);
          const statusB = statusOrder.indexOf(b.status);
          return sortDirection === 'asc' ? statusA - statusB : statusB - statusA;
        
        default:
          return 0;
      }
    });

    return sorted;
  };

  const renderSortIcon = (column: string) => {
    if (hoveredColumn !== column && sortColumn !== column) return null;
    
    if (sortColumn === column) {
      return sortDirection === 'asc' 
        ? <ArrowUp className="h-3 w-3 ml-1 text-gray-300" />
        : <ArrowDown className="h-3 w-3 ml-1 text-gray-300" />;
    }
    
    return <ArrowUp className="h-3 w-3 ml-1 text-gray-400 opacity-50" />;
  };

  // Pagination logic
  const sortedOrders = getSortedOrders();
  const totalPages = Math.ceil(sortedOrders.length / ordersPerPage);
  const startIndex = (currentPage - 1) * ordersPerPage;
  const paginatedOrders = sortedOrders.slice(startIndex, startIndex + ordersPerPage);
  return <MainLayout title="Dashboard">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {providerStats.map(provider => <Card key={provider.provider} className="bg-mailr-darkgray border-mailr-lightgray shadow-lg">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                {provider.logo}
                <CardTitle className="text-xl font-bold">{provider.provider}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">Domains</span>
                  <span className="text-xl font-bold">{provider.domains}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">Mailboxes</span>
                  <span className="text-xl font-bold">{provider.mailboxes}</span>
                </div>
              </div>
            </CardContent>
          </Card>)}
        {dashboardStats.map(stat => <Card key={stat.title} className="bg-mailr-darkgray border-mailr-lightgray shadow-lg">
            <CardHeader className="pb-4">
              <div className="flex justify-between items-start">
                <CardTitle className="text-xl font-bold text-gray-400">{stat.title}</CardTitle>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>)}
      </div>

      <div className="grid grid-cols-1 gap-6 mb-6">
        <Card className="bg-mailr-darkgray border-mailr-lightgray shadow-lg relative">
          <CardHeader className="pb-4">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                <CardTitle className="text-xl font-bold text-slate-50">Subscription</CardTitle>
              </div>
              <DollarSign className="h-5 w-5 text-yellow-500" />
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-400 mb-1">Total</p>
                <p className="text-2xl font-bold">${totalSubscriptionCost.toLocaleString()}<span className="text-lg text-gray-400 ml-1">/month</span></p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-400 mb-1">Next Billing</p>
                <p className="text-2xl font-bold">${nextBillingAmount.toLocaleString()}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-400 mb-1">Next Billing Date</p>
                <p className="text-2xl font-bold">{getNextBillingDate()}</p>
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

      <Card className="bg-mailr-darkgray border-mailr-lightgray shadow-lg mb-6">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-bold text-slate-50">Orders</CardTitle>
            <FileText className="h-5 w-5 text-gray-400" />
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="overflow-x-auto">
            <table className="w-full table-fixed">
              <thead className="border-b border-mailr-lightgray">
                <tr>
                  <th 
                    className="text-center py-2 text-gray-400 font-medium text-sm w-[15%] cursor-pointer hover:text-gray-200 transition-colors"
                    onMouseEnter={() => setHoveredColumn('created')}
                    onMouseLeave={() => setHoveredColumn('')}
                    onClick={() => handleSort('created')}
                  >
                    <div className="flex items-center justify-center">
                      Created
                      {renderSortIcon('created')}
                    </div>
                  </th>
                  <th 
                    className="text-center py-2 text-gray-400 font-medium text-sm w-[15%] cursor-pointer hover:text-gray-200 transition-colors"
                    onMouseEnter={() => setHoveredColumn('domains')}
                    onMouseLeave={() => setHoveredColumn('')}
                    onClick={() => handleSort('domains')}
                  >
                    <div className="flex items-center justify-center">
                      Total Domains
                      {renderSortIcon('domains')}
                    </div>
                  </th>
                  <th 
                    className="text-center py-2 text-gray-400 font-medium text-sm w-[15%] cursor-pointer hover:text-gray-200 transition-colors"
                    onMouseEnter={() => setHoveredColumn('provider')}
                    onMouseLeave={() => setHoveredColumn('')}
                    onClick={() => handleSort('provider')}
                  >
                    <div className="flex items-center justify-center">
                      Provider
                      {renderSortIcon('provider')}
                    </div>
                  </th>
                  <th 
                    className="text-center py-2 text-gray-400 font-medium text-sm w-[10%] cursor-pointer hover:text-gray-200 transition-colors"
                    onMouseEnter={() => setHoveredColumn('cost')}
                    onMouseLeave={() => setHoveredColumn('')}
                    onClick={() => handleSort('cost')}
                  >
                    <div className="flex items-center justify-center">
                      Cost
                      {renderSortIcon('cost')}
                    </div>
                  </th>
                  <th 
                    className="text-center py-2 text-gray-400 font-medium text-sm w-[15%] cursor-pointer hover:text-gray-200 transition-colors"
                    onMouseEnter={() => setHoveredColumn('tag')}
                    onMouseLeave={() => setHoveredColumn('')}
                  >
                    <div className="flex items-center justify-center">
                      Tag
                      {renderSortIcon('tag')}
                    </div>
                  </th>
                  <th 
                    className="text-center py-2 text-gray-400 font-medium text-sm w-[15%] cursor-pointer hover:text-gray-200 transition-colors"
                    onMouseEnter={() => setHoveredColumn('status')}
                    onMouseLeave={() => setHoveredColumn('')}
                    onClick={() => handleSort('status')}
                  >
                    <div className="flex items-center justify-center">
                      Status
                      {renderSortIcon('status')}
                    </div>
                  </th>
                  <th className="text-center py-2 text-gray-400 font-medium text-sm w-[15%]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedOrders.map((order, index) => <tr key={order.id} className="border-b border-mailr-lightgray last:border-b-0 hover:bg-mailr-lightgray/10">
                    <td className="py-3 text-sm text-center">{formatDate(order.date)}</td>
                    <td className="py-3 text-sm text-center">{order.domains.length}</td>
                    <td className="py-3 text-center">
                      {getProviderLogo(order.provider)}
                    </td>
                    <td className="py-3 text-sm text-center">${(order.domains.length * 25).toLocaleString()}/mo</td>
                    <td className="py-3 text-center">
                      <input type="text" value={orderTags[order.id] || ''} onChange={e => handleTagUpdate(order.id, e.target.value)} onClick={e => e.stopPropagation()} placeholder="Add tag..." className="bg-transparent border-none text-sm text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-mailr-red rounded px-2 py-1 text-center w-full" />
                    </td>
                    <td className="py-3 text-center">
                      {getStatusBadge(order.status)}
                    </td>
                    <td className="py-3 text-center">
                      <Button variant="ghost" size="sm" onClick={() => handleOrderClick(order.id)} className="text-xs text-gray-400 hover:text-white">
                        View Details
                      </Button>
                    </td>
                  </tr>)}
              </tbody>
            </table>
          </div>
          
          {totalPages > 1 && <div className="flex justify-end mt-2">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'} />
                  </PaginationItem>
                  {Array.from({
                length: totalPages
              }, (_, i) => i + 1).map(page => <PaginationItem key={page}>
                      <PaginationLink onClick={() => setCurrentPage(page)} isActive={currentPage === page} className="cursor-pointer">
                        {page}
                      </PaginationLink>
                    </PaginationItem>)}
                  <PaginationItem>
                    <PaginationNext onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))} className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'} />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>}
        </CardContent>
      </Card>
    </MainLayout>;
};
export default Index;
