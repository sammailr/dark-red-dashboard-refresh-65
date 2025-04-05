
import React, { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import { useOrders, Domain } from '@/contexts/OrderContext';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import MainLayout from '@/components/layout/MainLayout';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';

const OrderDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getOrderById } = useOrders();
  
  const order = useMemo(() => getOrderById(id || ''), [id, getOrderById]);

  const getDomainStatusColor = (status: Domain['status']) => {
    switch (status) {
      case 'active': return 'text-green-500';
      case 'pending': return 'text-amber-500';
      case 'failed': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  if (!order) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center h-[50vh]">
          <h2 className="text-2xl font-bold">Order not found</h2>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => navigate('/orders')}
          >
            Back to Orders
          </Button>
        </div>
      </MainLayout>
    );
  }

  const orderStatusBadge = () => {
    switch (order.status) {
      case 'processing':
        return <Badge variant="secondary">Processing</Badge>;
      case 'completed':
        return <Badge variant="default">Completed</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return null;
    }
  };

  const totalProgress = order.domains.reduce((sum, domain) => sum + domain.progress, 0) / order.domains.length;

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="sm" 
            className="gap-1"
            onClick={() => navigate('/orders')}
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold">Order {order.id}</h1>
              {orderStatusBadge()}
            </div>
            <p className="text-muted-foreground">
              Placed on {format(new Date(order.date), 'MMMM dd, yyyy')}
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>Overall Progress</span>
              <span className="text-lg">{Math.round(totalProgress)}%</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={totalProgress} className="h-2" />
          </CardContent>
        </Card>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Domains ({order.domains.length})</h2>
          
          {order.domains.map((domain) => (
            <Card key={domain.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">{domain.name}</CardTitle>
                  <HoverCard>
                    <HoverCardTrigger asChild>
                      <Badge 
                        variant="outline" 
                        className={`cursor-help ${getDomainStatusColor(domain.status)}`}
                      >
                        {domain.status.charAt(0).toUpperCase() + domain.status.slice(1)}
                      </Badge>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-80">
                      <div className="space-y-1">
                        <h4 className="text-sm font-semibold">Domain Status</h4>
                        <p className="text-sm">
                          {domain.status === 'active' && "Domain is active and working correctly."}
                          {domain.status === 'pending' && "Domain is being processed and configured."}
                          {domain.status === 'failed' && "Domain setup encountered an error."}
                        </p>
                      </div>
                    </HoverCardContent>
                  </HoverCard>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Progress value={domain.progress} className="h-2 flex-1" />
                  <span className="text-sm font-medium w-9 text-right">
                    {domain.progress}%
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default OrderDetail;
