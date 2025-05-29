
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
    <div className="fixed top-0 left-0 w-64 h-full bg-white border-r border-gray-200 z-10">
      <div className="p-6 border-b border-gray-100">
        <img 
          src="/lovable-uploads/8f9bba41-ada3-4cc0-9a48-66e8eeb37fc0.png" 
          alt="Mailr" 
          className="h-8 w-auto"
        />
      </div>
      
      <nav className="mt-2">
        <ul className="space-y-1 px-3">
          {menuItems.map((item) => (
            <li key={item.name}>
              <Link
                to={item.path}
                className={`flex items-center py-2.5 px-3 rounded-lg hover:bg-gray-50 transition-colors group ${
                  isActive(item.path) 
                    ? 'bg-red-50 text-red-600 font-medium' 
                    : 'text-gray-700 hover:text-gray-900'
                }`}
              >
                <span className={`mr-3 ${
                  isActive(item.path) 
                    ? 'text-red-600' 
                    : 'text-gray-400 group-hover:text-gray-600'
                }`}>
                  {item.icon}
                </span>
                <span className="text-sm">
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
