
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Bell,
  Globe,
  Book,
  Settings,
  LayoutDashboard
} from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  const menuItems = [
    { 
      name: 'Dashboard', 
      path: '/', 
      icon: <LayoutDashboard className="h-5 w-5" /> 
    },
    { 
      name: 'Order Inboxes', 
      path: '/order-inboxes', 
      icon: <Bell className="h-5 w-5" /> 
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
      name: 'Settings', 
      path: '/settings', 
      icon: <Settings className="h-5 w-5" /> 
    },
  ];
  
  return (
    <div className="fixed top-0 left-0 w-64 h-full bg-mailr-darkgray border-r border-mailr-lightgray z-10">
      <div className="p-8 border-b border-mailr-lightgray">
        <img 
          src="https://mailr.io/logo.svg" 
          alt="mailr.io" 
          className="h-8"
        />
      </div>
      
      <nav className="mt-8 px-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.name}>
              <Link
                to={item.path}
                className={`flex items-center py-3 px-4 rounded-xl transition-all duration-200 group relative ${
                  isActive(item.path) 
                    ? 'bg-mailr-red/10 border-l-4 border-mailr-red shadow-lg shadow-mailr-red/20' 
                    : 'hover:bg-mailr-lightgray/10'
                }`}
              >
                <span className={`mr-3 transition-colors duration-200 ${
                  isActive(item.path) 
                    ? 'text-mailr-red' 
                    : 'text-gray-400 group-hover:text-gray-300'
                }`}>
                  {item.icon}
                </span>
                <span className={`font-medium transition-colors duration-200 ${
                  isActive(item.path) 
                    ? 'text-mailr-red' 
                    : 'text-gray-400 group-hover:text-gray-300'
                }`}>
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
