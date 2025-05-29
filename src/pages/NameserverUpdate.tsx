
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Copy, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const NameserverUpdatePage = () => {
  const { domainId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Sample nameserver data - this would be dynamic in a real app
  const nameservers = [
    'ns1.example-hosting.com',
    'ns2.example-hosting.com',
    'ns3.example-hosting.com',
    'ns4.example-hosting.com'
  ];

  const handleCopyNameserver = (nameserver: string) => {
    navigator.clipboard.writeText(nameserver);
    toast({
      title: "Copied!",
      description: `${nameserver} copied to clipboard.`
    });
  };

  const handleCopyAll = () => {
    const allNameservers = nameservers.join('\n');
    navigator.clipboard.writeText(allNameservers);
    toast({
      title: "Copied!",
      description: "All nameservers copied to clipboard."
    });
  };

  return (
    <MainLayout title="Update Nameservers">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Button 
            variant="outline" 
            onClick={() => navigate('/domains')}
            className="bg-mailr-darkgray border-mailr-lightgray hover:bg-mailr-lightgray"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Domains
          </Button>
        </div>

        <Card className="bg-mailr-darkgray border-mailr-lightgray">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-400" />
              Domain Swap Successful
            </CardTitle>
            <CardDescription className="text-gray-400">
              Your domain has been successfully swapped. Now you need to update your nameservers to complete the setup.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-white mb-4">Update Your Nameservers</h3>
              <p className="text-gray-400 mb-4">
                Please update your domain's nameservers to the following values in your domain registrar's control panel:
              </p>
              
              <div className="bg-black/30 rounded-md p-4 space-y-3">
                {nameservers.map((nameserver, index) => (
                  <div key={index} className="flex items-center justify-between bg-mailr-lightgray/10 rounded p-3">
                    <span className="text-white font-mono">{nameserver}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopyNameserver(nameserver)}
                      className="text-gray-400 hover:text-white"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                
                <div className="pt-2">
                  <Button
                    variant="outline"
                    onClick={handleCopyAll}
                    className="w-full bg-transparent border-mailr-lightgray text-white hover:bg-mailr-lightgray/20"
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy All Nameservers
                  </Button>
                </div>
              </div>
            </div>

            <div className="bg-blue-900/20 border border-blue-400/30 rounded-md p-4">
              <h4 className="text-blue-400 font-medium mb-2">Important Notes:</h4>
              <ul className="text-blue-300 text-sm space-y-1 list-disc list-inside">
                <li>Nameserver changes can take up to 24-48 hours to propagate globally</li>
                <li>During this time, your domain may not be accessible</li>
                <li>Make sure to update all nameserver entries in your registrar's control panel</li>
                <li>Contact support if you need assistance with this process</li>
              </ul>
            </div>

            <div className="bg-yellow-900/20 border border-yellow-400/30 rounded-md p-4">
              <h4 className="text-yellow-400 font-medium mb-2">Next Steps:</h4>
              <p className="text-yellow-300 text-sm">
                Once you've updated the nameservers, it may take some time for the changes to take effect. 
                You can return to the domains page to monitor the status of your domain.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default NameserverUpdatePage;
