
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { Package, ChevronRight, X } from 'lucide-react';
import { useOrders, Order } from '@/contexts/OrderContext';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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

const OrdersPage = () => {
  const { orders, cancelOrder } = useOrders();
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'processing':
        return 'secondary';
      case 'completed':
        return 'default';
      case 'cancelled':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const handleOpenOrderCancelDialog = (order: Order, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedOrder(order);
    setDialogOpen(true);
  };

  const handleCancelOrder = () => {
    if (selectedOrder) {
      cancelOrder(selectedOrder.id);
      toast({
        title: "Order Cancelled",
        description: `Order ${selectedOrder.id} has been cancelled.`,
      });
      setDialogOpen(false);
      setSelectedOrder(null);
    }
  };

  return (
    <MainLayout title="Orders">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Orders</h1>
            <p className="text-muted-foreground">Manage and track your domain orders</p>
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center border rounded-lg bg-background">
            <Package className="w-12 h-12 mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium">No orders yet</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              When you place an order, it will appear here.
            </p>
          </div>
        ) : (
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Domains</TableHead>
                  <TableHead className="w-[160px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.id}</TableCell>
                    <TableCell>{format(new Date(order.date), 'MMM dd, yyyy')}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(order.status)}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>{order.domains.length}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Link 
                          to={`/orders/${order.id}`}
                          className="inline-flex items-center justify-center gap-1 text-sm font-medium text-primary"
                        >
                          Details
                          <ChevronRight className="w-4 h-4" />
                        </Link>
                        
                        {order.status !== 'cancelled' && (
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="text-destructive hover:bg-destructive/10"
                            onClick={(e) => handleOpenOrderCancelDialog(order, e)}
                          >
                            <X className="w-4 h-4 mr-1" />
                            Cancel
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Order</DialogTitle>
            <DialogDescription>
              {selectedOrder && 
                `Are you sure you want to cancel order ${selectedOrder.id}? All domains will be cancelled. This action cannot be undone.`
              }
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter className="sm:justify-start gap-3">
            <Button
              type="button"
              variant="destructive"
              onClick={handleCancelOrder}
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

export default OrdersPage;
