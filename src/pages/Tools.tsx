
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Wrench, Gauge, BarChart, Mail, Shield, Webhook, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ToolsPage = () => {
  const tools = [
    {
      title: 'Email Validator',
      description: 'Verify email address validity and deliverability.',
      icon: Mail,
      color: 'text-blue-500'
    },
    {
      title: 'Domain Health Check',
      description: 'Check DNS records and email configuration for your domains.',
      icon: Gauge,
      color: 'text-green-500'
    },
    {
      title: 'Email Analytics',
      description: 'Track open rates, click-through rates, and more.',
      icon: BarChart,
      color: 'text-yellow-500'
    },
    {
      title: 'Security Scanner',
      description: 'Scan for vulnerabilities in your email infrastructure.',
      icon: Shield,
      color: 'text-red-500'
    },
    {
      title: 'Webhook Manager',
      description: 'Create and manage webhooks for email events.',
      icon: Webhook,
      color: 'text-purple-500'
    },
    {
      title: 'AI Assistant',
      description: 'Get AI-powered suggestions for your email campaigns.',
      icon: Bot,
      color: 'text-cyan-500'
    }
  ];

  return (
    <MainLayout title="Tools">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((tool) => (
          <Card key={tool.title} className="bg-mailr-darkgray border-mailr-lightgray shadow-lg">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg font-medium">{tool.title}</CardTitle>
                <tool.icon className={`h-5 w-5 ${tool.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-400 mb-4">{tool.description}</p>
              <Button variant="outline" className="w-full bg-mailr-darkgray border-mailr-lightgray hover:bg-mailr-lightgray">
                Launch Tool
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </MainLayout>
  );
};

export default ToolsPage;
