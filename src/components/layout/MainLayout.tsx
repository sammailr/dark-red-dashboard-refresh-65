
import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

type MainLayoutProps = {
  children: React.ReactNode;
  title: string;
};

const MainLayout = ({ children, title }: MainLayoutProps) => {
  return (
    <div className="min-h-screen bg-mailr-dark text-white flex">
      <Sidebar />
      
      <div className="flex-1 ml-64">
        <div className="container mx-auto px-8 py-4">
          <Header title={title} />
          
          <main className="py-6 animate-fade-in">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
