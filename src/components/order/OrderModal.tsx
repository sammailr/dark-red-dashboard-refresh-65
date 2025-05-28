
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';

type Domain = {
  id: string;
  name: string;
  status: 'active' | 'pending' | 'cancelled';
};

type Order = {
  id: string;
  totalDomains: number;
  date: string;
  status: string;
  domains: Domain[];
};

type OrderModalProps = {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
};

const OrderModal: React.FC<OrderModalProps> = ({ order, isOpen, onClose }) => {
  if (!order) return null;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-600 text-white px-2 py-1 text-xs">Active</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-600 text-white px-2 py-1 text-xs">Pending</Badge>;
      case 'cancelled':
        return <Badge className="bg-[#9b1313] text-white px-2 py-1 text-xs">Cancelled</Badge>;
      default:
        return <Badge className="bg-gray-600 text-white px-2 py-1 text-xs">Unknown</Badge>;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl bg-mailr-darkgray border-mailr-lightgray">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Order Details - {order.date}
          </DialogTitle>
        </DialogHeader>
        
        <div className="mt-4">
          <div className="bg-mailr-darkgray rounded-md border border-mailr-lightgray overflow-hidden">
            <Table>
              <TableHeader className="bg-black/30">
                <TableRow className="hover:bg-transparent border-mailr-lightgray">
                  <TableHead className="w-12">
                    <Checkbox />
                  </TableHead>
                  <TableHead>Domain</TableHead>
                  <TableHead>Forwarding URL</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Nameservers</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {order.domains.map((domain) => (
                  <TableRow key={domain.id} className="hover:bg-mailr-lightgray/10 border-mailr-lightgray">
                    <TableCell>
                      <Checkbox />
                    </TableCell>
                    <TableCell>{domain.name}</TableCell>
                    <TableCell>https://{domain.name}</TableCell>
                    <TableCell>
                      {getStatusBadge(domain.status)}
                    </TableCell>
                    <TableCell>
                      {domain.status === 'active' ? `ns1.${domain.name}, ns2.${domain.name}` : 'Awaiting configuration'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderModal;
