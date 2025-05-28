import React from 'react';
import { ChevronDown, ToggleRight, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
type HeaderProps = {
  title: string;
};
const Header = ({
  title
}: HeaderProps) => {
  const {
    isFreeTrial,
    hasPaymentMethod,
    toggleSubscriptionStatus,
    togglePaymentMethodStatus
  } = useSubscription();
  return <div className="flex justify-between items-center pb-6 pt-4 border-b border-mailr-lightgray">
      <h1 className="text-3xl font-bold text-white">{title}</h1>
      
      <div className="flex items-center gap-6">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              
            </TooltipTrigger>
            <TooltipContent>
              <p>Toggle between Free Trial and Paid Subscription (for testing)</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              
            </TooltipTrigger>
            <TooltipContent>
              <p>Toggle payment method status (for testing)</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <div className="text-white font-medium">Bellum Capital</div>
        <div className="flex items-center">
          <span className="text-white mr-1">Clinton Veinot</span>
          <Button variant="ghost" className="p-0">
            <ChevronDown className="h-4 w-4 text-gray-400" />
          </Button>
        </div>
      </div>
    </div>;
};
export default Header;