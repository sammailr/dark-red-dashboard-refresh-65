
import React from 'react';
import { Label } from '@/components/ui/label';

interface OrderSummaryProps {
  domains: any[];
  numberOfInboxes: string;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({ domains, numberOfInboxes }) => {
  // Calculate price per inbox based on total inboxes
  const calculatePricePerInbox = (totalInboxes: number) => {
    if (totalInboxes >= 400) return 2.00;
    if (totalInboxes >= 150) return 2.25;
    if (totalInboxes >= 30) return 2.50;
    return 2.50; // For less than 30, still use 2.50 but will show minimum order message
  };

  // Calculate total monthly cost
  const calculateTotalCost = () => {
    const domainsCount = domains.length;
    const inboxesPerDomain = parseInt(numberOfInboxes) || 0;
    const totalInboxes = domainsCount * inboxesPerDomain;
    const pricePerInbox = calculatePricePerInbox(totalInboxes);
    return totalInboxes * pricePerInbox;
  };

  // Calculate total inboxes
  const getTotalInboxes = () => {
    const domainsCount = domains.length;
    const inboxesPerDomain = parseInt(numberOfInboxes) || 0;
    return domainsCount * inboxesPerDomain;
  };

  // Calculate daily sending volume
  const getDailySendingVolume = () => {
    return getTotalInboxes() * 15;
  };

  return (
    <div className="bg-[#1A1A1A] rounded-lg border border-[#333] p-6">
      <h2 className="text-xl font-bold mb-4 text-white">Order Summary</h2>
      <div className="pb-4 mb-6">
        <p className="text-lg font-medium text-white">
          Total Monthly Cost: <span className="font-bold text-white">${calculateTotalCost().toFixed(2)}/month</span>
        </p>
        <div className="mt-2 space-y-1">
          <p className="text-sm text-[#B0B0B0]">
            Domains Added: <span className="font-medium text-white">{domains.length}</span>
          </p>
          <p className="text-sm text-[#B0B0B0]">
            Inboxes Added: <span className="font-medium text-white">{getTotalInboxes()}</span>
          </p>
          <p className="text-sm text-[#B0B0B0]">
            Daily Sending Volume: <span className="font-medium text-white">{getDailySendingVolume().toLocaleString()}</span>
          </p>
        </div>
      </div>
      
      {/* Pricing Breakdown with improved spacing */}
      <div className="border-t border-[#2D2D2D] pt-6">
        <h3 className="text-sm font-bold uppercase tracking-wider text-gray-300 mb-3 text-white">Pricing Breakdown</h3>
        <div className="space-y-2">
          <div className="text-sm text-gray-400">
            30–149 Inboxes: <span className="font-bold text-white">$2.50</span> each
          </div>
          <div className="text-sm text-gray-400">
            150–399 Inboxes: <span className="font-bold text-white">$2.25</span> each
          </div>
          <div className="text-sm text-gray-400">
            400+ Inboxes: <span className="font-bold text-white">$2.00</span> each
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
