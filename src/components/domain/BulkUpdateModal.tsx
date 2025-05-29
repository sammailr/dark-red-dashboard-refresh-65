
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface BulkUpdateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: (url: string) => void;
  selectedCount: number;
}

const BulkUpdateModal = ({ open, onOpenChange, onUpdate, selectedCount }: BulkUpdateModalProps) => {
  const [url, setUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      onUpdate(url.trim());
      setUrl('');
    }
  };

  const handleClose = () => {
    setUrl('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="bg-mailr-darkgray border-mailr-lightgray text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-white text-lg font-semibold">
            Bulk Update Forwarding URL
          </DialogTitle>
          <DialogDescription className="text-gray-300">
            The Forwarding URL must include 'https://' or your domain will not forward correctly.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="bulk-url" className="text-white">
              New Forwarding URL for {selectedCount} domain{selectedCount > 1 ? 's' : ''}
            </Label>
            <Input
              id="bulk-url"
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              className="bg-mailr-lightgray border-mailr-lightgray text-white placeholder:text-gray-400"
              required
            />
          </div>
          
          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="bg-transparent border-mailr-lightgray text-white hover:bg-mailr-lightgray"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-mailr-red hover:bg-red-700 text-white"
              disabled={!url.trim()}
            >
              Update
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default BulkUpdateModal;
