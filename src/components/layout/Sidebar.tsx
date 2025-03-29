import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Users, Globe, Inbox, Settings, BookOpen, Wrench, Share2, LayoutDashboard } from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();
  
  const navigationItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Order Inboxes', path: '/order-inboxes', icon: ShoppingCart },
    { name: 'Sending Platform Accounts', path: '/sending-platform', icon: Users },
    { name: 'Domains', path: '/domains', icon: Globe },
    { name: 'Master Inbox', path: '/master-inbox', icon: Inbox },
    { name: 'Guide', path: '/guide', icon: BookOpen },
    { name: 'Tools', path: '/tools', icon: Wrench },
    { name: 'Affiliate Portal', path: '/affiliate', icon: Share2 },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <div className="fixed h-screen w-64 bg-mailr-dark border-r border-mailr-lightgray z-10 flex flex-col">
      <div className="p-6">
        <Link to="/" className="flex items-center">
          <h1 className="text-2xl font-bold">
            <span className="text-white">mailr</span>
            <span className="text-mailr-red">.io</span>
          </h1>
        </Link>
      </div>
      
      <nav className="flex-1 mt-6">
        <ul className="space-y-2">
          {navigationItems.map((item) => {
            const isActive = location.pathname === item.path || 
                            (item.path === '/' && location.pathname === '/');
                          
            return (
              <li key={item.name}>
                <Link
                  to={item.path}
                  className={`flex items-center px-6 py-3 text-sm transition-colors ${
                    isActive
                      ? 'text-mailr-red bg-mailr-darkgray border-l-4 border-mailr-red'
                      : 'text-gray-300 hover:bg-mailr-darkgray hover:text-white'
                  }`}
                >
                  <item.icon className="h-5 w-5 mr-3" />
                  <span>{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      
      <div className="p-6">
        <div className="text-xs text-gray-500">
          <p>© 2023 mailr.io</p>
          <p>Version 1.0.0</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
