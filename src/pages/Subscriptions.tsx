
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, CreditCard, DollarSign, AlertCircle, CheckCircle, XCircle, Plus, Trash } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

type Plan = {
  id: string;
  name: string;
  description: string;
  price: number;
  features: string[];
};

const Subscriptions = () => {
  const { 
    isFreeTrial, 
    daysRemaining, 
    hasPaymentMethod, 
    subscriptions, 
    addSubscription, 
    removeSubscription,
    updateSubscription
  } = useSubscription();
  
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string>('');

  // Example available plans
  const plans: Plan[] = [
    {
      id: 'basic',
      name: 'Basic Plan',
      description: 'Perfect for small projects',
      price: 60,
      features: ['10 domains', '100 emails/day', 'Standard support'],
    },
    {
      id: 'pro',
      name: 'Pro Plan',
      description: 'For growing businesses',
      price: 120,
      features: ['30 domains', '500 emails/day', 'Priority support', 'Email analytics'],
    },
    {
      id: 'enterprise',
      name: 'Enterprise Plan',
      description: 'For large organizations',
      price: 300,
      features: ['Unlimited domains', '2000 emails/day', '24/7 support', 'Advanced analytics', 'Custom domain setup'],
    },
  ];

  const handleAddSubscription = () => {
    const plan = plans.find(p => p.id === selectedPlan);
    if (plan) {
      const newSub = {
        id: Date.now().toString(),
        name: plan.name,
        status: 'active' as const,
        price: plan.price,
        billingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        })
      };
      addSubscription(newSub);
      setOpenDialog(false);
    }
  };

  const handleCancelSubscription = (id: string) => {
    updateSubscription(id, { status: 'canceled' });
  };

  const totalMonthlyCost = subscriptions.reduce((total, sub) => 
    sub.status === 'active' ? total + sub.price : total, 0
  );

  return (
    <MainLayout title="Manage Subscriptions">
      <div className="px-1 py-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold mb-2">Your Subscriptions</h1>
            <p className="text-gray-400">Manage your subscriptions and billing information</p>
          </div>
          
          {isFreeTrial ? (
            <Badge variant="outline" className="mt-2 md:mt-0 bg-amber-500/20 text-amber-300 border-amber-500 px-3 py-1">
              <AlertCircle className="h-4 w-4 mr-1" />
              Trial - {daysRemaining} {daysRemaining === 1 ? 'day' : 'days'} remaining
            </Badge>
          ) : (
            <div className="mt-2 md:mt-0 text-right">
              <p className="text-gray-400 text-sm">Monthly Total</p>
              <p className="text-2xl font-bold">${totalMonthlyCost}</p>
            </div>
          )}
        </div>
        
        {/* Payment Method Section */}
        <Card className="bg-mailr-darkgray border-mailr-lightgray shadow-lg mb-6">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Payment Method</CardTitle>
              <CreditCard className="h-5 w-5 text-gray-400" />
            </div>
          </CardHeader>
          <CardContent>
            {hasPaymentMethod ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-gradient-to-r from-purple-500 to-blue-500 w-12 h-8 rounded"></div>
                  <div>
                    <p className="font-medium">•••• •••• •••• 4242</p>
                    <p className="text-sm text-gray-400">Expires 12/25</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Update
                </Button>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <p className="text-gray-400">No payment method on file.</p>
                <Button className="bg-mailr-red hover:bg-red-600 whitespace-nowrap">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Add Payment Method
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Active Subscriptions */}
        <h2 className="text-xl font-bold mb-4">Your Plans</h2>
        
        {subscriptions.length === 0 ? (
          <Card className="bg-mailr-darkgray border-mailr-lightgray shadow-lg mb-6 border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="text-gray-400 mb-4">You don't have any active subscriptions yet.</p>
              <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                <DialogTrigger asChild>
                  <Button className="bg-mailr-red hover:bg-red-600">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Subscription
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-mailr-darkgray border-mailr-lightgray">
                  <DialogHeader>
                    <DialogTitle>Add a new subscription</DialogTitle>
                    <DialogDescription>
                      Choose a plan that fits your needs.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="py-4">
                    <Label htmlFor="plan">Select a plan</Label>
                    <Select value={selectedPlan} onValueChange={setSelectedPlan}>
                      <SelectTrigger id="plan" className="mt-1 w-full">
                        <SelectValue placeholder="Select a plan" />
                      </SelectTrigger>
                      <SelectContent className="bg-mailr-darkgray border-mailr-lightgray">
                        {plans.map(plan => (
                          <SelectItem key={plan.id} value={plan.id}>
                            {plan.name} - ${plan.price}/mo
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setOpenDialog(false)}>Cancel</Button>
                    <Button 
                      className="bg-mailr-red hover:bg-red-600" 
                      onClick={handleAddSubscription}
                      disabled={!selectedPlan}
                    >
                      Subscribe
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {subscriptions.map((subscription) => (
              <Card 
                key={subscription.id} 
                className={`bg-mailr-darkgray border-mailr-lightgray shadow-lg ${
                  subscription.status === 'canceled' ? 'opacity-75' : ''
                }`}
              >
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-base font-bold">{subscription.name}</CardTitle>
                      <Badge 
                        variant="outline" 
                        className={subscription.status === 'active' 
                          ? 'bg-green-500/20 text-green-300 border-green-500 mt-2' 
                          : 'bg-red-500/20 text-red-300 border-red-500 mt-2'
                        }
                      >
                        {subscription.status === 'active' 
                          ? <CheckCircle className="h-3 w-3 mr-1" /> 
                          : <XCircle className="h-3 w-3 mr-1" />
                        }
                        {subscription.status === 'active' ? 'Active' : 'Canceled'}
                      </Badge>
                    </div>
                    <p className="text-lg font-bold">${subscription.price}/mo</p>
                  </div>
                </CardHeader>
                <CardContent>
                  {subscription.status === 'active' ? (
                    <p className="text-sm text-gray-400">
                      Next billing on {subscription.billingDate}
                    </p>
                  ) : (
                    <p className="text-sm text-gray-400">
                      Service ends on {subscription.billingDate}
                    </p>
                  )}
                </CardContent>
                <CardFooter className="flex justify-between">
                  {subscription.status === 'active' ? (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-red-400 hover:text-red-300 hover:bg-red-950/50"
                      onClick={() => handleCancelSubscription(subscription.id)}
                    >
                      Cancel Plan
                    </Button>
                  ) : (
                    <Button 
                      className="bg-mailr-red hover:bg-red-600" 
                      size="sm"
                      onClick={() => updateSubscription(subscription.id, { status: 'active' })}
                    >
                      Reactivate
                    </Button>
                  )}
                  <Button variant="ghost" size="sm">View Details</Button>
                </CardFooter>
              </Card>
            ))}
            
            {/* Add New Subscription Card */}
            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
              <DialogTrigger asChild>
                <Card className="bg-mailr-darkgray border-mailr-lightgray shadow-lg border-dashed cursor-pointer hover:bg-mailr-lightgray/10 transition-colors">
                  <CardContent className="flex items-center justify-center h-full py-12">
                    <div className="text-center">
                      <Plus className="h-10 w-10 mx-auto mb-2 text-gray-400" />
                      <p className="font-medium">Add New Plan</p>
                    </div>
                  </CardContent>
                </Card>
              </DialogTrigger>
              <DialogContent className="bg-mailr-darkgray border-mailr-lightgray">
                <DialogHeader>
                  <DialogTitle>Add a new subscription</DialogTitle>
                  <DialogDescription>
                    Choose a plan that fits your needs.
                  </DialogDescription>
                </DialogHeader>
                
                <div className="py-4">
                  <Label htmlFor="plan">Select a plan</Label>
                  <Select value={selectedPlan} onValueChange={setSelectedPlan}>
                    <SelectTrigger id="plan" className="mt-1 w-full">
                      <SelectValue placeholder="Select a plan" />
                    </SelectTrigger>
                    <SelectContent className="bg-mailr-darkgray border-mailr-lightgray">
                      {plans.map(plan => (
                        <SelectItem key={plan.id} value={plan.id}>
                          {plan.name} - ${plan.price}/mo
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <DialogFooter>
                  <Button variant="outline" onClick={() => setOpenDialog(false)}>Cancel</Button>
                  <Button 
                    className="bg-mailr-red hover:bg-red-600" 
                    onClick={handleAddSubscription}
                    disabled={!selectedPlan}
                  >
                    Subscribe
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        )}
        
        {/* Available Plans Section */}
        <h2 className="text-xl font-bold mb-4 mt-8">Available Plans</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {plans.map((plan) => (
            <Card key={plan.id} className="bg-mailr-darkgray border-mailr-lightgray shadow-lg">
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold mb-4">${plan.price}/mo</p>
                <ul className="space-y-2">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-400 mr-2 flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full bg-mailr-red hover:bg-red-600"
                  onClick={() => {
                    setSelectedPlan(plan.id);
                    setOpenDialog(true);
                  }}
                  disabled={subscriptions.some(s => s.name === plan.name && s.status === 'active')}
                >
                  {subscriptions.some(s => s.name === plan.name && s.status === 'active') 
                    ? 'Current Plan' 
                    : 'Subscribe'}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        
        {/* Billing History */}
        <h2 className="text-xl font-bold mb-4 mt-8">Billing History</h2>
        <Card className="bg-mailr-darkgray border-mailr-lightgray shadow-lg">
          <CardContent className="p-0">
            <table className="w-full">
              <thead>
                <tr className="border-b border-mailr-lightgray">
                  <th className="text-left py-4 px-6 text-gray-400 font-medium">Date</th>
                  <th className="text-left py-4 px-6 text-gray-400 font-medium">Description</th>
                  <th className="text-left py-4 px-6 text-gray-400 font-medium">Amount</th>
                  <th className="text-right py-4 px-6 text-gray-400 font-medium">Invoice</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-mailr-lightgray">
                  <td className="py-4 px-6">Sep 15, 2023</td>
                  <td className="py-4 px-6">Basic Plan - Monthly</td>
                  <td className="py-4 px-6">$60.00</td>
                  <td className="py-4 px-6 text-right">
                    <Button variant="ghost" size="sm" className="text-mailr-red hover:text-red-400">
                      Download
                    </Button>
                  </td>
                </tr>
                <tr className="border-b border-mailr-lightgray">
                  <td className="py-4 px-6">Aug 15, 2023</td>
                  <td className="py-4 px-6">Basic Plan - Monthly</td>
                  <td className="py-4 px-6">$60.00</td>
                  <td className="py-4 px-6 text-right">
                    <Button variant="ghost" size="sm" className="text-mailr-red hover:text-red-400">
                      Download
                    </Button>
                  </td>
                </tr>
                <tr>
                  <td className="py-4 px-6">Jul 15, 2023</td>
                  <td className="py-4 px-6">Basic Plan - Monthly</td>
                  <td className="py-4 px-6">$60.00</td>
                  <td className="py-4 px-6 text-right">
                    <Button variant="ghost" size="sm" className="text-mailr-red hover:text-red-400">
                      Download
                    </Button>
                  </td>
                </tr>
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Subscriptions;
