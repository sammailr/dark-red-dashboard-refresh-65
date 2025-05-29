import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';
import { Sequencer } from './SendingPlatformSelect';

interface CustomPlatformFormProps {
  selectedSequencer: Sequencer | null;
  setSelectedSequencer: React.Dispatch<React.SetStateAction<Sequencer | null>>;
  formData: Record<string, string>;
  setFormData: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  pageType?: 'microsoft' | 'google';
}

const CustomPlatformForm: React.FC<CustomPlatformFormProps> = ({
  selectedSequencer,
  setSelectedSequencer,
  formData,
  setFormData,
  pageType = 'google',
}) => {
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const renderCommonFields = () => {
    const isGooglePage = pageType === 'google';
    const isMicrosoftPage = pageType === 'microsoft';
    
    // For Microsoft page, customize based on sequencer
    if (isMicrosoftPage) {
      const shouldShowLoginFields = selectedSequencer === 'instantly';
      
      return (
        <div className="space-y-4">
          <div>
            <Label htmlFor="customName" className="block text-sm font-medium mb-2 text-[#B0B0B0]">Workspace Name</Label>
            <Input
              id="customName"
              type="text"
              className="bg-[#1E1E1E] border-[#333] text-white placeholder:text-[#777] rounded-md"
              value={formData.customName || ''}
              onChange={(e) => handleInputChange('customName', e.target.value)}
              placeholder="Enter workspace name"
            />
          </div>
          {shouldShowLoginFields && (
            <>
              <div>
                <Label htmlFor="loginEmail" className="block text-sm font-medium mb-2 text-[#B0B0B0]">Login Email</Label>
                <Input
                  id="loginEmail"
                  type="email"
                  className="bg-[#1E1E1E] border-[#333] text-white placeholder:text-[#777] rounded-md"
                  value={formData.loginEmail || ''}
                  onChange={(e) => handleInputChange('loginEmail', e.target.value)}
                  placeholder="Enter login email"
                />
              </div>
              <div>
                <Label htmlFor="loginPassword" className="block text-sm font-medium mb-2 text-[#B0B0B0]">Login Password</Label>
                <Input
                  id="loginPassword"
                  type="password"
                  className="bg-[#1E1E1E] border-[#333] text-white placeholder:text-[#777] rounded-md"
                  value={formData.loginPassword || ''}
                  onChange={(e) => handleInputChange('loginPassword', e.target.value)}
                  placeholder="Enter login password"
                />
              </div>
            </>
          )}
        </div>
      );
    }
    
    // For Google page, always show all common fields
    return (
      <div className="space-y-4">
        <div>
          <Label htmlFor="customName" className="block text-sm font-medium mb-2 text-[#B0B0B0]">Workspace Name</Label>
          <Input
            id="customName"
            type="text"
            className="bg-[#1E1E1E] border-[#333] text-white placeholder:text-[#777] rounded-md"
            value={formData.customName || ''}
            onChange={(e) => handleInputChange('customName', e.target.value)}
            placeholder="Enter workspace name"
          />
        </div>
        <div>
          <Label htmlFor="loginEmail" className="block text-sm font-medium mb-2 text-[#B0B0B0]">Login Email</Label>
          <Input
            id="loginEmail"
            type="email"
            className="bg-[#1E1E1E] border-[#333] text-white placeholder:text-[#777] rounded-md"
            value={formData.loginEmail || ''}
            onChange={(e) => handleInputChange('loginEmail', e.target.value)}
            placeholder="Enter login email"
          />
        </div>
        <div>
          <Label htmlFor="loginPassword" className="block text-sm font-medium mb-2 text-[#B0B0B0]">Login Password</Label>
          <Input
            id="loginPassword"
            type="password"
            className="bg-[#1E1E1E] border-[#333] text-white placeholder:text-[#777] rounded-md"
            value={formData.loginPassword || ''}
            onChange={(e) => handleInputChange('loginPassword', e.target.value)}
            placeholder="Enter login password"
          />
        </div>
      </div>
    );
  };

  const renderSequencerInputs = () => {
    if (!selectedSequencer) return null;

    const commonFields = renderCommonFields();

    switch (selectedSequencer) {
      case 'smartlead':
        return (
          <div className="space-y-4">
            {commonFields}
            <div>
              <Label htmlFor="apiKey" className="block text-sm font-medium mb-2 text-[#B0B0B0]">API Key</Label>
              <Input
                id="apiKey"
                type="text"
                className="bg-[#1E1E1E] border-[#333] text-white placeholder:text-[#777] rounded-md"
                value={formData.apiKey || ''}
                onChange={(e) => handleInputChange('apiKey', e.target.value)}
                placeholder="Enter API key"
              />
            </div>
            <div>
              <Label htmlFor="oauthUrl" className="block text-sm font-medium mb-2 text-[#B0B0B0]">OAuth URL</Label>
              <Input
                id="oauthUrl"
                type="url"
                className="bg-[#1E1E1E] border-[#333] text-white placeholder:text-[#777] rounded-md"
                value={formData.oauthUrl || ''}
                onChange={(e) => handleInputChange('oauthUrl', e.target.value)}
                placeholder="Enter OAuth URL"
              />
            </div>
          </div>
        );

      case 'instantly':
        return (
          <div className="space-y-4">
            {commonFields}
            <div>
              <Label htmlFor="apiKey" className="block text-sm font-medium mb-2 text-[#B0B0B0]">API Key</Label>
              <Input
                id="apiKey"
                type="text"
                className="bg-[#1E1E1E] border-[#333] text-white placeholder:text-[#777] rounded-md"
                value={formData.apiKey || ''}
                onChange={(e) => handleInputChange('apiKey', e.target.value)}
                placeholder="Enter API key"
              />
            </div>
          </div>
        );

      case 'emailbison':
        return (
          <div className="space-y-4">
            {commonFields}
            <div>
              <Label htmlFor="apiKey" className="block text-sm font-medium mb-2 text-[#B0B0B0]">API Key</Label>
              <Input
                id="apiKey"
                type="text"
                className="bg-[#1E1E1E] border-[#333] text-white placeholder:text-[#777] rounded-md"
                value={formData.apiKey || ''}
                onChange={(e) => handleInputChange('apiKey', e.target.value)}
                placeholder="Enter API key"
              />
            </div>
            <div>
              <Label htmlFor="inviteLink" className="block text-sm font-medium mb-2 text-[#B0B0B0]">Invite Link</Label>
              <Input
                id="inviteLink"
                type="url"
                className="bg-[#1E1E1E] border-[#333] text-white placeholder:text-[#777] rounded-md"
                value={formData.inviteLink || ''}
                onChange={(e) => handleInputChange('inviteLink', e.target.value)}
                placeholder="Enter invite link"
              />
            </div>
            <Alert className="bg-blue-900/20 border-blue-400/30">
              <Info className="h-4 w-4 text-blue-400" />
              <AlertDescription className="text-blue-300">
                Please add operations@mailr.io to your workspace
              </AlertDescription>
            </Alert>
          </div>
        );

      case 'piplai':
        return (
          <div className="space-y-4">
            {commonFields}
            <Alert className="bg-blue-900/20 border-blue-400/30">
              <Info className="h-4 w-4 text-blue-400" />
              <AlertDescription className="text-blue-300">
                We will provide more info on Slack
              </AlertDescription>
            </Alert>
          </div>
        );

      case 'other':
        return (
          <div className="space-y-4">
            {commonFields}
            <Alert className="bg-yellow-900/20 border-yellow-400/30">
              <Info className="h-4 w-4 text-yellow-400" />
              <AlertDescription className="text-yellow-300">
                Please contact support for custom integration setup
              </AlertDescription>
            </Alert>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="sequencer" className="block text-sm font-medium mb-2 text-[#B0B0B0]">Select Sequencer</Label>
        <Select value={selectedSequencer || ''} onValueChange={(value) => setSelectedSequencer(value as Sequencer)}>
          <SelectTrigger className="bg-[#1E1E1E] border-[#333] text-white">
            <SelectValue placeholder="Choose a sequencer" />
          </SelectTrigger>
          <SelectContent className="bg-[#1A1A1A] border-[#333]">
            <SelectItem value="smartlead">Smartlead</SelectItem>
            <SelectItem value="instantly">Instantly</SelectItem>
            <SelectItem value="piplai">pipl.ai</SelectItem>
            <SelectItem value="emailbison">EmailBison</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {renderSequencerInputs()}
    </div>
  );
};

export default CustomPlatformForm;
