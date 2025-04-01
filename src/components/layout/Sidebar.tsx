
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Bell,
  Inbox,
  SendHorizontal,
  Globe,
  Book,
  Wrench, // Changed from Tools to Wrench
  Users,
  Settings,
  FileText
} from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  const menuItems = [
    { 
      name: 'Order Inboxes', 
      path: '/order-inboxes', 
      icon: <Bell className="h-5 w-5" /> 
    },
    { 
      name: 'Master Inbox', 
      path: '/master-inbox', 
      icon: <Inbox className="h-5 w-5" /> 
    },
    { 
      name: 'Sending Platform', 
      path: '/sending-platform', 
      icon: <SendHorizontal className="h-5 w-5" /> 
    },
    { 
      name: 'Domains', 
      path: '/domains', 
      icon: <Globe className="h-5 w-5" /> 
    },
    { 
      name: 'Guide', 
      path: '/guide', 
      icon: <Book className="h-5 w-5" /> 
    },
    { 
      name: 'Tools', 
      path: '/tools', 
      icon: <Wrench className="h-5 w-5" /> // Changed from Tools to Wrench
    },
    { 
      name: 'Affiliate', 
      path: '/affiliate', 
      icon: <Users className="h-5 w-5" /> 
    },
    { 
      name: 'Subscriptions', 
      path: '/subscriptions', 
      icon: <FileText className="h-5 w-5" /> 
    },
    { 
      name: 'Settings', 
      path: '/settings', 
      icon: <Settings className="h-5 w-5" /> 
    },
  ];
  
  return (
    <div className="fixed top-0 left-0 w-64 h-full bg-mailr-darkgray border-r border-mailr-lightgray z-10">
      <div className="p-6 border-b border-mailr-lightgray">
        <h1 className="text-2xl font-bold text-mailr-red">Mailr</h1>
        <p className="text-gray-400 text-sm">Smart Email Solution</p>
      </div>
      
      <nav className="mt-6">
        <ul>
          {menuItems.map((item) => (
            <li key={item.name}>
              <Link
                to={item.path}
                className={`flex items-center py-3 px-6 hover:bg-mailr-lightgray/10 transition-colors ${
                  isActive(item.path) ? 'bg-mailr-lightgray/20 border-l-4 border-mailr-red' : ''
                }`}
              >
                <span className={`mr-3 ${isActive(item.path) ? 'text-mailr-red' : 'text-gray-400'}`}>
                  {item.icon}
                </span>
                <span className={isActive(item.path) ? 'text-white' : 'text-gray-400'}>
                  {item.name}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
