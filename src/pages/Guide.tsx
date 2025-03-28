
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, FileText, BookMarked, HelpCircle, Lightbulb, BookOpenCheck } from 'lucide-react';

const GuidePage = () => {
  const guideItems = [
    {
      title: 'Getting Started',
      description: 'Learn the basics of mailr.io and how to set up your first inbox.',
      icon: BookOpen,
      color: 'text-blue-500'
    },
    {
      title: 'Domain Management',
      description: 'How to add and configure domains for your email inboxes.',
      icon: FileText,
      color: 'text-green-500'
    },
    {
      title: 'Sending Platforms',
      description: 'Connect and manage your email sending platforms.',
      icon: BookMarked,
      color: 'text-yellow-500'
    },
    {
      title: 'Best Practices',
      description: 'Tips and tricks for optimal email deliverability.',
      icon: Lightbulb,
      color: 'text-purple-500'
    },
    {
      title: 'FAQ',
      description: 'Commonly asked questions and answers.',
      icon: HelpCircle,
      color: 'text-pink-500'
    },
    {
      title: 'Advanced Topics',
      description: 'Deep dive into advanced mailr.io features.',
      icon: BookOpenCheck,
      color: 'text-orange-500'
    }
  ];

  return (
    <MainLayout title="Guide">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {guideItems.map((item) => (
          <Card key={item.title} className="bg-mailr-darkgray border-mailr-lightgray shadow-lg hover:bg-mailr-lightgray/10 transition-colors cursor-pointer">
            <CardHeader className="pb-2">
              <div className="flex items-start gap-3">
                <item.icon className={`h-6 w-6 ${item.color}`} />
                <div>
                  <CardTitle className="text-lg font-medium">{item.title}</CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-400">{item.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </MainLayout>
  );
};

export default GuidePage;
