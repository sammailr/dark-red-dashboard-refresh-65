
import React, { createContext, useContext, useState, ReactNode } from 'react';

type SubscriptionState = {
  isFreeTrial: boolean;
  daysRemaining: number;
  hasPaymentMethod: boolean;
  toggleSubscriptionStatus: () => void;
  togglePaymentMethodStatus: () => void;
};

const SubscriptionContext = createContext<SubscriptionState | undefined>(undefined);

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const [isFreeTrial, setIsFreeTrial] = useState(true);
  const [daysRemaining, setDaysRemaining] = useState(14);
  const [hasPaymentMethod, setHasPaymentMethod] = useState(false);

  const toggleSubscriptionStatus = () => {
    setIsFreeTrial(prev => !prev);
  };

  const togglePaymentMethodStatus = () => {
    setHasPaymentMethod(prev => !prev);
  };

  return (
    <SubscriptionContext.Provider 
      value={{ 
        isFreeTrial, 
        daysRemaining, 
        hasPaymentMethod,
        toggleSubscriptionStatus,
        togglePaymentMethodStatus
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
}
