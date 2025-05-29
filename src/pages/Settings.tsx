
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { User, CreditCard } from 'lucide-react';

const SettingsPage = () => {
  const handleResetPassword = () => {
    // Handle reset password logic here
    console.log('Reset password requested');
    // You could navigate to reset password page or trigger an email
  };

  return (
    <MainLayout title="Account Settings">
      <div className="bg-mailr-darkgray rounded-md border border-mailr-lightgray overflow-hidden">
        <Tabs defaultValue="account" className="p-4">
          <TabsList className="grid grid-cols-2 bg-black/30">
            <TabsTrigger value="account" className="data-[state=active]:bg-mailr-red">
              <User className="h-4 w-4 mr-2" />
              Account
            </TabsTrigger>
            <TabsTrigger value="billing" className="data-[state=active]:bg-mailr-red">
              <CreditCard className="h-4 w-4 mr-2" />
              Billing
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="account" className="mt-6">
            <Card className="bg-transparent border-none shadow-none">
              <CardHeader className="px-0">
                <CardTitle>Account Information</CardTitle>
              </CardHeader>
              <CardContent className="px-0 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" defaultValue="Clinton Veinot" className="bg-black/30 border-mailr-lightgray" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" defaultValue="clinton@example.com" className="bg-black/30 border-mailr-lightgray" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company">Company</Label>
                    <Input id="company" defaultValue="Bellum Capital" className="bg-black/30 border-mailr-lightgray" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" defaultValue="+1 (555) 123-4567" className="bg-black/30 border-mailr-lightgray" />
                  </div>
                </div>
                <div className="flex gap-4 mt-6">
                  <Button className="bg-mailr-red hover:bg-red-600">Save Changes</Button>
                  <Button 
                    variant="outline" 
                    onClick={handleResetPassword}
                    className="border-mailr-lightgray hover:bg-mailr-lightgray/10"
                  >
                    Reset Password
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="billing" className="mt-6">
            <Card className="bg-transparent border-none shadow-none">
              <CardHeader className="px-0">
                <CardTitle>Payment Methods</CardTitle>
              </CardHeader>
              <CardContent className="px-0">
                <div className="space-y-4">
                  <div className="bg-black/30 rounded-lg p-4 flex justify-between items-center border border-mailr-lightgray">
                    <div className="flex items-center">
                      <div className="bg-blue-500/20 p-2 rounded-md mr-4">
                        <CreditCard className="h-5 w-5 text-blue-500" />
                      </div>
                      <div>
                        <p className="font-medium">Visa ending in 4242</p>
                        <p className="text-sm text-gray-400">Expires 04/25</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="border-mailr-lightgray hover:bg-mailr-lightgray">Edit</Button>
                      <Button variant="outline" size="sm" className="border-mailr-lightgray hover:bg-mailr-lightgray">Remove</Button>
                    </div>
                  </div>
                  <Button className="bg-mailr-red hover:bg-red-600">Add Payment Method</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default SettingsPage;
