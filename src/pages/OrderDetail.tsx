
import React, { useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, X, AlertTriangle, Download } from 'lucide-react';
import { format } from 'date-fns';
import { useOrders, Domain } from '@/contexts/OrderContext';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import MainLayout from '@/components/layout/MainLayout';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from '@/hooks/use-toast';

const OrderDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getOrderById, cancelDomain, cancelOrder } = useOrders();
  const { invoices } = useSubscription();
  const { toast } = useToast();
  
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedDomain, setSelectedDomain] = useState<Domain | null>(null);
  const [cancelType, setCancelType] = useState<'domain' | 'order'>('domain');
  
  const order = useMemo(() => getOrderById(id || ''), [id, getOrderById]);

  if (!order) {
    return (
      <MainLayout title="Order Not Found">
        <div className="flex flex-col items-center justify-center h-[50vh]">
          <h2 className="text-2xl font-bold">Order not found</h2>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => navigate('/')}
          >
            Back to Dashboard
          </Button>
        </div>
      </MainLayout>
    );
  }

  const monthlyCost = order.domains.length * 25;

  const getDomainStatusBadge = (domain: Domain) => {
    switch (domain.status) {
      case 'active': 
        return <Badge className="bg-green-600 text-white px-2 py-1 text-xs">Active</Badge>;
      case 'pending': 
        return <Badge className="bg-yellow-600 text-white px-2 py-1 text-xs">Pending</Badge>;
      case 'failed': 
        return <Badge className="bg-red-600 text-white px-2 py-1 text-xs">Failed</Badge>;
      case 'cancelled': 
        return <Badge className="bg-[#9b1313] text-white px-2 py-1 text-xs">Cancelled</Badge>;
      default: 
        return null;
    }
  };
  
  const handleOpenDomainCancelDialog = (domain: Domain) => {
    setSelectedDomain(domain);
    setCancelType('domain');
    setDialogOpen(true);
  };
  
  const handleOpenOrderCancelDialog = () => {
    setCancelType('order');
    setDialogOpen(true);
  };
  
  const handleCancel = () => {
    if (cancelType === 'domain' && selectedDomain) {
      cancelDomain(order.id, selectedDomain.id);
      toast({
        title: "Domain Cancelled",
        description: `${selectedDomain.name} has been cancelled.`,
      });
    } else if (cancelType === 'order') {
      cancelOrder(order.id);
      toast({
        title: "Order Cancelled",
        description: `Order ${order.id} has been cancelled.`,
      });
    }
    setDialogOpen(false);
  };
  
  const orderStatusBadge = () => {
    switch (order.status) {
      case 'processing':
        return <Badge className="bg-amber-600 text-white px-2 py-1 text-xs">In Progress</Badge>;
      case 'completed':
        return <Badge className="bg-green-600 text-white px-2 py-1 text-xs">Completed</Badge>;
      case 'cancelled':
        return <Badge className="bg-[#9b1313] text-white px-2 py-1 text-xs">Canceled</Badge>;
      default:
        return null;
    }
  };

  return (
    <MainLayout title="Order Details">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm" 
              className="gap-1"
              onClick={() => navigate('/')}
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold">Order Placed on {format(new Date(order.date), 'MMMM dd, yyyy')}</h1>
                {orderStatusBadge()}
              </div>
              <p className="text-muted-foreground">
                Monthly Cost: ${monthlyCost.toLocaleString()}/mo
              </p>
            </div>
          </div>
          
          {order.status !== 'cancelled' && (
            <Button 
              variant="outline"
              className="text-destructive border-destructive hover:bg-destructive/10"
              onClick={handleOpenOrderCancelDialog}
            >
              <X className="w-4 h-4 mr-2" />
              Cancel Order
            </Button>
          )}
        </div>

        <Tabs defaultValue="domains" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="domains">Domains ({order.domains.length})</TabsTrigger>
            <TabsTrigger value="billing">Billing History</TabsTrigger>
          </TabsList>
          
          <TabsContent value="domains" className="space-y-4">
            <div className="bg-mailr-darkgray rounded-md border border-mailr-lightgray overflow-hidden">
              <Table>
                <TableHeader className="bg-black/30">
                  <TableRow className="hover:bg-transparent border-mailr-lightgray">
                    <TableHead className="w-12">
                      <Checkbox />
                    </TableHead>
                    <TableHead>Domain</TableHead>
                    <TableHead>Forwarding URL</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Nameservers</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {order.domains.map((domain) => (
                    <TableRow key={domain.id} className="hover:bg-mailr-lightgray/10 border-mailr-lightgray">
                      <TableCell>
                        <Checkbox />
                      </TableCell>
                      <TableCell>{domain.name}</TableCell>
                      <TableCell>{domain.url}</TableCell>
                      <TableCell>
                        {getDomainStatusBadge(domain)}
                      </TableCell>
                      <TableCell>{domain.nameservers}</TableCell>
                      <TableCell className="text-right">
                        {domain.status !== 'cancelled' && (
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="text-destructive hover:bg-destructive/10"
                            onClick={() => handleOpenDomainCancelDialog(domain)}
                          >
                            <X className="w-4 h-4 mr-1" />
                            Cancel
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
          
          <TabsContent value="billing" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Last Billing</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{format(new Date(order.date), 'MMM dd, yyyy')}</div>
                  <p className="text-xs text-muted-foreground mt-1">${monthlyCost.toLocaleString()} charged</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Next Billing</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {format(new Date(new Date(order.date).getTime() + 30 * 24 * 60 * 60 * 1000), 'MMM dd, yyyy')}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">${monthlyCost.toLocaleString()} will be charged</p>
                </CardContent>
              </Card>
            </div>
            
            <div className="bg-mailr-darkgray rounded-md border border-mailr-lightgray overflow-hidden">
              <Table>
                <TableHeader className="bg-black/30">
                  <TableRow className="hover:bg-transparent border-mailr-lightgray">
                    <TableHead>Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoices.slice(0, 5).map((invoice) => (
                    <TableRow key={invoice.id} className="hover:bg-mailr-lightgray/10 border-mailr-lightgray">
                      <TableCell>{invoice.date}</TableCell>
                      <TableCell>${invoice.amount.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge className={
                          invoice.status === 'paid' 
                            ? "bg-green-600 text-white px-2 py-1 text-xs"
                            : invoice.status === 'pending'
                            ? "bg-yellow-600 text-white px-2 py-1 text-xs"
                            : "bg-red-600 text-white px-2 py-1 text-xs"
                        }>
                          {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          <Download className="w-4 h-4 mr-1" />
                          Download
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {cancelType === 'domain' ? 'Cancel Domain' : 'Cancel Order'}
            </DialogTitle>
            <DialogDescription>
              {cancelType === 'domain' && selectedDomain 
                ? `Are you sure you want to cancel ${selectedDomain.name}? This action cannot be undone.`
                : `Are you sure you want to cancel this entire order? All domains will be cancelled. This action cannot be undone.`
              }
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter className="sm:justify-start gap-3">
            <Button
              type="button"
              variant="destructive"
              onClick={handleCancel}
            >
              Confirm Cancellation
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setDialogOpen(false)}
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default OrderDetail;
