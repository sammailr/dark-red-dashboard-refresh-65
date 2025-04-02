
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { 
  MoreHorizontal, 
  Plus, 
  RefreshCw, 
  XCircle, 
  CheckCircle, 
  FileText, 
  Search,
  CreditCard,
  ChevronRight
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

const SubscriptionsPage = () => {
  const { subscriptions, updateSubscription } = useSubscription();
  const [searchTerm, setSearchTerm] = useState('');

  const activeSubscriptions = subscriptions.filter(sub => sub.status === 'active');
  const canceledSubscriptions = subscriptions.filter(sub => sub.status === 'canceled');
  const expiredSubscriptions = subscriptions.filter(sub => sub.status === 'expired');

  const handleStatusChange = (id: string, newStatus: 'active' | 'canceled' | 'expired') => {
    updateSubscription(id, { status: newStatus });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-600">Active</Badge>;
      case 'canceled':
        return <Badge className="bg-orange-600">Canceled</Badge>;
      case 'expired':
        return <Badge className="bg-red-600">Expired</Badge>;
      case 'trial':
        return <Badge className="bg-blue-600">Trial</Badge>;
      default:
        return <Badge className="bg-gray-600">Unknown</Badge>;
    }
  };

  const filteredSubscriptions = subscriptions.filter(sub => {
    return (
      sub.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.orderId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.billingDate.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <MainLayout title="Subscriptions">
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-mailr-darkgray border-mailr-lightgray">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Active Subscriptions</CardTitle>
              <CardDescription>
                ${activeSubscriptions.reduce((sum, sub) => sum + (sub.price * sub.quantity), 0)}/monthly
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{activeSubscriptions.length}</p>
            </CardContent>
          </Card>
          
          <Card className="bg-mailr-darkgray border-mailr-lightgray">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Next Billing</CardTitle>
              <CardDescription>
                {activeSubscriptions.length > 0 
                  ? activeSubscriptions.sort((a, b) => new Date(a.billingDate).getTime() - new Date(b.billingDate).getTime())[0].billingDate 
                  : 'No upcoming bills'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                ${activeSubscriptions.reduce((sum, sub) => sum + (sub.price * sub.quantity), 0)}
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-mailr-darkgray border-mailr-lightgray">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Expired/Canceled</CardTitle>
              <CardDescription>
                Total: {canceledSubscriptions.length + expiredSubscriptions.length}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{expiredSubscriptions.length} expired</p>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Subscriptions</h2>
          <Button variant="default" size="sm" className="bg-mailr-red hover:bg-red-600">
            <Plus className="h-4 w-4 mr-1" />
            Add Subscription
          </Button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search subscriptions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-mailr-darkgray border-mailr-lightgray"
          />
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="bg-mailr-darkgray border-mailr-lightgray">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="canceled">Canceled</TabsTrigger>
            <TabsTrigger value="expired">Expired</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-4">
            <div className="bg-mailr-darkgray rounded-md border border-mailr-lightgray overflow-hidden">
              <Table>
                <TableHeader className="bg-black/30">
                  <TableRow className="hover:bg-transparent border-mailr-lightgray">
                    <TableHead>ID</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Billing</TableHead>
                    <TableHead>Next Billing</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Order ID</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSubscriptions.length === 0 ? (
                    <TableRow className="hover:bg-mailr-lightgray/10 border-mailr-lightgray">
                      <TableCell colSpan={8} className="text-center py-4">
                        No subscriptions found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredSubscriptions.map((subscription) => (
                      <TableRow 
                        key={subscription.id} 
                        className="hover:bg-mailr-lightgray/10 border-mailr-lightgray cursor-pointer group"
                        onClick={() => window.location.href = `/subscriptions/${subscription.id}`}
                      >
                        <TableCell className="font-mono text-xs">{subscription.id}</TableCell>
                        <TableCell>{getStatusBadge(subscription.status)}</TableCell>
                        <TableCell>{subscription.lastBillingDate || 'N/A'}</TableCell>
                        <TableCell>{subscription.billingDate}</TableCell>
                        <TableCell>{subscription.quantity}</TableCell>
                        <TableCell>${subscription.price * subscription.quantity}</TableCell>
                        <TableCell className="font-mono text-xs">{subscription.orderId || 'N/A'}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="invisible group-hover:visible text-gray-400 hover:text-white hover:bg-transparent"
                              onClick={(e) => {
                                e.stopPropagation();
                                window.location.href = `/subscriptions/${subscription.id}`;
                              }}
                            >
                              <ChevronRight className="h-4 w-4" />
                            </Button>
                            {subscription.status === 'active' && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleStatusChange(subscription.id, 'canceled');
                                }}
                                className="text-mailr-red hover:text-red-400 hover:bg-transparent"
                              >
                                <XCircle className="h-4 w-4" />
                              </Button>
                            )}
                            {subscription.status === 'canceled' && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleStatusChange(subscription.id, 'active');
                                }}
                                className="text-green-500 hover:text-green-400 hover:bg-transparent"
                              >
                                <RefreshCw className="h-4 w-4" />
                              </Button>
                            )}
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-gray-400 hover:text-white hover:bg-transparent"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <FileText className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-gray-400 hover:text-white hover:bg-transparent"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <CreditCard className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
          
          <TabsContent value="active" className="mt-4">
            <div className="bg-mailr-darkgray rounded-md border border-mailr-lightgray overflow-hidden">
              <Table>
                <TableHeader className="bg-black/30">
                  <TableRow className="hover:bg-transparent border-mailr-lightgray">
                    <TableHead>ID</TableHead>
                    <TableHead>Last Billing</TableHead>
                    <TableHead>Next Billing</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Order ID</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activeSubscriptions.filter(sub => 
                    sub.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    sub.orderId?.toLowerCase().includes(searchTerm.toLowerCase())
                  ).map((subscription) => (
                    <TableRow 
                      key={subscription.id} 
                      className="hover:bg-mailr-lightgray/10 border-mailr-lightgray cursor-pointer group"
                      onClick={() => window.location.href = `/subscriptions/${subscription.id}`}
                    >
                      <TableCell className="font-mono text-xs">{subscription.id}</TableCell>
                      <TableCell>{subscription.lastBillingDate || 'N/A'}</TableCell>
                      <TableCell>{subscription.billingDate}</TableCell>
                      <TableCell>{subscription.quantity}</TableCell>
                      <TableCell>${subscription.price * subscription.quantity}</TableCell>
                      <TableCell className="font-mono text-xs">{subscription.orderId || 'N/A'}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStatusChange(subscription.id, 'canceled');
                            }}
                            className="text-mailr-red hover:text-red-400 hover:bg-transparent"
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-gray-400 hover:text-white hover:bg-transparent"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <FileText className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-gray-400 hover:text-white hover:bg-transparent"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <CreditCard className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
          
          <TabsContent value="canceled" className="mt-4">
            <div className="bg-mailr-darkgray rounded-md border border-mailr-lightgray overflow-hidden">
              <Table>
                <TableHeader className="bg-black/30">
                  <TableRow className="hover:bg-transparent border-mailr-lightgray">
                    <TableHead>ID</TableHead>
                    <TableHead>Last Billing</TableHead>
                    <TableHead>Next Billing</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Order ID</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {canceledSubscriptions.filter(sub => 
                    sub.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    sub.orderId?.toLowerCase().includes(searchTerm.toLowerCase())
                  ).map((subscription) => (
                    <TableRow 
                      key={subscription.id} 
                      className="hover:bg-mailr-lightgray/10 border-mailr-lightgray cursor-pointer group"
                      onClick={() => window.location.href = `/subscriptions/${subscription.id}`}
                    >
                      <TableCell className="font-mono text-xs">{subscription.id}</TableCell>
                      <TableCell>{subscription.lastBillingDate || 'N/A'}</TableCell>
                      <TableCell>{subscription.billingDate}</TableCell>
                      <TableCell>{subscription.quantity}</TableCell>
                      <TableCell>${subscription.price * subscription.quantity}</TableCell>
                      <TableCell className="font-mono text-xs">{subscription.orderId || 'N/A'}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStatusChange(subscription.id, 'active');
                            }}
                            className="text-green-500 hover:text-green-400 hover:bg-transparent"
                          >
                            <RefreshCw className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-gray-400 hover:text-white hover:bg-transparent"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <FileText className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
          
          <TabsContent value="expired" className="mt-4">
            <div className="bg-mailr-darkgray rounded-md border border-mailr-lightgray overflow-hidden">
              <Table>
                <TableHeader className="bg-black/30">
                  <TableRow className="hover:bg-transparent border-mailr-lightgray">
                    <TableHead>ID</TableHead>
                    <TableHead>Last Billing</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Order ID</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {expiredSubscriptions.filter(sub => 
                    sub.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    sub.orderId?.toLowerCase().includes(searchTerm.toLowerCase())
                  ).map((subscription) => (
                    <TableRow 
                      key={subscription.id} 
                      className="hover:bg-mailr-lightgray/10 border-mailr-lightgray cursor-pointer group"
                      onClick={() => window.location.href = `/subscriptions/${subscription.id}`}
                    >
                      <TableCell className="font-mono text-xs">{subscription.id}</TableCell>
                      <TableCell>{subscription.lastBillingDate || 'N/A'}</TableCell>
                      <TableCell>{subscription.quantity}</TableCell>
                      <TableCell>${subscription.price * subscription.quantity}</TableCell>
                      <TableCell className="font-mono text-xs">{subscription.orderId || 'N/A'}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStatusChange(subscription.id, 'active');
                            }}
                            className="text-green-500 hover:text-green-400 hover:bg-transparent"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-gray-400 hover:text-white hover:bg-transparent"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <FileText className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default SubscriptionsPage;
