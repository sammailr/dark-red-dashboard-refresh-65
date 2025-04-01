
import React, { createContext, useContext, useState, ReactNode } from 'react';

type Subscription = {
  id: string;
  name: string;
  status: 'active' | 'canceled' | 'trial';
  price: number;
  billingDate: string;
  quantity?: number;
  daysRemaining?: number;
};

type SubscriptionState = {
  isFreeTrial: boolean;
  daysRemaining: number;
  hasPaymentMethod: boolean;
  subscriptions: Subscription[];
  toggleSubscriptionStatus: () => void;
  togglePaymentMethodStatus: () => void;
  addSubscription: (subscription: Subscription) => void;
  removeSubscription: (id: string) => void;
  updateSubscription: (id: string, updates: Partial<Subscription>) => void;
};

const SubscriptionContext = createContext<SubscriptionState | undefined>(undefined);

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const [isFreeTrial, setIsFreeTrial] = useState(true);
  const [daysRemaining, setDaysRemaining] = useState(14);
  const [hasPaymentMethod, setHasPaymentMethod] = useState(false);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([
    {
      id: '1',
      name: 'Mailr Standard',
      status: 'active',
      price: 60,
      quantity: 1,
      billingDate: 'Oct 15, 2023'
    }
  ]);

  const toggleSubscriptionStatus = () => {
    setIsFreeTrial(prev => !prev);
  };

  const togglePaymentMethodStatus = () => {
    setHasPaymentMethod(prev => !prev);
  };

  const addSubscription = (subscription: Subscription) => {
    setSubscriptions(prev => [...prev, subscription]);
  };

  const removeSubscription = (id: string) => {
    setSubscriptions(prev => prev.filter(sub => sub.id !== id));
  };

  const updateSubscription = (id: string, updates: Partial<Subscription>) => {
    setSubscriptions(prev => 
      prev.map(sub => sub.id === id ? { ...sub, ...updates } : sub)
    );
  };

  return (
    <SubscriptionContext.Provider 
      value={{ 
        isFreeTrial, 
        daysRemaining, 
        hasPaymentMethod,
        subscriptions,
        toggleSubscriptionStatus,
        togglePaymentMethodStatus,
        addSubscription,
        removeSubscription,
        updateSubscription
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
