
import React from 'react';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

type HeaderProps = {
  title: string;
};

const Header = ({ title }: HeaderProps) => {
  return (
    <div className="flex justify-between items-center pb-6 pt-4 border-b border-mailr-lightgray">
      <h1 className="text-3xl font-bold text-white">{title}</h1>
      
      <div className="flex items-center gap-6">
        <div className="text-white font-medium">Bellum Capital</div>
        <div className="flex items-center">
          <span className="text-white mr-1">Clinton Veinot</span>
          <Button variant="ghost" className="p-0">
            <ChevronDown className="h-4 w-4 text-gray-400" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Header;
