
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Calendar, CreditCard, Clock } from 'lucide-react';

type SubscriptionHeaderProps = {
  id: string;
  status: 'active' | 'canceled' | 'trial' | 'expired';
  price: number;
  quantity: number;
  billingDate: string;
  lastBillingDate?: string;
};

const SubscriptionHeader: React.FC<SubscriptionHeaderProps> = ({
  id,
  status,
  price,
  quantity,
  billingDate,
  lastBillingDate,
}) => {
  const totalPrice = price * quantity;
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-600 text-white px-3 py-1">Active</Badge>;
      case 'canceled':
        return <Badge className="bg-orange-600 text-white px-3 py-1">Canceled</Badge>;
      case 'expired':
        return <Badge className="bg-red-600 text-white px-3 py-1">Expired</Badge>;
      case 'trial':
        return <Badge className="bg-blue-600 text-white px-3 py-1">Trial</Badge>;
      default:
        return <Badge className="bg-gray-600 text-white px-3 py-1">Unknown</Badge>;
    }
  };

  // Calculate billing period if available
  const getBillingPeriod = () => {
    if (status === 'active' || status === 'canceled') {
      const nextDate = new Date(billingDate);
      // Convert to simple display format
      return `${lastBillingDate || 'N/A'} to ${billingDate}`;
    }
    return 'No active billing period';
  };

  return (
    <Card className="w-full bg-mailr-darkgray border border-mailr-lightgray/50 shadow-lg p-6 rounded-lg mb-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div className="flex flex-col space-y-1 mb-4 md:mb-0">
          <h1 className="text-3xl font-bold text-white">${totalPrice.toLocaleString()}<span className="text-lg text-gray-400 ml-1">/monthly</span></h1>
          <p className="text-sm text-gray-400 font-mono">ID: {id}</p>
        </div>
        <div>{getStatusBadge(status)}</div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 text-white">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10 bg-mailr-red/10 rounded-full flex items-center justify-center mr-3">
            <CreditCard className="h-5 w-5 text-mailr-red" />
          </div>
          <div>
            <p className="text-sm text-gray-400">Price</p>
            <p className="font-medium">${price} per domain</p>
          </div>
        </div>
        
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10 bg-green-500/10 rounded-full flex items-center justify-center mr-3">
            <Calendar className="h-5 w-5 text-green-500" />
          </div>
          <div>
            <p className="text-sm text-gray-400">Billing Period</p>
            <p className="font-medium">{getBillingPeriod()}</p>
          </div>
        </div>
        
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10 bg-blue-500/10 rounded-full flex items-center justify-center mr-3">
            <Clock className="h-5 w-5 text-blue-500" />
          </div>
          <div>
            <p className="text-sm text-gray-400">Quantity</p>
            <p className="font-medium">{quantity} domains</p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default SubscriptionHeader;
