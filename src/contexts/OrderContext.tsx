
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

// Sample data
const sampleOrders: Order[] = [
  {
    id: "ord-001",
    date: "2025-03-28",
    status: "processing",
    domains: [
      { id: "dom-001", name: "example1.com", status: "pending", progress: 30 },
      { id: "dom-002", name: "mydomain.net", status: "active", progress: 70 },
    ]
  },
  {
    id: "ord-002",
    date: "2025-04-01",
    status: "completed",
    domains: [
      { id: "dom-003", name: "mybusiness.org", status: "active", progress: 100 },
      { id: "dom-004", name: "newproject.io", status: "active", progress: 100 },
    ]
  },
  {
    id: "ord-003",
    date: "2025-04-03",
    status: "processing",
    domains: [
      { id: "dom-005", name: "startup.co", status: "pending", progress: 50 },
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
                status: 'cancelled',
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
