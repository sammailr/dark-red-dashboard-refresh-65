
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { User, CreditCard, Bell, Lock, Shield, Language } from 'lucide-react';

const SettingsPage = () => {
  return (
    <MainLayout title="Settings">
      <div className="bg-mailr-darkgray rounded-md border border-mailr-lightgray overflow-hidden">
        <Tabs defaultValue="account" className="p-4">
          <TabsList className="grid grid-cols-3 md:grid-cols-6 bg-black/30">
            <TabsTrigger value="account" className="data-[state=active]:bg-mailr-red">
              <User className="h-4 w-4 mr-2" />
              Account
            </TabsTrigger>
            <TabsTrigger value="billing" className="data-[state=active]:bg-mailr-red">
              <CreditCard className="h-4 w-4 mr-2" />
              Billing
            </TabsTrigger>
            <TabsTrigger value="notifications" className="data-[state=active]:bg-mailr-red">
              <Bell className="h-4 w-4 mr-2" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="security" className="data-[state=active]:bg-mailr-red">
              <Lock className="h-4 w-4 mr-2" />
              Security
            </TabsTrigger>
            <TabsTrigger value="api" className="data-[state=active]:bg-mailr-red">
              <Shield className="h-4 w-4 mr-2" />
              API
            </TabsTrigger>
            <TabsTrigger value="localization" className="data-[state=active]:bg-mailr-red">
              <Language className="h-4 w-4 mr-2" />
              Localization
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
                <Button className="bg-mailr-red hover:bg-red-600 mt-4">Save Changes</Button>
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

          <TabsContent value="notifications" className="mt-6">
            <Card className="bg-transparent border-none shadow-none">
              <CardHeader className="px-0">
                <CardTitle>Notification Preferences</CardTitle>
              </CardHeader>
              <CardContent className="px-0">
                <div className="space-y-4">
                  {['Email Alerts', 'Order Updates', 'Account Activity', 'Marketing Communications'].map((item) => (
                    <div key={item} className="flex items-center justify-between">
                      <Label htmlFor={item.toLowerCase().replace(' ', '-')}>{item}</Label>
                      <Switch id={item.toLowerCase().replace(' ', '-')} defaultChecked={item !== 'Marketing Communications'} />
                    </div>
                  ))}
                  <Button className="bg-mailr-red hover:bg-red-600 mt-4">Save Preferences</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="security">
            <p className="text-gray-400">Security settings content here</p>
          </TabsContent>
          
          <TabsContent value="api">
            <p className="text-gray-400">API settings content here</p>
          </TabsContent>
          
          <TabsContent value="localization">
            <p className="text-gray-400">Localization settings content here</p>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default SettingsPage;
