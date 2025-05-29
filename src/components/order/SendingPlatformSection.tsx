
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import SendingPlatformSelect, { Sequencer } from '@/components/order/SendingPlatformSelect';
import CustomPlatformForm from '@/components/order/CustomPlatformForm';

interface SendingPlatformSectionProps {
  selectedSendingPlatform: string | null;
  setSelectedSendingPlatform: React.Dispatch<React.SetStateAction<string | null>>;
}

const SendingPlatformSection: React.FC<SendingPlatformSectionProps> = ({
  selectedSendingPlatform,
  setSelectedSendingPlatform,
}) => {
  const [showAddNew, setShowAddNew] = useState(false);
  const [selectedSequencer, setSelectedSequencer] = useState<Sequencer | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [selectedExistingPlatform, setSelectedExistingPlatform] = useState<string>('');

  const handleAddNew = () => {
    setShowAddNew(true);
    setSelectedSendingPlatform('custom');
  };

  const handleExistingPlatformSelect = (value: string) => {
    setSelectedExistingPlatform(value);
    if (value) {
      setSelectedSendingPlatform(value);
    }
  };

  const shouldShowInputs = selectedSendingPlatform === 'custom' && !selectedExistingPlatform;

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
                setSelectedExistingPlatform('');
              }
            }} 
            onAddNew={handleAddNew} 
          />
        </div>

        {selectedSendingPlatform === 'custom' && (
          <div>
            <Label htmlFor="existingPlatform" className="block text-sm font-medium mb-2 text-gray-300">
              Use Existing Platform (Optional)
            </Label>
            <Select value={selectedExistingPlatform} onValueChange={handleExistingPlatformSelect}>
              <SelectTrigger className="bg-[#1E1E1E] border-[#333] text-white">
                <SelectValue placeholder="Choose an existing platform" />
              </SelectTrigger>
              <SelectContent className="bg-[#1A1A1A] border-[#333]">
                <SelectItem value="existing1">Existing Platform 1</SelectItem>
                <SelectItem value="existing2">Existing Platform 2</SelectItem>
                <SelectItem value="existing3">Existing Platform 3</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {shouldShowInputs && (
          <CustomPlatformForm
            selectedSequencer={selectedSequencer}
            setSelectedSequencer={setSelectedSequencer}
            formData={formData}
            setFormData={setFormData}
          />
        )}
      </div>
    </div>
  );
};

export default SendingPlatformSection;
