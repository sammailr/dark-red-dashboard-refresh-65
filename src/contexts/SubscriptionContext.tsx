
import React, { createContext, useContext, useState, ReactNode } from 'react';

type Invoice = {
  id: string;
  subscriptionId: string;
  amount: number;
  date: string;
  status: 'paid' | 'pending' | 'failed';
  pdfUrl?: string;
};

type Subscription = {
  id: string;
  status: 'active' | 'canceled' | 'trial' | 'expired';
  price: number;
  billingDate: string;
  quantity: number;
  daysRemaining?: number;
  lastBillingDate?: string;
  orderId?: string;
  availableDomainSlots?: number;
};

type SubscriptionState = {
  isFreeTrial: boolean;
  daysRemaining: number;
  hasPaymentMethod: boolean;
  subscriptions: Subscription[];
  invoices: Invoice[];
  toggleSubscriptionStatus: () => void;
  togglePaymentMethodStatus: () => void;
  addSubscription: (subscription: Subscription) => void;
  removeSubscription: (id: string) => void;
  updateSubscription: (id: string, updates: Partial<Subscription>) => void;
  updateSubscriptionQuantity: (id: string, newQuantity: number) => boolean;
  getSubscriptionById: (id: string) => Subscription | undefined;
  getInvoicesForSubscription: (subscriptionId: string) => Invoice[];
  cancelSubscription: (id: string) => void;
  reactivateSubscription: (id: string) => void;
};

const SubscriptionContext = createContext<SubscriptionState | undefined>(undefined);

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const [isFreeTrial, setIsFreeTrial] = useState(true);
  const [daysRemaining, setDaysRemaining] = useState(14);
  const [hasPaymentMethod, setHasPaymentMethod] = useState(false);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([
    {
      id: 'sub_1',
      status: 'active',
      price: 60,
      quantity: 1,
      billingDate: 'Apr 15, 2024',
      lastBillingDate: 'Mar 15, 2024',
      orderId: 'ord_12345abc',
      availableDomainSlots: 1
    },
    {
      id: 'sub_2',
      status: 'active',
      price: 60,
      quantity: 2,
      billingDate: 'Apr 22, 2024',
      lastBillingDate: 'Mar 22, 2024',
      orderId: 'ord_67890def',
      availableDomainSlots: 1
    },
    {
      id: 'sub_3',
      status: 'canceled',
      price: 60,
      quantity: 1,
      billingDate: 'May 05, 2024',
      lastBillingDate: 'Apr 05, 2024',
      orderId: 'ord_abcde123',
      availableDomainSlots: 0
    },
    {
      id: 'sub_4',
      status: 'expired',
      price: 60,
      quantity: 3,
      billingDate: 'N/A',
      lastBillingDate: 'Feb 10, 2024',
      orderId: 'ord_fghij456',
      availableDomainSlots: 0
    },
    {
      id: 'sub_5',
      status: 'active',
      price: 60,
      quantity: 5,
      billingDate: 'Apr 30, 2024',
      lastBillingDate: 'Mar 30, 2024',
      orderId: 'ord_klmno789',
      availableDomainSlots: 3
    }
  ]);

  const [invoices, setInvoices] = useState<Invoice[]>([
    { id: 'inv_001', subscriptionId: 'sub_1', amount: 60, date: 'Mar 15, 2024', status: 'paid', pdfUrl: '#' },
    { id: 'inv_002', subscriptionId: 'sub_1', amount: 60, date: 'Feb 15, 2024', status: 'paid', pdfUrl: '#' },
    { id: 'inv_003', subscriptionId: 'sub_1', amount: 60, date: 'Jan 15, 2024', status: 'paid', pdfUrl: '#' },
    { id: 'inv_004', subscriptionId: 'sub_2', amount: 120, date: 'Mar 22, 2024', status: 'paid', pdfUrl: '#' },
    { id: 'inv_005', subscriptionId: 'sub_2', amount: 120, date: 'Feb 22, 2024', status: 'paid', pdfUrl: '#' },
    { id: 'inv_006', subscriptionId: 'sub_3', amount: 60, date: 'Apr 05, 2024', status: 'paid', pdfUrl: '#' },
    { id: 'inv_007', subscriptionId: 'sub_3', amount: 60, date: 'Mar 05, 2024', status: 'paid', pdfUrl: '#' },
    { id: 'inv_008', subscriptionId: 'sub_4', amount: 180, date: 'Feb 10, 2024', status: 'paid', pdfUrl: '#' },
    { id: 'inv_009', subscriptionId: 'sub_4', amount: 180, date: 'Jan 10, 2024', status: 'paid', pdfUrl: '#' },
    { id: 'inv_010', subscriptionId: 'sub_5', amount: 300, date: 'Mar 30, 2024', status: 'paid', pdfUrl: '#' },
    { id: 'inv_011', subscriptionId: 'sub_5', amount: 300, date: 'Feb 29, 2024', status: 'paid', pdfUrl: '#' },
    { id: 'inv_012', subscriptionId: 'sub_5', amount: 300, date: 'Jan 30, 2024', status: 'paid', pdfUrl: '#' },
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

  const updateSubscriptionQuantity = (id: string, newQuantity: number): boolean => {
    const subscription = subscriptions.find(sub => sub.id === id);
    
    if (!subscription) return false;
    
    // Check if new quantity is valid (can only decrease based on availableDomainSlots)
    const currentQuantity = subscription.quantity;
    const availableSlots = subscription.availableDomainSlots || 0;
    
    // Minimum quantity must be (current - availableSlots)
    const minAllowedQuantity = currentQuantity - availableSlots;
    
    if (newQuantity < minAllowedQuantity) {
      return false; // Cannot decrease below used slots
    }
    
    updateSubscription(id, { 
      quantity: newQuantity,
      // Update the availableDomainSlots if decreasing quantity
      availableDomainSlots: newQuantity < currentQuantity 
        ? Math.max(0, availableSlots - (currentQuantity - newQuantity))
        : newQuantity > currentQuantity
          ? availableSlots + (newQuantity - currentQuantity)
          : availableSlots
    });
    return true;
  };

  const cancelSubscription = (id: string) => {
    updateSubscription(id, { status: 'canceled' });
  };

  const reactivateSubscription = (id: string) => {
    updateSubscription(id, { status: 'active' });
  };

  const getSubscriptionById = (id: string) => {
    return subscriptions.find(sub => sub.id === id);
  };

  const getInvoicesForSubscription = (subscriptionId: string) => {
    return invoices.filter(invoice => invoice.subscriptionId === subscriptionId);
  };

  return (
    <SubscriptionContext.Provider 
      value={{ 
        isFreeTrial, 
        daysRemaining, 
        hasPaymentMethod,
        subscriptions,
        invoices,
        toggleSubscriptionStatus,
        togglePaymentMethodStatus,
        addSubscription,
        removeSubscription,
        updateSubscription,
        updateSubscriptionQuantity,
        getSubscriptionById,
        getInvoicesForSubscription,
        cancelSubscription,
        reactivateSubscription
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
