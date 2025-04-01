import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, DollarSign, Globe, Inbox, Mail, FileText, TrendingUp, Clock, AlertCircle, CreditCard } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

const Index = () => {
  const { isFreeTrial, daysRemaining, hasPaymentMethod, subscriptions } = useSubscription();

  // Example data - would typically come from an API
  const totalDomains = 28;
  const pricePerDomain = 60;
  const emailsPerDomain = 990;
  
  const dashboardStats = [
    {
      title: 'Total Domains',
      value: totalDomains.toString(),
      icon: Globe,
      color: 'text-mailr-red'
    },
    {
      title: 'Total Inboxes',
      value: '154',
      icon: Inbox,
      color: 'text-blue-500'
    },
    {
      title: 'Sending Volume per Month',
      value: `${(totalDomains * emailsPerDomain).toLocaleString()}`,
      icon: TrendingUp,
      color: 'text-green-500'
    },
    {
      title: 'Pending Domains',
      value: '4',
      icon: Clock,
      color: 'text-amber-500'
    }
  ];

  const orderHistory = [
    {
      id: 'ORD-1234',
      domain: 'example.com',
      date: '2023-09-01',
      amount: '$60.00',
      invoiceId: 'INV-5678'
    },
    {
      id: 'ORD-1235',
      domain: 'testdomain.io',
      date: '2023-08-15',
      amount: '$60.00',
      invoiceId: 'INV-5679'
    },
    {
      id: 'ORD-1236',
      domain: 'newsite.org',
      date: '2023-07-22',
      amount: '$60.00',
      invoiceId: 'INV-5680'
    }
  ];

  const pendingDomains = [
    { domain: 'newdomain.com', status: 'DNS Verification', progress: 65 },
    { domain: 'awaiting.org', status: 'Payment Processing', progress: 30 },
    { domain: 'verify-me.net', status: 'Email Verification', progress: 85 },
    { domain: 'setup-pending.io', status: 'Setup Pending', progress: 15 },
    { domain: 'extra-domain1.net', status: 'DNS Verification', progress: 45 },
    { domain: 'extra-domain2.com', status: 'Email Verification', progress: 55 }
  ];

  const totalSubscriptionCost = subscriptions.reduce((total, sub) => total + sub.price, 0);

  return (
    <MainLayout title="Dashboard">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {dashboardStats.map((stat) => (
          <Card key={stat.title} className="bg-mailr-darkgray border-mailr-lightgray shadow-lg">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-sm font-medium text-gray-400">{stat.title}</CardTitle>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-end">
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <Card className="bg-mailr-darkgray border-mailr-lightgray shadow-lg h-full">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-sm font-medium text-gray-400">
                    {isFreeTrial ? 'Free Trial' : 'Subscriptions'}
                  </CardTitle>
                  {isFreeTrial && (
                    <Badge variant="outline" className="bg-amber-500/20 text-amber-300 border-amber-500">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      {daysRemaining} {daysRemaining === 1 ? 'day' : 'days'} remaining
                    </Badge>
                  )}
                </div>
                <DollarSign className="h-5 w-5 text-yellow-500" />
              </div>
            </CardHeader>
            <CardContent>
              {isFreeTrial && !hasPaymentMethod ? (
                <div className="py-4">
                  <p className="text-gray-400 mb-4">Add a payment method to continue using the service after your trial ends.</p>
                  <Button className="bg-mailr-red hover:bg-red-600">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Add Payment Method
                  </Button>
                </div>
              ) : (
                <>
                  <div className="py-4">
                    {!isFreeTrial && subscriptions.length > 0 && (
                      <div className="space-y-4">
                        {subscriptions.map((subscription) => (
                          <div key={subscription.id} className="flex justify-between items-center p-3 bg-mailr-lightgray/10 rounded-md">
                            <div>
                              <p className="font-medium">{subscription.name}</p>
                              <p className="text-sm text-gray-400">Next billing: {subscription.billingDate}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold">${subscription.price}</p>
                              <Badge variant={subscription.status === 'active' ? 'default' : 'outline'} 
                                className={subscription.status === 'active' ? 'bg-green-500/20 text-green-300 border-green-500' : 'bg-amber-500/20 text-amber-300 border-amber-500'}>
                                {subscription.status === 'active' ? 'Active' : 'Canceled'}
                              </Badge>
                            </div>
                          </div>
                        ))}
                        <div className="flex justify-between pt-2 border-t border-mailr-lightgray">
                          <p className="text-gray-400 text-sm">Total Monthly Cost</p>
                          <p className="text-2xl font-bold">${totalSubscriptionCost.toLocaleString()}</p>
                        </div>
                      </div>
                    )}
                    
                    <div className="mt-4">
                      <Link to="/subscriptions">
                        <Button variant="outline" className="w-full">
                          Manage Subscriptions
                        </Button>
                      </Link>
                    </div>
                  </div>
                </>
              )}
              
              {isFreeTrial && (
                <div className="mt-2 bg-mailr-lightgray/20 p-3 rounded-md border border-amber-600/30 flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-amber-400 flex-shrink-0" />
                  <p className="text-sm text-amber-200">
                    Your free trial will expire in {daysRemaining} {daysRemaining === 1 ? 'day' : 'days'}. 
                    <Link to="/subscriptions" className="text-mailr-red hover:underline ml-1">
                      Upgrade now
                    </Link>
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card className="bg-mailr-darkgray border-mailr-lightgray shadow-lg h-[200px]">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-sm font-medium text-gray-400">Pending Domains</CardTitle>
                <Clock className="h-5 w-5 text-amber-500" />
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[110px] pr-4">
                <div className="space-y-3">
                  {pendingDomains.map((domain) => (
                    <div key={domain.domain} className="space-y-1">
                      <div className="flex justify-between">
                        <p className="text-sm font-medium">{domain.domain}</p>
                        <p className="text-xs text-gray-400">{domain.status}</p>
                      </div>
                      <div className="w-full bg-mailr-lightgray rounded-full h-2">
                        <div 
                          className="bg-mailr-red h-2 rounded-full" 
                          style={{ width: `${domain.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="bg-mailr-darkgray rounded-md border border-mailr-lightgray p-4 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Orders History</h2>
          <FileText className="h-5 w-5 text-gray-400" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-mailr-lightgray">
              <tr>
                <th className="text-left py-3 text-gray-400 font-medium">Order ID</th>
                <th className="text-left py-3 text-gray-400 font-medium">Domain</th>
                <th className="text-left py-3 text-gray-400 font-medium">Date</th>
                <th className="text-left py-3 text-gray-400 font-medium">Amount</th>
                <th className="text-right py-3 text-gray-400 font-medium">Invoice</th>
              </tr>
            </thead>
            <tbody>
              {orderHistory.map((order) => (
                <tr 
                  key={order.id} 
                  className="border-b border-mailr-lightgray last:border-b-0"
                >
                  <td className="py-4">{order.id}</td>
                  <td className="py-4">{order.domain}</td>
                  <td className="py-4">{order.date}</td>
                  <td className="py-4">{order.amount}</td>
                  <td className="py-4 text-right">
                    <Link to={`/invoices/${order.invoiceId}`} className="text-mailr-red hover:underline">
                      View Invoice
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </MainLayout>
  );
};

export default Index;
