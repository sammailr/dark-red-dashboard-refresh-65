
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
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
    <MainLayout title="ORDER INBOXES">
      <div className="min-h-[80vh] flex flex-col items-center justify-center space-y-12">
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-bold tracking-wide text-white">SELECT PROVIDER</h2>
          <p className="text-base text-gray-400 font-medium leading-relaxed max-w-md">
            Choose your preferred inbox provider to get started with premium email solutions
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl w-full px-4">
          {/* Google Card */}
          <div className="group cursor-pointer" onClick={() => handleProviderSelect('google')}>
            <div className="bg-[#1A1A1A] border border-gray-800 rounded-2xl p-8 h-64 flex flex-col items-center justify-center space-y-6 transition-all duration-300 hover:bg-[#1F1F1F] hover:border-gray-700 hover:shadow-2xl hover:shadow-red-500/10 hover:scale-[1.02]">
              <div className="relative">
                <div className="absolute inset-0 bg-red-500/20 rounded-full blur-xl group-hover:bg-red-500/30 transition-all duration-300"></div>
                <div className="relative bg-gradient-to-br from-red-500 to-red-600 p-4 rounded-2xl shadow-lg">
                  <i className="fa-brands fa-google text-white text-4xl"></i>
                </div>
              </div>
              
              <div className="text-center space-y-2">
                <h3 className="text-2xl font-bold text-white group-hover:text-red-400 transition-colors duration-300">
                  Google Workspace
                </h3>
                <p className="text-sm text-gray-400 leading-relaxed px-2">
                  Premium Google workspace inboxes with enterprise-grade security
                </p>
              </div>
            </div>
          </div>

          {/* Microsoft Card */}
          <div className="group cursor-pointer" onClick={() => handleProviderSelect('microsoft')}>
            <div className="bg-[#1A1A1A] border border-gray-800 rounded-2xl p-8 h-64 flex flex-col items-center justify-center space-y-6 transition-all duration-300 hover:bg-[#1F1F1F] hover:border-gray-700 hover:shadow-2xl hover:shadow-blue-500/10 hover:scale-[1.02]">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-xl group-hover:bg-blue-500/30 transition-all duration-300"></div>
                <div className="relative bg-gradient-to-br from-blue-500 to-blue-600 p-4 rounded-2xl shadow-lg">
                  <i className="fa-brands fa-microsoft text-white text-4xl"></i>
                </div>
              </div>
              
              <div className="text-center space-y-2">
                <h3 className="text-2xl font-bold text-white group-hover:text-blue-400 transition-colors duration-300">
                  Microsoft 365
                </h3>
                <p className="text-sm text-gray-400 leading-relaxed px-2">
                  Professional Microsoft 365 inboxes with advanced collaboration tools
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center">
          <p className="text-xs text-gray-500 font-medium tracking-wide uppercase">
            Enterprise-grade email solutions
          </p>
        </div>
      </div>
    </MainLayout>
  );
};

export default OrderInboxesPage;
