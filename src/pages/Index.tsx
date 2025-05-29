import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, DollarSign, Globe, Inbox, Mail, FileText, TrendingUp, Clock, AlertCircle, CreditCard, ChevronLeft, ChevronRight, ArrowUp, ArrowDown, Tag } from 'lucide-react';
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
        return <Badge className="bg-red-600 text-white px-3 py-1 text-xs font-medium rounded-full">Canceled</Badge>;
      case 'processing':
        return <Badge className="bg-amber-600 text-white px-3 py-1 text-xs font-medium rounded-full">In Progress</Badge>;
      case 'completed':
        return <Badge className="bg-green-600 text-white px-3 py-1 text-xs font-medium rounded-full">Completed</Badge>;
      default:
        return <Badge className="bg-gray-600 text-white px-3 py-1 text-xs font-medium rounded-full">Unknown</Badge>;
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
    return provider === 'google' ? 'border-l-red-500/40' : 'border-l-blue-500/40';
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
        {/* Enhanced Provider Stats */}
        {providerStats.map(provider => <Card key={provider.provider} className="bg-[#1A1A1A] border-[#2D2D2D] shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:translate-y-[-2px] relative overflow-hidden group">
            {/* Subtle background texture */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.01)_0%,transparent_50%)]"></div>
            
            {/* Icon vignette effect */}
            <div className={`absolute top-4 left-4 w-12 h-12 rounded-full opacity-5 ${provider.provider === 'Microsoft' ? 'bg-blue-400' : 'bg-red-400'}`}></div>
            
            {/* Provider-specific accent border */}
            <div className={`absolute bottom-0 left-0 right-0 h-[2px] ${provider.provider === 'Microsoft' ? 'bg-gradient-to-r from-blue-500/40 via-blue-400/60 to-blue-500/40' : 'bg-gradient-to-r from-red-500/40 via-red-400/60 to-red-500/40'}`}></div>
            
            <CardContent className="p-6 relative z-10 flex items-center gap-4 h-full">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 flex items-center justify-center">
                  {provider.provider === 'Microsoft' ? (
                    <i className="fa-brands fa-microsoft text-white/90 text-2xl"></i>
                  ) : (
                    <i className="fa-brands fa-google text-white/90 text-2xl"></i>
                  )}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-medium uppercase tracking-[0.1em] text-[#B0B0B0] mb-1.5 leading-tight">
                  {provider.provider.toUpperCase()}
                </p>
                <p className="text-[15px] font-medium text-[#F0F0F0] leading-tight tracking-[-0.01em]">
                  {provider.domains} Domains • {provider.mailboxes} Mailboxes
                </p>
              </div>
            </CardContent>
          </Card>)}
        
        {/* Premium Sending Volume Card */}
        {dashboardStats.map(stat => (
          <Card key={stat.title} className="bg-gradient-to-br from-[#1A1A1A] via-[#1E1E1E] to-[#1A1A1A] border-[#2D2D2D] shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:translate-y-[-2px] relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-green-500/5 to-transparent"></div>
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-green-400/30 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-green-400/50 to-transparent"></div>
            
            <CardHeader className="pb-2 relative z-10">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <p className="text-xs uppercase tracking-wider text-gray-400 font-medium">{stat.title}</p>
                </div>
                <div className="relative">
                  {/* Enhanced sparkline effect */}
                  <div className="flex items-end space-x-0.5 opacity-70">
                    <div className="w-1 h-2 bg-green-400 rounded-sm"></div>
                    <div className="w-1 h-3 bg-green-400 rounded-sm"></div>
                    <div className="w-1 h-1 bg-green-400 rounded-sm"></div>
                    <div className="w-1 h-4 bg-green-400 rounded-sm"></div>
                    <div className="w-1 h-2 bg-green-400 rounded-sm"></div>
                    <div className="w-1 h-5 bg-green-400 rounded-sm"></div>
                    <div className="w-1 h-3 bg-green-400 rounded-sm"></div>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0 pb-6 relative z-10">
              <div className="text-4xl font-bold text-white mb-2">{stat.value}</div>
              <div className="text-sm text-green-400 flex items-center font-medium">
                <TrendingUp className="h-3 w-3 mr-1" />
                +12.5% from last month
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Premium Subscription Section */}
      <div className="mb-10">
        <Card className="bg-gradient-to-br from-[#1A1A1A] via-[#1E1E1E] to-[#1A1A1A] border-[#2D2D2D] shadow-2xl hover:shadow-3xl transition-all duration-300 relative overflow-hidden">
          {/* Background elements */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/5 to-transparent"></div>
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-blue-400/30 to-transparent"></div>
          <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-blue-400/40 to-transparent"></div>
          
          {/* Enhanced watermark icon */}
          <div className="absolute right-8 top-8 opacity-[0.08]">
            <CreditCard className="h-20 w-20 text-white" />
          </div>
          
          <CardHeader className="pb-6 relative z-10">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <p className="text-xs uppercase tracking-wider text-gray-400 font-medium">SUBSCRIPTION</p>
                <CardTitle className="text-4xl font-bold text-white">${totalSubscriptionCost.toLocaleString()}<span className="text-lg text-gray-400 font-normal ml-1">/month</span></CardTitle>
              </div>
              <Link to="/subscriptions">
                <Button variant="ghost" size="sm" className="text-xs text-gray-400 hover:text-white hover:bg-white/10 transition-all px-4 py-2 rounded-md border border-transparent hover:border-white/20">
                  View All
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="pt-0 pb-6 relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">Next Billing</p>
                <p className="text-xl font-semibold text-white">${nextBillingAmount.toLocaleString()}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-400 mb-1">Due Date</p>
                <p className="text-lg font-semibold text-blue-400">{getNextBillingDate()}</p>
              </div>
            </div>
            {/* Enhanced divider */}
            <div className="mt-6 pt-4 border-t border-white/10">
              <div className="flex items-center text-xs text-gray-500">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2 shadow-sm shadow-green-400/30"></div>
                Active subscription • Auto-renewal enabled
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Orders Section */}
      <Card className="bg-gradient-to-br from-[#1A1A1A] via-[#1E1E1E] to-[#1A1A1A] border-[#2D2D2D] shadow-2xl relative overflow-hidden">
        {/* Card background enhancement */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-800/5 to-transparent"></div>
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-gray-400/20 to-transparent"></div>
        
        <CardHeader className="pb-6 relative z-10">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold text-slate-50">Orders</CardTitle>
            <FileText className="h-5 w-5 text-gray-400" />
          </div>
        </CardHeader>
        <CardContent className="pt-0 relative z-10">
          <div className="overflow-x-auto">
            <table className="w-full table-fixed">
              <thead className="border-b-2 border-[#2D2D2D]">
                <tr>
                  <th 
                    className="text-center py-5 px-4 text-gray-300 font-bold text-xs uppercase tracking-wider w-[15%] cursor-pointer hover:text-gray-100 transition-colors"
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
                    className="text-center py-5 px-4 text-gray-300 font-bold text-xs uppercase tracking-wider w-[15%] cursor-pointer hover:text-gray-100 transition-colors"
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
                    className="text-center py-5 px-4 text-gray-300 font-bold text-xs uppercase tracking-wider w-[15%] cursor-pointer hover:text-gray-100 transition-colors"
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
                    className="text-center py-5 px-4 text-gray-300 font-bold text-xs uppercase tracking-wider w-[10%] cursor-pointer hover:text-gray-100 transition-colors"
                    onMouseEnter={() => setHoveredColumn('cost')}
                    onMouseLeave={() => setHoveredColumn('')}
                    onClick={() => handleSort('cost')}
                  >
                    <div className="flex items-center justify-center">
                      COST
                      {renderSortIcon('cost')}
                    </div>
                  </th>
                  <th className="text-center py-5 px-4 text-gray-300 font-bold text-xs uppercase tracking-wider w-[15%]">
                    <div className="flex items-center justify-center">
                      TAG
                    </div>
                  </th>
                  <th 
                    className="text-center py-5 px-4 text-gray-300 font-bold text-xs uppercase tracking-wider w-[15%] cursor-pointer hover:text-gray-100 transition-colors"
                    onMouseEnter={() => setHoveredColumn('status')}
                    onMouseLeave={() => setHoveredColumn('')}
                    onClick={() => handleSort('status')}
                  >
                    <div className="flex items-center justify-center">
                      STATUS
                      {renderSortIcon('status')}
                    </div>
                  </th>
                  <th className="text-center py-5 px-4 text-gray-300 font-bold text-xs uppercase tracking-wider w-[15%]">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {paginatedOrders.map((order, index) => <tr 
                    key={order.id} 
                    className={`border-b border-[#2D2D2D] last:border-b-0 hover:bg-[#2A2A2A] hover:shadow-lg hover:shadow-black/20 transition-all duration-200 transform hover:translate-y-[-1px] ${
                      index % 2 === 0 ? 'bg-[#1A1A1A]' : 'bg-[#1E1E1E]'
                    } border-l-4 ${getProviderRowAccent(order.provider)}`}
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
                          className="bg-transparent border border-[#2D2D2D] text-sm text-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500/50 rounded-md px-3 py-1.5 text-center w-full hover:border-gray-500 transition-colors" 
                        />
                      ) : (
                        <button
                          onClick={() => handleTagUpdate(order.id, '')}
                          className="flex items-center justify-center gap-2 text-xs text-gray-500 hover:text-gray-300 transition-colors bg-[#2A2A2A] hover:bg-[#333333] border border-dashed border-gray-600 hover:border-gray-500 rounded-md px-3 py-1.5 w-full"
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
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleOrderClick(order.id)} 
                        className="text-xs text-gray-400 hover:text-white hover:bg-gray-700 hover:border-gray-600 border border-transparent transition-all px-4 py-1.5 rounded-md font-medium"
                      >
                        View Details
                      </Button>
                    </td>
                  </tr>)}
              </tbody>
            </table>
          </div>
          
          {totalPages > 1 && <div className="flex justify-end mt-6 pt-4 border-t border-[#2D2D2D]">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} 
                      className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer hover:bg-gray-700'} 
                    />
                  </PaginationItem>
                  {Array.from({
                length: totalPages
              }, (_, i) => i + 1).map(page => <PaginationItem key={page}>
                      <PaginationLink 
                        onClick={() => setCurrentPage(page)} 
                        isActive={currentPage === page} 
                        className="cursor-pointer hover:bg-gray-700"
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>)}
                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))} 
                      className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer hover:bg-gray-700'} 
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
