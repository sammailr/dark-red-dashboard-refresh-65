
import React, { createContext, useContext, useState, ReactNode } from 'react';

type SubscriptionState = {
  isFreeTrial: boolean;
  daysRemaining: number;
  toggleSubscriptionStatus: () => void;
};

const SubscriptionContext = createContext<SubscriptionState | undefined>(undefined);

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const [isFreeTrial, setIsFreeTrial] = useState(true);
  const [daysRemaining, setDaysRemaining] = useState(14);

  const toggleSubscriptionStatus = () => {
    setIsFreeTrial(prev => !prev);
  };

  return (
    <SubscriptionContext.Provider 
      value={{ 
        isFreeTrial, 
        daysRemaining, 
        toggleSubscriptionStatus 
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
