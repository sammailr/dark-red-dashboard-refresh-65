import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, DollarSign, Globe, Inbox, Mail, FileText, TrendingUp, Clock, AlertCircle, CreditCard, ChevronLeft, ChevronRight, ArrowUp, ArrowDown, Tag, Eye } from 'lucide-react';
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
    title: 'Monthly Email Volume',
    value: sendingVolume.toLocaleString(),
    icon: TrendingUp,
    color: 'text-green-500'
  }];
  const providerStats = [{
    provider: 'Microsoft',
    domains: 8,
    mailboxes: 624,
    logo: <i className="fa-brands fa-microsoft text-white text-3xl"></i>
  }, {
    provider: 'Google',
    domains: 7,
    mailboxes: 623,
    logo: <i className="fa-brands fa-google text-white text-3xl"></i>
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
        return <Badge className="bg-red-500/60 text-white px-3 py-1 text-xs font-medium rounded-full">Canceled</Badge>;
      case 'processing':
        return <Badge className="bg-amber-500/60 text-white px-3 py-1 text-xs font-medium rounded-full">In Progress</Badge>;
      case 'completed':
        return <Badge className="bg-green-500/60 text-white px-3 py-1 text-xs font-medium rounded-full">Completed</Badge>;
      default:
        return <Badge className="bg-gray-500/60 text-white px-3 py-1 text-xs font-medium rounded-full">Unknown</Badge>;
    }
  };
  const getProviderLogo = (provider: 'google' | 'microsoft') => {
    if (provider === 'google') {
      return <i className="fa-brands fa-google text-white text-xl"></i>;
    } else {
      return <i className="fa-brands fa-microsoft text-white text-xl"></i>;
    }
  };
  const getProviderAccent = (provider: 'google' | 'microsoft') => {
    return provider === 'google' ? 'border-red-500/50' : 'border-blue-500/50';
  };
  const getProviderRowAccent = (provider: 'google' | 'microsoft') => {
    return provider === 'google' ? 'border-l-red-500/25' : 'border-l-blue-500/25';
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
      {/* Provider Stats and Premium Dashboard Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
        {/* Enhanced Provider Stats with improved hover effects */}
        {providerStats.map(provider => <Card key={provider.provider} className="bg-[#1A1A1A] border-[#2A2A2A] shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:translate-y-[-2px] hover:shadow-[0_8px_32px_rgba(255,255,255,0.04)] relative overflow-hidden group rounded-lg">
            {/* Subtle background texture */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(255,255,255,0.015)_0%,transparent_60%)]"></div>
            
            {/* Subdued provider-specific accent border */}
            <div className={`absolute bottom-0 left-0 right-0 h-[1px] ${provider.provider === 'Microsoft' ? 'bg-gradient-to-r from-transparent via-blue-500/15 to-transparent' : 'bg-gradient-to-r from-transparent via-red-500/15 to-transparent'}`}></div>
            
            <CardContent className="p-6 relative z-10 flex items-center gap-4 h-full">
              <div className="flex-shrink-0 relative">
                {/* Properly positioned circle behind the logo */}
                <div className={`absolute inset-0 w-10 h-10 rounded-full opacity-20 ${provider.provider === 'Microsoft' ? 'bg-blue-400' : 'bg-red-400'}`}></div>
                <div className="w-10 h-10 flex items-center justify-center relative z-10">
                  {provider.provider === 'Microsoft' ? (
                    <i className="fa-brands fa-microsoft text-white/90 text-2xl"></i>
                  ) : (
                    <i className="fa-brands fa-google text-white/90 text-2xl"></i>
                  )}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#B0B0B0] mb-1.5 leading-tight">
                  {provider.provider.toUpperCase()}
                </p>
                <p className="text-[15px] font-medium text-[#F0F0F0] leading-tight tracking-[-0.01em]">
                  {provider.domains} Domains • {provider.mailboxes} Mailboxes
                </p>
              </div>
            </CardContent>
          </Card>)}
        
        {/* Enhanced Sending Volume Card with improved hover effects */}
        {dashboardStats.map(stat => (
          <Card key={stat.title} className="bg-gradient-to-br from-[#1A1A1A] via-[#1C1C1C] to-[#1A1A1A] border-[#2A2A2A] shadow-lg hover:shadow-2xl hover:shadow-[0_8px_32px_rgba(255,255,255,0.04)] transition-all duration-300 transform hover:translate-y-[-2px] relative overflow-hidden rounded-lg">
            {/* More subtle background elements */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-green-500/1 to-transparent"></div>
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-green-400/8 to-transparent"></div>
            
            <CardHeader className="pb-3 pt-6 px-6 relative z-10">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <p className="text-xs uppercase tracking-[0.12em] text-gray-400 font-semibold">{stat.title}</p>
                </div>
                <div className="relative">
                  {/* More subtle sparkline with softer green */}
                  <div className="flex items-end space-x-0.5 opacity-40">
                    <div className="w-1 h-2 bg-gradient-to-t from-green-600/50 to-green-400/50 rounded-sm"></div>
                    <div className="w-1 h-3 bg-gradient-to-t from-green-600/50 to-green-400/50 rounded-sm"></div>
                    <div className="w-1 h-1 bg-gradient-to-t from-green-600/50 to-green-400/50 rounded-sm"></div>
                    <div className="w-1 h-4 bg-gradient-to-t from-green-600/50 to-green-400/50 rounded-sm"></div>
                    <div className="w-1 h-2 bg-gradient-to-t from-green-600/50 to-green-400/50 rounded-sm"></div>
                    <div className="w-1 h-5 bg-gradient-to-t from-green-600/50 to-green-400/50 rounded-sm"></div>
                    <div className="w-1 h-3 bg-gradient-to-t from-green-600/50 to-green-400/50 rounded-sm"></div>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0 pb-6 px-6 relative z-10">
              <div className="text-4xl font-bold text-white mb-2 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] text-shadow-sm" style={{ textShadow: '0 0 8px rgba(255,255,255,0.1)' }}>
                {stat.value}
              </div>
              <div className="text-sm text-green-400/60 flex items-center font-medium">
                <TrendingUp className="h-3 w-3 mr-1" />
                +12.5% from last month
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Enhanced Subscription Section */}
      <div className="mb-10">
        <Card className="bg-gradient-to-br from-[#1A1A1A] via-[#1B1B1B] to-[#1A1A1A] border-[#2A2A2A] shadow-lg hover:shadow-2xl hover:shadow-[0_8px_32px_rgba(255,255,255,0.04)] transition-all duration-300 relative overflow-hidden rounded-lg">
          {/* Reduced background elements */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-500/1 to-transparent"></div>
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-red-400/10 to-transparent"></div>
          
          <CardHeader className="pb-6 pt-6 px-6 relative z-10">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <p className="text-xs uppercase tracking-[0.12em] text-gray-400 font-semibold">SUBSCRIPTION</p>
                <CardTitle className="text-4xl font-bold text-white">${totalSubscriptionCost.toLocaleString()}<span className="text-lg text-gray-400 font-normal ml-1">/month</span></CardTitle>
              </div>
              <Link to="/subscriptions">
                <Button variant="ghost" size="sm" className="text-xs text-gray-400 hover:text-white hover:bg-white/5 transition-all px-4 py-2 rounded-lg border border-transparent hover:border-white/10 font-medium">
                  View All
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="pt-0 pb-6 px-6 relative z-10">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-sm text-gray-400 mb-1 font-medium">Next Billing</p>
                <p className="text-xl font-semibold text-white">${nextBillingAmount.toLocaleString()}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-400 mb-1 font-medium">Due Date</p>
                <p className="text-lg font-semibold text-red-400">{getNextBillingDate()}</p>
              </div>
            </div>
            {/* Enhanced divider line */}
            <div className="border-t border-gradient-to-r from-transparent via-white/8 to-transparent mb-4"></div>
            <div className="flex items-center text-xs text-gray-500">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-2 shadow-sm shadow-green-400/20"></div>
              Active subscription • Auto-renewal enabled
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Premium Orders Section with Enhanced Table */}
      <Card className="bg-[#1A1A1A] border-[#2A2A2A] shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden rounded-lg">
        {/* Subtle card background */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-800/2 to-transparent"></div>
        
        <CardHeader className="pb-6 pt-6 px-6 relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CardTitle className="text-xs font-semibold uppercase tracking-[0.12em] text-gray-400">ORDERS</CardTitle>
              <FileText className="h-4 w-4 text-gray-500" />
            </div>
          </div>
          {/* Enhanced divider line */}
          <div className="absolute bottom-0 left-6 right-6 h-[1px] bg-gradient-to-r from-transparent via-gray-700/40 to-transparent"></div>
        </CardHeader>
        <CardContent className="pt-0 px-0 relative z-10">
          {/* Enhanced table container with border */}
          <div className="overflow-x-auto border border-[#2A2A2A] rounded-lg mx-6 mb-6">
            <table className="w-full table-fixed">
              {/* Enhanced table header with increased padding and better styling */}
              <thead className="border-b border-[#2D2D2D] bg-[#151515]">
                <tr>
                  <th 
                    className="text-center py-4 px-4 text-gray-300 font-bold text-[11px] uppercase tracking-[0.1em] w-[15%] cursor-pointer hover:text-gray-100 transition-colors"
                    onMouseEnter={() => setHoveredColumn('created')}
                    onMouseLeave={() => setHoveredColumn('')}
                    onClick={() => handleSort('created')}
                  >
                    <div className="flex items-center justify-center">
                      CREATED
                      {renderSortIcon('created')}
                    </div>
                  </th>
                  <th 
                    className="text-center py-4 px-4 text-gray-300 font-bold text-[11px] uppercase tracking-[0.1em] w-[15%] cursor-pointer hover:text-gray-100 transition-colors"
                    onMouseEnter={() => setHoveredColumn('domains')}
                    onMouseLeave={() => setHoveredColumn('')}
                    onClick={() => handleSort('domains')}
                  >
                    <div className="flex items-center justify-center">
                      TOTAL DOMAINS
                      {renderSortIcon('domains')}
                    </div>
                  </th>
                  <th 
                    className="text-center py-4 px-4 text-gray-300 font-bold text-[11px] uppercase tracking-[0.1em] w-[15%] cursor-pointer hover:text-gray-100 transition-colors"
                    onMouseEnter={() => setHoveredColumn('provider')}
                    onMouseLeave={() => setHoveredColumn('')}
                    onClick={() => handleSort('provider')}
                  >
                    <div className="flex items-center justify-center">
                      PROVIDER
                      {renderSortIcon('provider')}
                    </div>
                  </th>
                  <th 
                    className="text-center py-4 px-4 text-gray-300 font-bold text-[11px] uppercase tracking-[0.1em] w-[10%] cursor-pointer hover:text-gray-100 transition-colors"
                    onMouseEnter={() => setHoveredColumn('cost')}
                    onMouseLeave={() => setHoveredColumn('')}
                    onClick={() => handleSort('cost')}
                  >
                    <div className="flex items-center justify-center">
                      COST
                      {renderSortIcon('cost')}
                    </div>
                  </th>
                  <th className="text-center py-4 px-4 text-gray-300 font-bold text-[11px] uppercase tracking-[0.1em] w-[15%]">
                    <div className="flex items-center justify-center">
                      TAG
                    </div>
                  </th>
                  <th 
                    className="text-center py-4 px-4 text-gray-300 font-bold text-[11px] uppercase tracking-[0.1em] w-[15%] cursor-pointer hover:text-gray-100 transition-colors"
                    onMouseEnter={() => setHoveredColumn('status')}
                    onMouseLeave={() => setHoveredColumn('')}
                    onClick={() => handleSort('status')}
                  >
                    <div className="flex items-center justify-center">
                      STATUS
                      {renderSortIcon('status')}
                    </div>
                  </th>
                  <th className="text-center py-4 px-4 text-gray-300 font-bold text-[11px] uppercase tracking-[0.1em] w-[15%]">ACTIONS</th>
                </tr>
              </thead>
              {/* Enhanced table body with alternating backgrounds */}
              <tbody>
                {paginatedOrders.map((order, index) => <tr 
                    key={order.id} 
                    className={`border-b border-[#232323] last:border-b-0 hover:bg-[#1A1A1A] transition-all duration-200 group ${
                      index % 2 === 0 ? 'bg-[#121212]' : 'bg-[#161616]'
                    } border-l-2 ${order.provider === 'google' ? 'border-l-red-500/20 hover:border-l-red-500/30' : 'border-l-blue-500/20 hover:border-l-blue-500/30'}`}
                  >
                    <td className="py-4 px-5 text-sm text-center text-gray-200 font-medium">{formatDate(order.date)}</td>
                    <td className="py-4 px-5 text-sm text-center text-gray-200 font-medium">{order.domains.length}</td>
                    <td className="py-4 px-5 text-center">
                      <div className="flex justify-center items-center">
                        {getProviderLogo(order.provider)}
                      </div>
                    </td>
                    <td className="py-4 px-5 text-sm text-center text-gray-200 font-medium">${(order.domains.length * 25).toLocaleString()}/mo</td>
                    <td className="py-4 px-5 text-center">
                      {orderTags[order.id] ? (
                        <input 
                          type="text" 
                          value={orderTags[order.id]} 
                          onChange={e => handleTagUpdate(order.id, e.target.value)} 
                          onClick={e => e.stopPropagation()} 
                          className="bg-transparent border border-[#2A2A2A] text-sm text-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500/30 focus:border-blue-500/30 rounded-md px-3 py-1.5 text-center w-full hover:border-gray-500 transition-colors" 
                        />
                      ) : (
                        <button
                          onClick={() => handleTagUpdate(order.id, '')}
                          className="flex items-center justify-center gap-1.5 text-[11px] text-gray-500 hover:text-gray-300 transition-all border border-dotted border-gray-600/40 hover:border-gray-500/60 rounded-full px-3 py-1.5 w-full group-hover:opacity-100 opacity-0 transition-opacity font-medium"
                        >
                          <Tag className="h-3 w-3" />
                          Add Tag
                        </button>
                      )}
                    </td>
                    <td className="py-4 px-5 text-center">
                      {getStatusBadge(order.status)}
                    </td>
                    <td className="py-4 px-5 text-center">
                      <Button 
                        variant="default"
                        size="sm" 
                        onClick={() => handleOrderClick(order.id)} 
                        className="text-xs bg-[#252525] text-white hover:bg-[#2A2A2A] hover:text-white border border-[#3A3A3A] hover:border-[#4A4A4A] transition-all px-4 py-2 rounded-lg font-medium shadow-sm hover:shadow-md flex items-center gap-2"
                      >
                        <Eye className="h-3 w-3" />
                        View Details
                      </Button>
                    </td>
                  </tr>)}
              </tbody>
            </table>
          </div>
          
          {totalPages > 1 && <div className="flex justify-end px-6 pb-6">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} 
                      className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer hover:bg-gray-700/30'} 
                    />
                  </PaginationItem>
                  {Array.from({
                length: totalPages
              }, (_, i) => i + 1).map(page => <PaginationItem key={page}>
                      <PaginationLink 
                        onClick={() => setCurrentPage(page)} 
                        isActive={currentPage === page} 
                        className="cursor-pointer hover:bg-gray-700/30"
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>)}
                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))} 
                      className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer hover:bg-gray-700/30'} 
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>}
        </CardContent>
      </Card>
    </MainLayout>;
};

export default Index;
