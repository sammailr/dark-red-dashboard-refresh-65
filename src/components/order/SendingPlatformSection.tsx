
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import SendingPlatformSelect, { Sequencer } from '@/components/order/SendingPlatformSelect';
import CustomPlatformForm from '@/components/order/CustomPlatformForm';

interface SendingPlatformSectionProps {
  selectedSendingPlatform: string | null;
  setSelectedSendingPlatform: React.Dispatch<React.SetStateAction<string | null>>;
  pageType?: 'microsoft' | 'google';
}

const SendingPlatformSection: React.FC<SendingPlatformSectionProps> = ({
  selectedSendingPlatform,
  setSelectedSendingPlatform,
  pageType = 'google',
}) => {
  const [showAddNew, setShowAddNew] = useState(false);
  const [selectedSequencer, setSelectedSequencer] = useState<Sequencer | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});

  const handleAddNew = () => {
    setShowAddNew(true);
    setSelectedSendingPlatform('custom');
  };

  const shouldShowInputs = selectedSendingPlatform === 'custom';

  return (
    <div className="bg-[#1A1A1A] rounded-lg border border-[#333] p-6">
      <h2 className="text-xl font-bold mb-6 text-white">Sending Platform</h2>
      
      <div className="space-y-6">
        <div>
          <Label htmlFor="sendingPlatform" className="block text-sm font-medium mb-2 text-gray-300">Sending Platform</Label>
          <SendingPlatformSelect 
            onSelect={value => {
              setSelectedSendingPlatform(value);
              if (value !== 'custom') {
                setShowAddNew(false);
                setSelectedSequencer(null);
                setFormData({});
              }
            }} 
            onAddNew={handleAddNew} 
          />
        </div>

        {shouldShowInputs && (
          <CustomPlatformForm
            selectedSequencer={selectedSequencer}
            setSelectedSequencer={setSelectedSequencer}
            formData={formData}
            setFormData={setFormData}
            pageType={pageType}
          />
        )}
      </div>
    </div>
  );
};

export default SendingPlatformSection;
