
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, ShoppingCart, Users, Globe, Mail } from 'lucide-react';

const Index = () => {
  const dashboardStats = [
    {
      title: 'Total Orders',
      value: '1,254',
      icon: ShoppingCart,
      trend: '+12%',
      color: 'text-mailr-red'
    },
    {
      title: 'Active Domains',
      value: '28',
      icon: Globe,
      trend: '+3',
      color: 'text-blue-500'
    },
    {
      title: 'Total Messages',
      value: '8,742',
      icon: Mail,
      trend: '+24%',
      color: 'text-green-500'
    },
    {
      title: 'Subscribers',
      value: '3,891',
      icon: Users,
      trend: '+7%',
      color: 'text-yellow-500'
    }
  ];

  const recentActivity = [
    {
      id: 1,
      icon: Clock,
      description: 'New order received #1234',
      time: '5 mins ago'
    },
    {
      id: 2,
      icon: Users,
      description: 'New subscriber joined',
      time: '1 hour ago'
    },
    {
      id: 3,
      icon: Mail,
      description: 'Unread message from support',
      time: '3 hours ago'
    }
  ];

  return (
    <MainLayout title="Dashboard">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
                <p className="text-xs text-green-400">{stat.trend}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="bg-mailr-darkgray rounded-md border border-mailr-lightgray p-6">
        <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {recentActivity.map((activity) => (
            <div 
              key={activity.id} 
              className="flex items-center justify-between border-b border-mailr-lightgray pb-4 last:border-b-0"
            >
              <div className="flex items-center space-x-4">
                <activity.icon className="h-5 w-5 text-gray-400" />
                <span className="text-white">{activity.description}</span>
              </div>
              <span className="text-sm text-gray-500">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default Index;
