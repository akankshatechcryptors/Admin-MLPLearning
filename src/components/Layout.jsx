import React from 'react';
import Header from './Header';
import { Outlet } from 'react-router-dom';

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Fixed Header */}
      <div className="fixed top-0 w-full z-50">
        <Header />
      </div>

      {/* Page content with top padding to avoid being hidden under header */}
      <main className="pt-[80px] px-4 flex-1 bg-gray-50">
        <Outlet />
      </main>
      <div className='py-1'>
        <footer className="text-center font-semibold">
          Copyright © MIND&apos;s Lab Publishing 2025. All rights reserved.</footer>
      </div>
    </div>
  );
};

export default Layout;
