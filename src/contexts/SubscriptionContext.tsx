
import React, { createContext, useContext, useState, ReactNode } from 'react';

type Subscription = {
  id: string;
  name: string;
  status: 'active' | 'canceled' | 'trial' | 'expired';
  price: number;
  billingDate: string;
  quantity: number;
  daysRemaining?: number;
  lastBillingDate?: string;
  orderId?: string;
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
      id: 'sub_1',
      name: 'Mailr Standard',
      status: 'active',
      price: 60,
      quantity: 1,
      billingDate: 'Apr 15, 2024',
      lastBillingDate: 'Mar 15, 2024',
      orderId: 'ord_12345abc'
    },
    {
      id: 'sub_2',
      name: 'Mailr Standard',
      status: 'active',
      price: 60,
      quantity: 2,
      billingDate: 'Apr 22, 2024',
      lastBillingDate: 'Mar 22, 2024',
      orderId: 'ord_67890def'
    },
    {
      id: 'sub_3',
      name: 'Mailr Standard',
      status: 'canceled',
      price: 60,
      quantity: 1,
      billingDate: 'May 05, 2024',
      lastBillingDate: 'Apr 05, 2024',
      orderId: 'ord_abcde123'
    },
    {
      id: 'sub_4',
      name: 'Mailr Standard',
      status: 'expired',
      price: 60,
      quantity: 3,
      billingDate: 'N/A',
      lastBillingDate: 'Feb 10, 2024',
      orderId: 'ord_fghij456'
    },
    {
      id: 'sub_5',
      name: 'Mailr Standard',
      status: 'active',
      price: 60,
      quantity: 5,
      billingDate: 'Apr 30, 2024',
      lastBillingDate: 'Mar 30, 2024',
      orderId: 'ord_klmno789'
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
