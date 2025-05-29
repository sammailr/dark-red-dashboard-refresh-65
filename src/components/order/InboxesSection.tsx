
import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface InboxesSectionProps {
  numberOfInboxes: string;
  setNumberOfInboxes: React.Dispatch<React.SetStateAction<string>>;
  userFullName: string;
  setUserFullName: React.Dispatch<React.SetStateAction<string>>;
  preferredPassword: string;
  setPreferredPassword: React.Dispatch<React.SetStateAction<string>>;
}

const InboxesSection: React.FC<InboxesSectionProps> = ({
  numberOfInboxes,
  setNumberOfInboxes,
  userFullName,
  setUserFullName,
  preferredPassword,
  setPreferredPassword,
}) => {
  return (
    <div className="bg-[#1A1A1A] rounded-lg border border-[#333] p-6">
      <h2 className="text-xl font-bold mb-6 text-white">Inboxes</h2>
      
      <div className="space-y-8">
        <div>
          <Label htmlFor="numberOfInboxes" className="block text-sm font-medium mb-2 text-gray-300">Number of Inboxes per Domain</Label>
          <Select value={numberOfInboxes} onValueChange={setNumberOfInboxes}>
            <SelectTrigger className="bg-[#1E1E1E] border-[#444] text-white rounded-md shadow-[inset_0_0_0_1px_#333]">
              <SelectValue placeholder="Select number of inboxes" />
            </SelectTrigger>
            <SelectContent className="bg-[#1A1A1A] border-[#444] z-50">
              <SelectItem value="1">1</SelectItem>
              <SelectItem value="2">2</SelectItem>
              <SelectItem value="3">3</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Divider for visual separation */}
        <div className="border-t border-[#2D2D2D] pt-8">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="userFullName" className="block text-sm font-medium mb-2 text-gray-300">User Full Name</Label>
              <p className="text-sm text-gray-500 mb-3">E.g. John Smith</p>
              <Input 
                id="userFullName" 
                type="text" 
                className="bg-[#1E1E1E] border-[#444] text-white placeholder:text-gray-500 rounded-md shadow-[inset_0_0_0_1px_#333]" 
                value={userFullName} 
                onChange={e => setUserFullName(e.target.value)} 
                placeholder="John Smith" 
              />
            </div>
            <div>
              <Label htmlFor="preferredPassword" className="block text-sm font-medium mb-2 text-gray-300">Preferred Inboxes Password</Label>
              <p className="text-sm text-gray-500 mb-3">One Password to use on all mailboxes</p>
              <Input 
                id="preferredPassword" 
                type="password" 
                className="bg-[#1E1E1E] border-[#444] text-white placeholder:text-gray-500 rounded-md shadow-[inset_0_0_0_1px_#333]" 
                value={preferredPassword} 
                onChange={e => setPreferredPassword(e.target.value)} 
                placeholder="••••••••" 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InboxesSection;
