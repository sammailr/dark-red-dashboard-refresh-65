
import React from 'react';
import { ChevronDown, ToggleRight, CreditCard, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Link } from 'react-router-dom';

type HeaderProps = {
  title: string;
};

const Header = ({ title }: HeaderProps) => {
  const {
    isFreeTrial,
    hasPaymentMethod,
    toggleSubscriptionStatus,
    togglePaymentMethodStatus
  } = useSubscription();

  return (
    <div className="flex justify-between items-center pb-6 pt-4 border-b border-mailr-lightgray">
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
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center text-white hover:bg-mailr-lightgray/10 px-3 py-2 h-auto">
              <span className="mr-2">Clinton Veinot</span>
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent 
            align="end" 
            className="w-56 bg-mailr-darkgray border-mailr-lightgray shadow-lg"
          >
            <DropdownMenuItem asChild className="cursor-pointer hover:bg-mailr-lightgray/20 focus:bg-mailr-lightgray/20">
              <Link to="/settings" className="flex items-center px-3 py-3">
                <User className="h-4 w-4 mr-3 text-gray-400" />
                <span className="text-white">Account</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="cursor-pointer hover:bg-mailr-lightgray/20 focus:bg-mailr-lightgray/20">
              <Link to="/settings" className="flex items-center px-3 py-3">
                <CreditCard className="h-4 w-4 mr-3 text-gray-400" />
                <span className="text-white">Billing</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-mailr-lightgray" />
            <DropdownMenuItem className="cursor-pointer hover:bg-mailr-lightgray/20 focus:bg-mailr-lightgray/20 px-3 py-3">
              <span className="text-gray-400">Sign out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default Header;
