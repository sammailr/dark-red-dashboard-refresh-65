
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { useSubscription } from '@/contexts/SubscriptionContext';
import SubscriptionHeader from '@/components/subscription/SubscriptionHeader';
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
  CardFooter,
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogClose
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { 
  Calendar, 
  CreditCard, 
  Download, 
  ArrowLeft, 
  Trash2, 
  AlertTriangle, 
  Edit, 
  MinusCircle,
  PlusCircle,
  RefreshCw
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';

const SubscriptionDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { 
    getSubscriptionById, 
    getInvoicesForSubscription, 
    updateSubscription,
    updateSubscriptionQuantity
  } = useSubscription();
  const [newQuantity, setNewQuantity] = useState<number>(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();
  
  const subscription = getSubscriptionById(id || '');
  const invoices = getInvoicesForSubscription(id || '');
  
  if (!subscription) {
    return (
      <MainLayout title="Subscription Not Found">
        <div className="flex flex-col items-center justify-center py-12">
          <AlertTriangle className="h-16 w-16 text-red-500 mb-4" />
          <h2 className="text-2xl font-bold mb-2">Subscription Not Found</h2>
          <p className="text-gray-400 mb-6">The subscription you're looking for doesn't exist or has been removed.</p>
          <Button asChild>
            <Link to="/subscriptions">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Subscriptions
            </Link>
          </Button>
        </div>
      </MainLayout>
    );
  }

  const handleStatusChange = (newStatus: 'active' | 'canceled' | 'expired') => {
    updateSubscription(subscription.id, { status: newStatus });
    
    toast({
      title: `Subscription ${newStatus}`,
      description: `The subscription has been ${newStatus === 'active' ? 'reactivated' : newStatus}.`,
      variant: newStatus === 'active' ? 'default' : 'destructive',
    });
  };

  const handleQuantityChange = () => {
    const success = updateSubscriptionQuantity(subscription.id, newQuantity);
    
    if (success) {
      toast({
        title: "Quantity Updated",
        description: `The subscription quantity has been updated to ${newQuantity}.`,
      });
      setDialogOpen(false);
    } else {
      toast({
        title: "Error Updating Quantity",
        description: "Unable to decrease quantity below the number of used domains.",
        variant: "destructive",
      });
    }
  };

  const openQuantityDialog = () => {
    setNewQuantity(subscription.quantity);
    setDialogOpen(true);
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

  const getInvoiceStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge className="bg-green-600">Paid</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-600">Pending</Badge>;
      case 'failed':
        return <Badge className="bg-red-600">Failed</Badge>;
      default:
        return <Badge className="bg-gray-600">Unknown</Badge>;
    }
  };

  return (
    <MainLayout title="Subscription Details">
      <div className="space-y-6">
        <div className="flex items-center mb-6">
          <Button variant="outline" size="sm" className="mr-4" asChild>
            <Link to="/subscriptions">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Link>
          </Button>
        </div>

        {/* Using the new SubscriptionHeader component */}
        <SubscriptionHeader 
          id={subscription.id}
          status={subscription.status}
          price={subscription.price}
          quantity={subscription.quantity}
          billingDate={subscription.billingDate}
          lastBillingDate={subscription.lastBillingDate}
        />

        <Tabs defaultValue="details" className="w-full">
          <TabsList className="w-full bg-mailr-darkgray border-mailr-lightgray">
            <TabsTrigger value="details" className="flex-1">Details</TabsTrigger>
            <TabsTrigger value="invoices" className="flex-1">Invoice History</TabsTrigger>
          </TabsList>
          
          <TabsContent value="details" className="mt-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-mailr-darkgray border-mailr-lightgray">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <CreditCard className="h-5 w-5 mr-2 text-mailr-red" />
                    Billing Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-400">Order ID</p>
                    <p className="font-mono text-sm">{subscription.orderId || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Last Billing Date</p>
                    <p>{subscription.lastBillingDate || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Next Billing Date</p>
                    <p>{subscription.billingDate}</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-mailr-darkgray border-mailr-lightgray">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Edit className="h-5 w-5 mr-2 text-blue-400" />
                    Subscription Management
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-400">Status</p>
                    <div className="mt-1">{getStatusBadge(subscription.status)}</div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Quantity</p>
                    <div className="flex items-center mt-1">
                      <p className="mr-2">{subscription.quantity} domains</p>
                      {subscription.status === 'active' && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={openQuantityDialog}
                          className="text-xs h-7"
                        >
                          Adjust
                        </Button>
                      )}
                    </div>
                  </div>
                  {subscription.availableDomainSlots !== undefined && (
                    <div>
                      <p className="text-sm text-gray-400">Available Domain Slots</p>
                      <p>{subscription.availableDomainSlots} slots unused</p>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex justify-end pt-2 pb-6 px-6">
                  {subscription.status === 'active' && (
                    <Button 
                      variant="destructive" 
                      className="bg-red-600 hover:bg-red-700"
                      onClick={() => handleStatusChange('canceled')}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Cancel Subscription
                    </Button>
                  )}
                  {subscription.status === 'canceled' && (
                    <Button 
                      variant="default" 
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => handleStatusChange('active')}
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Reactivate Subscription
                    </Button>
                  )}
                  {subscription.status === 'expired' && (
                    <Button 
                      variant="default" 
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => handleStatusChange('active')}
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Renew Subscription
                    </Button>
                  )}
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="invoices" className="mt-6">
            <Card className="bg-mailr-darkgray border-mailr-lightgray">
              <CardHeader>
                <CardTitle className="text-lg">Invoice History</CardTitle>
                <CardDescription>
                  View and download your past invoices
                </CardDescription>
              </CardHeader>
              <CardContent>
                {invoices.length === 0 ? (
                  <div className="text-center py-6">
                    <p className="text-gray-400">No invoices found for this subscription</p>
                  </div>
                ) : (
                  <div className="rounded-md border border-mailr-lightgray overflow-hidden">
                    <Table>
                      <TableHeader className="bg-black/30">
                        <TableRow className="hover:bg-transparent border-mailr-lightgray">
                          <TableHead>Invoice ID</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {invoices.map((invoice) => (
                          <TableRow key={invoice.id} className="hover:bg-mailr-lightgray/10 border-mailr-lightgray">
                            <TableCell className="font-mono text-xs">{invoice.id}</TableCell>
                            <TableCell>{invoice.date}</TableCell>
                            <TableCell>${invoice.amount}</TableCell>
                            <TableCell>{getInvoiceStatusBadge(invoice.status)}</TableCell>
                            <TableCell className="text-right">
                              {invoice.pdfUrl && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-gray-400 hover:text-white"
                                  asChild
                                >
                                  <a href={invoice.pdfUrl} target="_blank" rel="noopener noreferrer">
                                    <Download className="h-4 w-4" />
                                  </a>
                                </Button>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="sm:max-w-md bg-mailr-darkgray border-mailr-lightgray">
            <DialogHeader>
              <DialogTitle>Adjust Subscription Quantity</DialogTitle>
              <DialogDescription>
                Update the number of domains for this subscription. 
                {subscription.availableDomainSlots !== undefined && (
                  <span className="block mt-1 text-xs">
                    {subscription.availableDomainSlots === 0 
                      ? "You have no available domain slots. You can only increase quantity."
                      : `You have ${subscription.availableDomainSlots} unused domain slots.`}
                  </span>
                )}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="flex items-center justify-center">
                <Button
                  variant="outline" 
                  size="sm"
                  onClick={() => setNewQuantity(Math.max(newQuantity - 1, subscription.quantity - (subscription.availableDomainSlots || 0)))}
                  disabled={newQuantity <= (subscription.quantity - (subscription.availableDomainSlots || 0))}
                  className="rounded-r-none"
                >
                  <MinusCircle className="h-4 w-4" />
                </Button>
                <Input
                  className="w-20 text-center rounded-none"
                  type="number"
                  value={newQuantity}
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    if (!isNaN(value) && value >= (subscription.quantity - (subscription.availableDomainSlots || 0))) {
                      setNewQuantity(value);
                    }
                  }}
                  min={subscription.quantity - (subscription.availableDomainSlots || 0)}
                />
                <Button
                  variant="outline" 
                  size="sm"
                  onClick={() => setNewQuantity(newQuantity + 1)}
                  className="rounded-l-none"
                >
                  <PlusCircle className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="text-center text-sm text-gray-400">
                Total price: ${newQuantity * subscription.price}/month
              </div>
              
              {newQuantity < subscription.quantity && (
                <div className="text-amber-500 text-sm flex items-center mt-2">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Decreasing quantity will reduce your available domain slots.
                </div>
              )}
            </div>
            
            <DialogFooter className="sm:justify-between">
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button 
                onClick={handleQuantityChange}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Update Quantity
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
};

export default SubscriptionDetail;
