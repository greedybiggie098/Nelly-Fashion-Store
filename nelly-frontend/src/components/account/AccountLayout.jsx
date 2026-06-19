import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import AccountSidebar from './AccountSidebar';
import AccountNavbar from './AccountNavbar';
import './AccountLayout.css';

const AccountLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    // Close sidebar on mobile by default
    if (window.innerWidth < 992) {
      setSidebarOpen(false);
    }

    // Handle window resize
    const handleResize = () => {
      if (window.innerWidth >= 992) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="account-layout">
      <AccountSidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      
      <div className={`account-main ${sidebarOpen ? 'account-main-shifted' : ''}`}>
        <AccountNavbar toggleSidebar={toggleSidebar} />
        
        <main className="account-content">
          <div className="account-content-inner">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AccountLayout;
