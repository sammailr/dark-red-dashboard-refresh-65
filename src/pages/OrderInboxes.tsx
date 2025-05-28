
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Globe, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const OrderInboxesPage = () => {
  const navigate = useNavigate();

  const handleProviderSelect = (provider: 'google' | 'microsoft') => {
    if (provider === 'google') {
      navigate('/order-google-inboxes');
    } else {
      navigate('/order-microsoft-inboxes');
    }
  };

  return (
    <MainLayout title="Order Inboxes">
      <div className="space-y-6">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold mb-2">Select Provider</h2>
          <p className="text-gray-400">Choose your inbox provider to get started</p>
        </div>
        
        <div className="grid grid-cols-2 gap-8 max-w-2xl mx-auto">
          <Button
            variant="outline"
            className="flex flex-col items-center justify-center h-40 px-6 py-8 bg-mailr-darkgray border-mailr-lightgray hover:bg-mailr-lightgray/10 transition-colors"
            onClick={() => handleProviderSelect('google')}
          >
            <Globe className="h-16 w-16 mb-4 text-blue-500" />
            <span className="text-lg font-medium">Google Inboxes</span>
            <span className="text-sm text-gray-400 mt-2">Order Google workspace inboxes</span>
          </Button>
          
          <Button
            variant="outline"
            className="flex flex-col items-center justify-center h-40 px-6 py-8 bg-mailr-darkgray border-mailr-lightgray hover:bg-mailr-lightgray/10 transition-colors"
            onClick={() => handleProviderSelect('microsoft')}
          >
            <Mail className="h-16 w-16 mb-4 text-blue-600" />
            <span className="text-lg font-medium">Microsoft Inboxes</span>
            <span className="text-sm text-gray-400 mt-2">Order Microsoft 365 inboxes</span>
          </Button>
        </div>
      </div>
    </MainLayout>
  );
};

export default OrderInboxesPage;
