
import React, { createContext, useContext, useState } from 'react';

// Define types for domain and orders
export type Domain = {
  id: string;
  name: string;
  status: 'pending' | 'active' | 'failed' | 'cancelled';
  progress: number;
};

export type Order = {
  id: string;
  date: string;
  status: 'processing' | 'completed' | 'cancelled';
  domains: Domain[];
};

type OrderContextType = {
  orders: Order[];
  getOrderById: (id: string) => Order | undefined;
  cancelDomain: (orderId: string, domainId: string) => void;
  cancelOrder: (orderId: string) => void;
};

const OrderContext = createContext<OrderContextType | undefined>(undefined);

// Sample data that matches the homepage order IDs
const sampleOrders: Order[] = [
  {
    id: "ordlgcLwveoDwOOBOWqNnEi",
    date: "2025-04-15",
    status: "cancelled",
    domains: [
      { id: "dom-001", name: "marketpro.com", status: "cancelled", progress: 0 },
      { id: "dom-002", name: "bizflow.net", status: "cancelled", progress: 0 },
      { id: "dom-003", name: "salesedge.org", status: "cancelled", progress: 0 }
    ]
  },
  {
    id: "ordDYfy4M5FkmloHlIyMls8",
    date: "2025-04-18",
    status: "cancelled",
    domains: [
      { id: "dom-004", name: "growthtech.io", status: "cancelled", progress: 0 },
      { id: "dom-005", name: "innovateplus.com", status: "cancelled", progress: 0 }
    ]
  },
  {
    id: "ordAgVdFyRiSEsg9VpmaTOM",
    date: "2025-04-18",
    status: "cancelled",
    domains: [
      { id: "dom-006", name: "digitalhub.net", status: "cancelled", progress: 0 },
      { id: "dom-007", name: "cloudboost.co", status: "cancelled", progress: 0 },
      { id: "dom-008", name: "webstream.org", status: "cancelled", progress: 0 },
      { id: "dom-009", name: "techsuite.io", status: "cancelled", progress: 0 }
    ]
  },
  {
    id: "ordZZzHA1pWq9Cauiz7CA0o",
    date: "2025-04-20",
    status: "processing",
    domains: [
      { id: "dom-010", name: "automateflow.com", status: "pending", progress: 45 },
      { id: "dom-011", name: "scalevault.net", status: "active", progress: 100 },
      { id: "dom-012", name: "databridge.org", status: "pending", progress: 30 }
    ]
  },
  {
    id: "ordlZ0LHSDi87RSIWBjmLqw",
    date: "2025-04-22",
    status: "processing",
    domains: [
      { id: "dom-013", name: "smartlead.io", status: "active", progress: 100 },
      { id: "dom-014", name: "convertmax.com", status: "pending", progress: 65 }
    ]
  },
  {
    id: "ordKL9mNx2PqRs4TuvWxYz",
    date: "2025-04-24",
    status: "completed",
    domains: [
      { id: "dom-015", name: "reachpeak.net", status: "active", progress: 100 }
    ]
  }
];

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>(sampleOrders);

  const getOrderById = (id: string) => {
    return orders.find(order => order.id === id);
  };

  const cancelDomain = (orderId: string, domainId: string) => {
    setOrders(prevOrders => 
      prevOrders.map(order => {
        if (order.id === orderId) {
          const updatedDomains = order.domains.map(domain => 
            domain.id === domainId ? { ...domain, status: 'cancelled' as const, progress: 0 } : domain
          );
          
          // Check if all domains are cancelled
          const allDomainsCancelled = updatedDomains.every(domain => domain.status === 'cancelled');
          
          return {
            ...order,
            domains: updatedDomains,
            status: allDomainsCancelled ? 'cancelled' : order.status
          };
        }
        return order;
      })
    );
  };

  const cancelOrder = (orderId: string) => {
    setOrders(prevOrders => 
      prevOrders.map(order => 
        order.id === orderId
          ? {
              ...order,
              status: 'cancelled',
              domains: order.domains.map(domain => ({ 
                ...domain, 
                status: 'cancelled' as const,
                progress: 0
              }))
            }
          : order
      )
    );
  };

  return (
    <OrderContext.Provider value={{ orders, getOrderById, cancelDomain, cancelOrder }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
};
