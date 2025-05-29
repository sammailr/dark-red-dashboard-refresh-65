
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

const SettingsPage = () => {
  return (
    <MainLayout title="Settings">
      <div className="bg-mailr-darkgray rounded-md border border-mailr-lightgray overflow-hidden">
        <div className="p-6">
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
        </div>
      </div>
    </MainLayout>
  );
};

export default SettingsPage;
