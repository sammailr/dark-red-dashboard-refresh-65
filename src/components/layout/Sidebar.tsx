

import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  const menuItems = [
    { 
      name: 'Dashboard', 
      path: '/', 
      icon: <i className="fa-solid fa-house text-base" /> 
    },
    { 
      name: 'Order Inboxes', 
      path: '/order-inboxes', 
      icon: <i className="fa-solid fa-envelope text-base" /> 
    },
    { 
      name: 'Domains', 
      path: '/domains', 
      icon: <i className="fa-solid fa-globe text-base" /> 
    },
    { 
      name: 'Guide', 
      path: '/guide', 
      icon: <i className="fa-solid fa-book text-base" /> 
    },
    { 
      name: 'Affiliate Portal', 
      path: '/affiliate', 
      icon: <i className="fa-solid fa-diagram-project text-base" /> 
    },
  ];
  
  return (
    <div className="fixed top-0 left-0 w-64 h-full bg-mailr-darkgray border-r border-mailr-lightgray z-10">
      <div className="p-6 border-b border-mailr-lightgray">
        <img 
          src="/lovable-uploads/8f9bba41-ada3-4cc0-9a48-66e8eeb37fc0.png" 
          alt="Mailr" 
          className="h-8 w-auto"
        />
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

