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
    title: 'Monthly Sending Volume',
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
        return <Badge variant="outline" className="h-7 px-3 py-1 text-xs font-medium text-white bg-transparent border border-[#444] rounded-full hover:border-[#666] hover:bg-[#262626] transition-all duration-200 opacity-100">Canceled</Badge>;
      case 'processing':
        return <Badge variant="outline" className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border whitespace-nowrap bg-yellow-500/20 text-yellow-400 border-yellow-500/30">In Progress</Badge>;
      case 'completed':
        return <Badge variant="outline" className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border whitespace-nowrap bg-green-500/20 text-green-400 border-green-500/30">Completed</Badge>;
      default:
        return <Badge variant="outline" className="h-7 px-3 py-1 text-xs font-medium text-white bg-transparent border border-[#444] rounded-full hover:border-[#666] hover:bg-[#262626] transition-all duration-200 opacity-100">Unknown</Badge>;
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
          return sortDirection === 'asc' ? a.provider.localeCompare(b.provider) : b.provider.localeCompare(a.provider);
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
      return sortDirection === 'asc' ? <ArrowUp className="h-3 w-3 ml-1 text-gray-300" /> : <ArrowDown className="h-3 w-3 ml-1 text-gray-300" />;
    }
    return <ArrowUp className="h-3 w-3 ml-1 text-gray-400 opacity-50" />;
  };

  // Pagination logic
  const sortedOrders = getSortedOrders();
  const totalPages = Math.ceil(sortedOrders.length / ordersPerPage);
  const startIndex = (currentPage - 1) * ordersPerPage;
  const paginatedOrders = sortedOrders.slice(startIndex, startIndex + ordersPerPage);

  // Calculate total domains and inboxes
  const totalDomains = providerStats.reduce((total, provider) => total + provider.domains, 0);
  const totalMailboxes = providerStats.reduce((total, provider) => total + provider.mailboxes, 0);
  return <MainLayout title="Dashboard">
      {/* Top row with provider cards and total card */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
        {/* Enhanced Provider Stats with improved height and metric layout */}
        {providerStats.map(provider => <Card key={provider.provider} className="bg-[#1A1A1A] border-[#2A2A2A] shadow-lg hover:shadow-2xl transition-all duration-300 hover:shadow-[0_8px_32px_rgba(255,255,255,0.06)] relative overflow-hidden group rounded-lg h-[160px]">
            {/* Enhanced background texture */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(255,255,255,0.02)_0%,transparent_60%)]"></div>
            
            {/* Enhanced provider-specific accent border with glow effect */}
            <div className={`absolute bottom-0 left-0 right-0 h-[1px] transition-all duration-300 ${provider.provider === 'Microsoft' ? 'bg-gradient-to-r from-transparent via-blue-500/20 to-transparent group-hover:via-blue-500/30' : 'bg-gradient-to-r from-transparent via-red-500/20 to-transparent group-hover:via-red-500/30'}`}></div>
            
            {/* Updated bottom glow for Microsoft and Google cards */}
            {provider.provider === 'Microsoft' && <div className="absolute bottom-0 left-0 right-0 h-[8px]" style={{
          boxShadow: 'inset 0 -1px 4px rgba(62, 120, 250, 0.25)'
        }}></div>}
            {provider.provider === 'Google' && <div className="absolute bottom-0 left-0 right-0 h-[8px]" style={{
          boxShadow: 'inset 0 -1px 4px rgba(241, 65, 61, 0.25)'
        }}></div>}
            
            <CardHeader className="pb-3 pt-7 px-7 relative z-10">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <p className="text-xs uppercase tracking-[0.15em] text-gray-400 font-semibold transition-colors duration-300 group-hover:text-gray-300">{provider.provider.toUpperCase()}</p>
                </div>
                <div className="flex-shrink-0 relative group">
                  {/* Updated circle with exact gradients and glows to match order inboxes page */}
                  <div className="absolute inset-0 w-12 h-12 rounded-full transition-all duration-300" style={{
                background: provider.provider === 'Microsoft' ? 'linear-gradient(to bottom, #3E78FA, #1F5BEA)' : 'linear-gradient(to bottom, #F1413D, #C62F2B)',
                boxShadow: provider.provider === 'Microsoft' ? '0 0 12px rgba(62, 120, 250, 0.35)' : '0 0 12px rgba(241, 65, 61, 0.35)'
              }}></div>
                  <div className="w-12 h-12 flex items-center justify-center relative z-10">
                    {provider.provider === 'Microsoft' ? <i className="fa-brands fa-microsoft text-white text-2xl"></i> : <i className="fa-brands fa-google text-white text-2xl"></i>}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0 pb-7 px-7 relative z-10">
              {/* Display domains and inboxes side by side with aligned numbers */}
              <div className="space-y-3">
                <div className="flex items-center gap-6">
                  <div>
                    <div className="text-3xl font-bold text-white mb-1 leading-none">{provider.domains}</div>
                    <div className="text-xs text-gray-400 font-medium transition-colors duration-300 group-hover:text-gray-300">Domains</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-white mb-1 leading-none">{provider.mailboxes}</div>
                    <div className="text-xs text-gray-400 font-medium transition-colors duration-300 group-hover:text-gray-300">Inboxes</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>)}
        
        {/* Total Card with matching design */}
        <Card className="bg-[#1A1A1A] border-[#2A2A2A] shadow-lg hover:shadow-2xl transition-all duration-300 hover:shadow-[0_8px_32px_rgba(255,255,255,0.06)] relative overflow-hidden group rounded-lg h-[160px]">
          {/* Enhanced background texture */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(255,255,255,0.02)_0%,transparent_60%)]"></div>
          
          {/* Purple accent border with glow effect */}
          <div className="absolute bottom-0 left-0 right-0 h-[1px] transition-all duration-300 bg-gradient-to-r from-transparent via-purple-500/20 to-transparent group-hover:via-purple-500/30"></div>
          
          {/* Bottom glow for Total card */}
          <div className="absolute bottom-0 left-0 right-0 h-[8px]" style={{
          boxShadow: 'inset 0 -1px 4px rgba(147, 51, 234, 0.25)'
        }}></div>
          
          <CardHeader className="pb-3 pt-7 px-7 relative z-10">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <p className="text-xs uppercase tracking-[0.15em] text-gray-400 font-semibold transition-colors duration-300 group-hover:text-gray-300">TOTAL</p>
              </div>
              <div className="flex-shrink-0 relative group">
                {/* Purple circle with gradient and glow */}
                <div className="absolute inset-0 w-12 h-12 rounded-full transition-all duration-300" style={{
                background: 'linear-gradient(to bottom, #9333EA, #7C3AED)',
                boxShadow: '0 0 12px rgba(147, 51, 234, 0.35)'
              }}></div>
                <div className="w-12 h-12 flex items-center justify-center relative z-10">
                  <Globe className="text-white text-2xl" />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0 pb-7 px-7 relative z-10">
            {/* Display total domains and inboxes side by side with aligned numbers */}
            <div className="space-y-3">
              <div className="flex items-center gap-6">
                <div>
                  <div className="text-3xl font-bold text-white mb-1 leading-none">{totalDomains}</div>
                  <div className="text-xs text-gray-400 font-medium transition-colors duration-300 group-hover:text-gray-300">Domains</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-white mb-1 leading-none">{totalMailboxes}</div>
                  <div className="text-xs text-gray-400 font-medium transition-colors duration-300 group-hover:text-gray-300">Inboxes</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Second row with subscription and email volume cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        {/* Redesigned Subscription Card to match other top cards with exact layout */}
        <div className="lg:col-span-2">
          <Card className="bg-[#1A1A1A] border-[#2A2A2A] shadow-lg hover:shadow-2xl transition-all duration-300 hover:shadow-[0_8px_32px_rgba(255,255,255,0.06)] relative overflow-hidden group rounded-lg h-[160px]">
            {/* Enhanced background texture */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(255,255,255,0.02)_0%,transparent_60%)]"></div>
            
            {/* Orange accent border with glow effect */}
            <div className="absolute bottom-0 left-0 right-0 h-[1px] transition-all duration-300 bg-gradient-to-r from-transparent via-orange-500/20 to-transparent group-hover:via-orange-500/30"></div>
            
            {/* Bottom glow for Subscription card */}
            <div className="absolute bottom-0 left-0 right-0 h-[8px]" style={{
            boxShadow: 'inset 0 -1px 4px rgba(249, 115, 22, 0.25)'
          }}></div>
            
            <CardHeader className="pb-3 pt-7 px-7 relative z-10">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <p className="text-xs uppercase tracking-[0.15em] text-gray-400 font-semibold transition-colors duration-300 group-hover:text-gray-300">SUBSCRIPTION</p>
                </div>
                <div className="relative">
                  {/* Dollar sign icon matching the sparkline style */}
                  <div className="flex items-center justify-center opacity-40 transition-all duration-300 group-hover:opacity-60">
                    <DollarSign className="h-6 w-6 text-orange-500/60" />
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0 pb-7 px-7 relative z-10">
              {/* Display subscription info in three columns like other cards with matching bottom alignment */}
              <div className="space-y-3">
                <div className="flex items-center gap-12 mt-6">
                  <div>
                    <div className="text-3xl font-bold text-white mb-1 leading-none">${totalSubscriptionCost}</div>
                    <div className="text-xs text-gray-400 font-medium transition-colors duration-300 group-hover:text-gray-300">Per Month</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-white mb-1 leading-none">${nextBillingAmount}</div>
                    <div className="text-xs text-gray-400 font-medium transition-colors duration-300 group-hover:text-gray-300">Next Billing</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-white mb-1 leading-none">{getNextBillingDate()}</div>
                    <div className="text-xs text-gray-400 font-medium transition-colors duration-300 group-hover:text-gray-300">Next Billing Date</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Sending Volume Card with exact height and matching bottom alignment */}
        <div className="lg:col-span-1">
          {dashboardStats.map(stat => <Card key={stat.title} className="bg-[#1A1A1A] border-[#2A2A2A] shadow-lg hover:shadow-2xl hover:shadow-[0_8px_32px_rgba(255,255,255,0.06)] transition-all duration-300 relative overflow-hidden rounded-lg group h-[160px]">
              {/* Enhanced background elements with hover state */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(255,255,255,0.02)_0%,transparent_60%)]"></div>
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-green-400/10 to-transparent transition-all duration-300 group-hover:via-green-400/15"></div>
              
              {/* Added bottom glow for Monthly Sending Volume card */}
              <div className="absolute bottom-0 left-0 right-0 h-[8px]" style={{
            boxShadow: 'inset 0 -1px 4px rgba(34, 197, 94, 0.25)'
          }}></div>
              
              <CardHeader className="pb-3 pt-7 px-7 relative z-10">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs uppercase tracking-[0.15em] text-gray-400 font-semibold transition-colors duration-300 group-hover:text-gray-300">{stat.title}</p>
                  </div>
                  <div className="relative">
                    {/* Enhanced sparkline with hover animation */}
                    <div className="flex items-end space-x-0.5 opacity-40 transition-all duration-300 group-hover:opacity-60">
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
              <CardContent className="pt-0 pb-7 px-7 relative z-10">
                <div className="space-y-3">
                  <div className="flex items-center gap-6 mt-5">
                    <div>
                      <div className="text-3xl font-bold text-white mb-1 leading-none">
                        {stat.value}
                      </div>
                      
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>)}
        </div>
      </div>

      {/* Premium Orders Section with Enhanced Table */}
      <Card className="bg-[#1A1A1A] border-[#2A2A2A] shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden rounded-lg">
        {/* Subtle card background */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-800/2 to-transparent"></div>
        
        <CardHeader className="pb-6 pt-7 px-7 relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CardTitle className="text-xs font-semibold uppercase tracking-[0.15em] text-gray-400">ORDERS</CardTitle>
              <FileText className="h-4 w-4 text-gray-500" />
            </div>
          </div>
          {/* Enhanced divider line */}
          <div className="absolute bottom-0 left-7 right-7 h-[1px] bg-gradient-to-r from-transparent via-gray-700/50 to-transparent"></div>
        </CardHeader>
        <CardContent className="pt-0 px-0 relative z-10">
          {/* Premium table container with enhanced border and inset shadow */}
          <div className="overflow-x-auto border border-[#2A2A2A] rounded-lg mx-7 mb-7 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.02)]">
            <table className="w-full table-fixed">
              {/* Premium table header with enhanced styling */}
              <thead className="border-b border-[#2D2D2D] bg-gradient-to-r from-[#151515] to-[#161616]">
                <tr>
                  <th className="text-center py-5 px-4 text-gray-300 font-bold text-[10px] uppercase tracking-[0.12em] w-[15%] cursor-pointer hover:text-gray-100 transition-colors border-b border-[#2A2A2A]" onMouseEnter={() => setHoveredColumn('created')} onMouseLeave={() => setHoveredColumn('')} onClick={() => handleSort('created')}>
                    <div className="flex items-center justify-center">
                      CREATED
                      {renderSortIcon('created')}
                    </div>
                  </th>
                  <th className="text-center py-5 px-4 text-gray-300 font-bold text-[10px] uppercase tracking-[0.12em] w-[15%] cursor-pointer hover:text-gray-100 transition-colors border-b border-[#2A2A2A]" onMouseEnter={() => setHoveredColumn('domains')} onMouseLeave={() => setHoveredColumn('')} onClick={() => handleSort('domains')}>
                    <div className="flex items-center justify-center">
                      TOTAL DOMAINS
                      {renderSortIcon('domains')}
                    </div>
                  </th>
                  <th className="text-center py-5 px-4 text-gray-300 font-bold text-[10px] uppercase tracking-[0.12em] w-[15%] cursor-pointer hover:text-gray-100 transition-colors border-b border-[#2A2A2A]" onMouseEnter={() => setHoveredColumn('provider')} onMouseLeave={() => setHoveredColumn('')} onClick={() => handleSort('provider')}>
                    <div className="flex items-center justify-center">
                      PROVIDER
                      {renderSortIcon('provider')}
                    </div>
                  </th>
                  <th className="text-center py-5 px-4 text-gray-300 font-bold text-[10px] uppercase tracking-[0.12em] w-[10%] cursor-pointer hover:text-gray-100 transition-colors border-b border-[#2A2A2A]" onMouseEnter={() => setHoveredColumn('cost')} onMouseLeave={() => setHoveredColumn('')} onClick={() => handleSort('cost')}>
                    <div className="flex items-center justify-center">
                      COST
                      {renderSortIcon('cost')}
                    </div>
                  </th>
                  <th className="text-center py-5 px-4 text-gray-300 font-bold text-[10px] uppercase tracking-[0.12em] w-[15%] border-b border-[#2A2A2A]">
                    <div className="flex items-center justify-center">
                      TAG
                    </div>
                  </th>
                  <th className="text-center py-5 px-4 text-gray-300 font-bold text-[10px] uppercase tracking-[0.12em] w-[15%] cursor-pointer hover:text-gray-100 transition-colors border-b border-[#2A2A2A]" onMouseEnter={() => setHoveredColumn('status')} onMouseLeave={() => setHoveredColumn('')} onClick={() => handleSort('status')}>
                    <div className="flex items-center justify-center">
                      STATUS
                      {renderSortIcon('status')}
                    </div>
                  </th>
                  <th className="text-center py-5 px-4 text-gray-300 font-bold text-[10px] uppercase tracking-[0.12em] w-[15%] border-b border-[#2A2A2A]">
                    <div className="flex items-center justify-center">
                      ACTIONS
                    </div>
                  </th>
                </tr>
              </thead>
              {/* Premium table body with alternating backgrounds and enhanced hover */}
              <tbody>
                {paginatedOrders.map((order, index) => <tr key={order.id} className={`border-b border-[#232323] last:border-b-0 hover:bg-[#1A1A1A] transition-all duration-200 group ${index % 2 === 0 ? 'bg-[#121212]' : 'bg-[#161616]'} border-l-2 ${order.provider === 'google' ? 'border-l-red-500/25 hover:border-l-red-500/40' : 'border-l-blue-500/25 hover:border-l-blue-500/40'}`}>
                    <td className="py-5 px-5 text-sm text-center text-gray-200 font-medium transition-colors duration-200 group-hover:text-white">{formatDate(order.date)}</td>
                    <td className="py-5 px-5 text-sm text-center text-gray-200 font-medium transition-colors duration-200 group-hover:text-white">{order.domains.length}</td>
                    <td className="py-5 px-5 text-center">
                      <div className="flex justify-center items-center transition-transform duration-200 group-hover:scale-110">
                        {getProviderLogo(order.provider)}
                      </div>
                    </td>
                    <td className="py-5 px-5 text-sm text-center text-gray-200 font-medium transition-colors duration-200 group-hover:text-white">${(order.domains.length * 25).toLocaleString()}/mo</td>
                    <td className="py-5 px-5 text-center">
                      {orderTags[order.id] ? <input type="text" value={orderTags[order.id]} onChange={e => handleTagUpdate(order.id, e.target.value)} onClick={e => e.stopPropagation()} className="bg-transparent border border-[#2A2A2A] text-sm text-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500/30 focus:border-blue-500/30 rounded-md px-3 py-1.5 text-center w-full hover:border-gray-500 transition-colors" /> : <div className="flex justify-center">
                          <button onClick={() => handleTagUpdate(order.id, '')} className="inline-flex items-center justify-center gap-1 text-[10px] text-gray-500 hover:text-gray-300 transition-all border border-dotted border-gray-600/40 hover:border-gray-500/60 rounded-full px-2 py-1 opacity-0 group-hover:opacity-100 font-medium bg-[#1A1A1A] hover:bg-[#1F1F1F]">
                            <Tag className="h-2.5 w-2.5" />
                            No tag
                          </button>
                        </div>}
                    </td>
                    <td className="py-5 px-5 text-center">
                      {getStatusBadge(order.status)}
                    </td>
                    <td className="py-5 px-5 text-center">
                      <Button variant="default" size="sm" onClick={() => handleOrderClick(order.id)} className="text-xs bg-[#252525] text-white hover:bg-[#2A2A2A] hover:text-white border border-[#3A3A3A] hover:border-[#4A4A4A] transition-all px-3 py-2 rounded-lg font-medium shadow-sm hover:shadow-md inline-flex items-center gap-2 opacity-70 group-hover:opacity-100 hover:scale-105">
                        <Eye className="h-3 w-3" />
                        View Details
                      </Button>
                    </td>
                  </tr>)}
              </tbody>
            </table>
          </div>
          
          {totalPages > 1 && <div className="flex justify-end px-7 pb-7">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer hover:bg-gray-700/30'} />
                  </PaginationItem>
                  {Array.from({
                length: totalPages
              }, (_, i) => i + 1).map(page => <PaginationItem key={page}>
                      <PaginationLink onClick={() => setCurrentPage(page)} isActive={currentPage === page} className="cursor-pointer hover:bg-gray-700/30">
                        {page}
                      </PaginationLink>
                    </PaginationItem>)}
                  <PaginationItem>
                    <PaginationNext onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))} className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer hover:bg-gray-700/30'} />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>}
        </CardContent>
      </Card>
    </MainLayout>;
};
export default Index;