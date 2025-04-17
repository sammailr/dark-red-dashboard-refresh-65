
import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

type SendingPlatformSelectProps = {
  onSelect: (value: string) => void;
  onAddNew: () => void;
};

const SendingPlatformSelect = ({ onSelect, onAddNew }: SendingPlatformSelectProps) => {
  return (
    <Select onValueChange={onSelect}>
      <SelectTrigger className="w-[250px] bg-mailr-darkgray border-mailr-lightgray">
        <SelectValue placeholder="Choose Sending Platform for Order" />
      </SelectTrigger>
      <SelectContent className="bg-mailr-darkgray border-mailr-lightgray">
        <SelectItem value="platform1">Platform 1</SelectItem>
        <SelectItem value="platform2">Platform 2</SelectItem>
        <Button 
          variant="ghost" 
          className="w-full justify-start px-2 py-1.5 h-8 hover:bg-mailr-lightgray/10"
          onClick={(e) => {
            e.preventDefault();
            onAddNew();
          }}
        >
          <Plus className="h-4 w-4 mr-1" />
          Add new platform
        </Button>
      </SelectContent>
    </Select>
  );
};

export default SendingPlatformSelect;
