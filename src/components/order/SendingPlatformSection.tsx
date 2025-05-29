
import React from 'react';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import SendingPlatformSelect from '@/components/order/SendingPlatformSelect';

interface SendingPlatformSectionProps {
  selectedSendingPlatform: string | null;
  setSelectedSendingPlatform: React.Dispatch<React.SetStateAction<string | null>>;
}

const SendingPlatformSection: React.FC<SendingPlatformSectionProps> = ({
  selectedSendingPlatform,
  setSelectedSendingPlatform,
}) => {
  return (
    <div className="bg-[#1A1A1A] rounded-lg border border-[#333] p-6">
      <h2 className="text-xl font-bold mb-6 text-white">Sending Platform</h2>
      
      <div>
        <Label htmlFor="sendingPlatform" className="block text-sm font-medium mb-2 text-gray-300">Sending Platform</Label>
        <SendingPlatformSelect 
          onSelect={value => setSelectedSendingPlatform(value)} 
          onAddNew={() => toast.info('Add new platform functionality to be implemented')} 
        />
      </div>
    </div>
  );
};

export default SendingPlatformSection;
