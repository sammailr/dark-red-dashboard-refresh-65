
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  CreditCard, 
  Download, 
  FileText, 
  ArrowLeft, 
  Trash2, 
  AlertTriangle, 
  Edit, 
  MinusCircle,
  PlusCircle,
  Check,
  X,
  RefreshCw
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from '@/components/ui/pagination';

const SubscriptionDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { 
    getSubscriptionById, 
    getInvoicesForSubscription, 
    updateSubscriptionQuantity,
    updateSubscription
  } = useSubscription();
  
  const [newQuantity, setNewQuantity] = useState<number>(0);
  const [quantityError, setQuantityError] = useState<string | null>(null);
  const [showQuantityDialog, setShowQuantityDialog] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  
  const subscription = getSubscriptionById(id || '');
  const invoices = getInvoicesForSubscription(id || '');
  
  if (!subscription) {
    return (
      <MainLayout title="Subscription Not Found">
        <div className="flex flex-col items-center justify-center p-8">
          <h2 className="text-2xl font-bold mb-4">Subscription Not Found</h2>
          <p className="text-gray-400 mb-6">The subscription you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/subscriptions')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Subscriptions
          </Button>
        </div>
      </MainLayout>
    );
  }
  
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
  
  const handleQuantitySubmit = () => {
    if (!newQuantity) {
      setQuantityError("Please enter a valid quantity");
      return;
    }
    
    const success = updateSubscriptionQuantity(subscription.id, newQuantity);
    
    if (success) {
      setShowQuantityDialog(false);
      setQuantityError(null);
    } else {
      setQuantityError(`Quantity cannot be lower than ${subscription.quantity - (subscription.availableDomainSlots || 0)} (domains in use)`);
    }
  };
  
  const handleCancel = () => {
    updateSubscription(subscription.id, { status: 'canceled' });
  };
  
  const handleReactivate = () => {
    updateSubscription(subscription.id, { status: 'active' });
  };
  
  // Pagination logic
  const paginatedInvoices = invoices.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  
  const totalPages = Math.ceil(invoices.length / itemsPerPage);
  
  return (
    <MainLayout title={`Subscription Details - ${subscription.id}`}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Button variant="ghost" onClick={() => navigate('/subscriptions')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Subscriptions
          </Button>
          
          {subscription.status === 'active' ? (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm" className="bg-red-600 hover:bg-red-700">
                  <Trash2 className="h-4 w-4 mr-1" />
                  Cancel Subscription
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-mailr-darkgray border-mailr-lightgray">
                <AlertDialogHeader>
                  <AlertDialogTitle>Cancel Subscription?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to cancel this subscription? You'll still have access until the end of your current billing period ({subscription.billingDate}).
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="bg-mailr-lightgray text-white hover:bg-mailr-lightgray/80">Cancel</AlertDialogCancel>
                  <AlertDialogAction 
                    className="bg-red-600 hover:bg-red-700" 
                    onClick={handleCancel}
                  >
                    Yes, Cancel Subscription
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          ) : (
            subscription.status === 'canceled' && (
              <Button 
                variant="default"
                size="sm"
                className="bg-green-600 hover:bg-green-700"
                onClick={handleReactivate}
              >
                <RefreshCw className="h-4 w-4 mr-1" />
                Reactivate Subscription
              </Button>
            )
          )}
        </div>
        
        <Card className="bg-mailr-darkgray border-mailr-lightgray shadow-lg">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-xl">{subscription.name}</CardTitle>
                <CardDescription>ID: {subscription.id}</CardDescription>
              </div>
              <div>{getStatusBadge(subscription.status)}</div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <div className="text-sm text-gray-400">Billing Period</div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-mailr-red" />
                  {subscription.lastBillingDate || 'N/A'} to {subscription.billingDate}
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="text-sm text-gray-400">Quantity</div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    {subscription.quantity} {subscription.quantity === 1 ? 'domain' : 'domains'}
                  </div>
                  
                  {subscription.status === 'active' && (
                    <Dialog open={showQuantityDialog} onOpenChange={setShowQuantityDialog}>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="sm" className="ml-2 h-7 w-7 p-0">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-mailr-darkgray border-mailr-lightgray">
                        <DialogHeader>
                          <DialogTitle>Adjust Subscription Quantity</DialogTitle>
                          <DialogDescription>
                            Change the number of domains in your subscription.
                            {subscription.availableDomainSlots !== undefined && subscription.availableDomainSlots > 0 && (
                              <div className="mt-2 p-2 bg-amber-500/20 rounded-md text-amber-200 border border-amber-500/30 flex items-center">
                                <AlertTriangle className="h-4 w-4 mr-2 flex-shrink-0" />
                                <span>
                                  You have {subscription.availableDomainSlots} unused domain {subscription.availableDomainSlots === 1 ? 'slot' : 'slots'}. 
                                  You can reduce your quantity to a minimum of {subscription.quantity - subscription.availableDomainSlots}.
                                </span>
                              </div>
                            )}
                          </DialogDescription>
                        </DialogHeader>
                        
                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <Label htmlFor="quantity">Quantity</Label>
                            <div className="flex items-center">
                              <Button 
                                type="button" 
                                variant="outline" 
                                size="sm"
                                className="h-9 px-2"
                                onClick={() => setNewQuantity(prev => Math.max((prev || subscription.quantity) - 1, 1))}
                              >
                                <MinusCircle className="h-4 w-4" />
                              </Button>
                              
                              <Input
                                id="quantity"
                                value={newQuantity || subscription.quantity}
                                onChange={(e) => {
                                  const value = parseInt(e.target.value);
                                  if (!isNaN(value)) {
                                    setNewQuantity(value);
                                  }
                                }}
                                className="mx-2 text-center bg-mailr-lightgray/20 border-mailr-lightgray"
                              />
                              
                              <Button 
                                type="button" 
                                variant="outline" 
                                size="sm"
                                className="h-9 px-2"
                                onClick={() => setNewQuantity(prev => (prev || subscription.quantity) + 1)}
                              >
                                <PlusCircle className="h-4 w-4" />
                              </Button>
                            </div>
                            {quantityError && (
                              <p className="text-red-500 text-sm mt-1">{quantityError}</p>
                            )}
                          </div>
                          
                          <div className="bg-mailr-lightgray/10 p-3 rounded-md">
                            <div className="flex justify-between">
                              <span>Price per domain:</span>
                              <span>${subscription.price}</span>
                            </div>
                            <div className="flex justify-between font-bold mt-2 pt-2 border-t border-mailr-lightgray/20">
                              <span>New monthly total:</span>
                              <span>${(newQuantity || subscription.quantity) * subscription.price}</span>
                            </div>
                          </div>
                        </div>
                        
                        <DialogFooter>
                          <Button 
                            variant="ghost" 
                            onClick={() => {
                              setShowQuantityDialog(false);
                              setQuantityError(null);
                              setNewQuantity(subscription.quantity);
                            }}
                          >
                            Cancel
                          </Button>
                          <Button 
                            className="bg-mailr-red hover:bg-red-600" 
                            onClick={handleQuantitySubmit}
                          >
                            Save Changes
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  )}
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="text-sm text-gray-400">Monthly Price</div>
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-mailr-red" />
                  ${subscription.price * subscription.quantity}
                </div>
              </div>
            </div>
            
            <Separator className="my-6 bg-mailr-lightgray/20" />
            
            <div>
              <h3 className="font-medium text-lg mb-4">Invoice History</h3>
              
              {invoices.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  No invoices found for this subscription
                </div>
              ) : (
                <>
                  <div className="bg-mailr-darkgray rounded-md border border-mailr-lightgray overflow-hidden">
                    <Table>
                      <TableHeader className="bg-black/30">
                        <TableRow className="hover:bg-transparent border-mailr-lightgray">
                          <TableHead>Invoice #</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {paginatedInvoices.map((invoice) => (
                          <TableRow key={invoice.id} className="hover:bg-mailr-lightgray/10 border-mailr-lightgray">
                            <TableCell className="font-mono">{invoice.id}</TableCell>
                            <TableCell>{invoice.date}</TableCell>
                            <TableCell>${invoice.amount}</TableCell>
                            <TableCell>
                              <Badge 
                                className={
                                  invoice.status === 'paid' 
                                    ? 'bg-green-600' 
                                    : invoice.status === 'pending' 
                                    ? 'bg-amber-600' 
                                    : 'bg-red-600'
                                }
                              >
                                {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="sm" className="text-mailr-red hover:text-red-400 hover:bg-transparent">
                                <Download className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                  
                  {totalPages > 1 && (
                    <Pagination className="mt-4">
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious 
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 
                            className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                          />
                        </PaginationItem>
                        
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                          <PaginationItem key={page}>
                            <PaginationLink 
                              isActive={currentPage === page} 
                              onClick={() => setCurrentPage(page)}
                            >
                              {page}
                            </PaginationLink>
                          </PaginationItem>
                        ))}
                        
                        <PaginationItem>
                          <PaginationNext 
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  )}
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default SubscriptionDetail;
