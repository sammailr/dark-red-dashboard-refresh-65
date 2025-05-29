
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import OrderSummary from '@/components/order/OrderSummary';
import DomainsSection from '@/components/order/DomainsSection';
import InboxesSection from '@/components/order/InboxesSection';
import SendingPlatformSection from '@/components/order/SendingPlatformSection';

interface Domain {
  id: number;
  domain: string;
  forwardingUrl: string;
  displayNames: string[];
  selected?: boolean;
}

const OrderGoogleInboxesPage = () => {
  const [domains, setDomains] = useState<Domain[]>([]);
  const [newDomain, setNewDomain] = useState('');
  const [selectedSendingPlatform, setSelectedSendingPlatform] = useState<string | null>(null);
  const [mainForwardingUrl, setMainForwardingUrl] = useState('');
  const [domainRegistrar, setDomainRegistrar] = useState('');
  const [domainRegistrarLogin, setDomainRegistrarLogin] = useState('');
  const [domainRegistrarPassword, setDomainRegistrarPassword] = useState('');
  const [customDomainRegistrar, setCustomDomainRegistrar] = useState('');
  const [numberOfInboxes, setNumberOfInboxes] = useState('');
  const [userFullName, setUserFullName] = useState('');
  const [preferredPassword, setPreferredPassword] = useState('');

  // Calculate total inboxes
  const getTotalInboxes = () => {
    const domainsCount = domains.length;
    const inboxesPerDomain = parseInt(numberOfInboxes) || 0;
    return domainsCount * inboxesPerDomain;
  };

  const handleSubmit = () => {
    if (domains.length === 0) {
      toast.error('Please add at least one domain');
      return;
    }
    
    // Check minimum order requirement
    const totalInboxes = getTotalInboxes();
    if (totalInboxes < 30) {
      toast.error('The minimum order is 30 inboxes', {
        style: {
          background: '#dc2626',
          color: 'white',
          border: '1px solid #b91c1c'
        }
      });
      return;
    }
    
    for (const domain of domains) {
      if (!domain.forwardingUrl) {
        toast.error(`Please provide a forwarding URL for domain ${domain.domain}`);
        return;
      }
      if (domain.displayNames.length === 0) {
        toast.error(`Please add at least one display name for domain ${domain.domain}`);
        return;
      }
    }
    if (!selectedSendingPlatform) {
      toast.error('Please select a sending platform');
      return;
    }
    if (!numberOfInboxes) {
      toast.error('Please select number of inboxes per domain');
      return;
    }
    if (!userFullName.trim()) {
      toast.error('Please enter user full name');
      return;
    }
    if (!preferredPassword.trim()) {
      toast.error('Please enter preferred inboxes password');
      return;
    }
    toast.success('Order submitted successfully');
  };

  return (
    <MainLayout title="Order Google Inboxes">
      <div className="space-y-8 max-w-6xl mx-auto">
        {/* Order Summary Section */}
        <OrderSummary domains={domains} numberOfInboxes={numberOfInboxes} />

        {/* Domains Section */}
        <DomainsSection
          domains={domains}
          setDomains={setDomains}
          newDomain={newDomain}
          setNewDomain={setNewDomain}
          mainForwardingUrl={mainForwardingUrl}
          setMainForwardingUrl={setMainForwardingUrl}
          domainRegistrar={domainRegistrar}
          setDomainRegistrar={setDomainRegistrar}
          domainRegistrarLogin={domainRegistrarLogin}
          setDomainRegistrarLogin={setDomainRegistrarLogin}
          domainRegistrarPassword={domainRegistrarPassword}
          setDomainRegistrarPassword={setDomainRegistrarPassword}
          customDomainRegistrar={customDomainRegistrar}
          setCustomDomainRegistrar={setCustomDomainRegistrar}
        />
        
        {/* Inboxes Section */}
        <InboxesSection
          numberOfInboxes={numberOfInboxes}
          setNumberOfInboxes={setNumberOfInboxes}
          userFullName={userFullName}
          setUserFullName={setUserFullName}
          preferredPassword={preferredPassword}
          setPreferredPassword={setPreferredPassword}
        />
        
        {/* Sending Platform Section */}
        <SendingPlatformSection
          selectedSendingPlatform={selectedSendingPlatform}
          setSelectedSendingPlatform={setSelectedSendingPlatform}
        />
        
        {/* Submit Button Section with Visual Anchoring */}
        <div className="bg-[#121212] rounded-lg pt-6 pb-4 px-6 flex justify-end shadow-lg">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button className="bg-[#E00000] hover:bg-[#CC0000] text-white font-bold px-6 py-3 rounded-md shadow-md transition-all hover:shadow-lg">
                Order Inboxes
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-[#1A1A1A] border-[#444]">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-white">Confirm Order Submission</AlertDialogTitle>
                <AlertDialogDescription className="text-gray-400">
                  Are you sure you want to submit this order? This will create Google inboxes for all domains in the list.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="bg-transparent border-[#444] text-white hover:bg-[#2A2A2A]">Cancel</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={handleSubmit}
                  className="bg-[#E00000] hover:bg-[#CC0000] text-white"
                >
                  Confirm
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </MainLayout>
  );
};

export default OrderGoogleInboxesPage;
