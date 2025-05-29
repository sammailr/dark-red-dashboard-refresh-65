import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
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
      <div className="min-h-[80vh] flex flex-col items-center justify-center space-y-12">
        <div className="text-center space-y-3">
          <h2 className="text-2xl font-bold tracking-widest text-white uppercase">SELECT PROVIDER</h2>
          <p className="text-sm text-gray-400 font-medium leading-relaxed max-w-md">
            Choose your inbox provider to get started
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl w-full px-4">
          {/* Google Card */}
          <div 
            className="group cursor-pointer" 
            onClick={() => handleProviderSelect('google')}
          >
            <div className="bg-[#1A1A1A] border border-gray-800 rounded-xl p-6 h-56 flex flex-col justify-between transition-all duration-300 ease-in-out hover:bg-[#1F1F1F] hover:border-gray-700 hover:shadow-2xl hover:shadow-red-500/10 hover:scale-[1.03]">
              {/* Icon Container */}
              <div className="flex justify-start">
                <div className="relative">
                  <div className="absolute inset-0 bg-red-500/20 rounded-lg blur-sm group-hover:bg-red-500/30 transition-all duration-300"></div>
                  <div className="relative bg-gradient-to-br from-red-500 to-red-600 p-3 rounded-lg shadow-lg w-12 h-12 flex items-center justify-center">
                    <i className="fa-brands fa-google text-white text-xl"></i>
                  </div>
                </div>
              </div>
              
              {/* Content */}
              <div className="flex-1 flex flex-col justify-center space-y-3">
                <h3 className="text-xl font-bold text-white group-hover:text-red-400 transition-colors duration-300">
                  Google Workspace
                </h3>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Order Google workspace inboxes<br />3 inboxes per domain
                </p>
              </div>

              {/* Hover Arrow */}
              <div className="flex justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="text-red-400 text-sm font-medium">
                  Select →
                </div>
              </div>
            </div>
          </div>

          {/* Microsoft Card */}
          <div 
            className="group cursor-pointer" 
            onClick={() => handleProviderSelect('microsoft')}
          >
            <div className="bg-[#1A1A1A] border border-gray-800 rounded-xl p-6 h-56 flex flex-col justify-between transition-all duration-300 ease-in-out hover:bg-[#1F1F1F] hover:border-gray-700 hover:shadow-2xl hover:shadow-blue-500/10 hover:scale-[1.03]">
              {/* Icon Container */}
              <div className="flex justify-start">
                <div className="relative">
                  <div className="absolute inset-0 bg-blue-500/20 rounded-lg blur-sm group-hover:bg-blue-500/30 transition-all duration-300"></div>
                  <div className="relative bg-gradient-to-br from-blue-500 to-blue-600 p-3 rounded-lg shadow-lg w-12 h-12 flex items-center justify-center">
                    <i className="fa-brands fa-microsoft text-white text-xl"></i>
                  </div>
                </div>
              </div>
              
              {/* Content */}
              <div className="flex-1 flex flex-col justify-center space-y-3">
                <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors duration-300">
                  Microsoft 365
                </h3>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Order Microsoft 365 inboxes<br />99 inboxes per domain
                </p>
              </div>

              {/* Hover Arrow */}
              <div className="flex justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="text-blue-400 text-sm font-medium">
                  Select →
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default OrderInboxesPage;
