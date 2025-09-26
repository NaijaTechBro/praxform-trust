import React from 'react';
import { NavLink } from 'react-router-dom';
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react'; 

// Import local image assets
import logo from '../../assets/logo.png';
import icon from '../../assets/icon.png';
import Dash from '../../assets/sidebar/dashboard.png';
import Forms from '../../assets/sidebar/form.png';
import Templates from '../../assets/sidebar/template.png';
import Submissions from '../../assets/sidebar/submission.png';
import Settings from '../../assets/sidebar/setting.png';
import AuditLogs from '../../assets/sidebar/audit.png';
import Payments from '../../assets/sidebar/integration.png';
import { useAuth } from '../../context/AuthContext';

// Inline SVG icons for collapse button and more options
const menuIcons = {
  arrowLeft: (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-left-circle"><circle cx="12" cy="12" r="10"/><path d="M12 8l-4 4 4 4"/><path d="M16 12H8"/></svg>
  ),
  arrowRight: (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-right-circle"><circle cx="12" cy="12" r="10"/><path d="M12 16l4-4-4-4"/><path d="M8 12h8"/></svg>
  ),
  more: (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-ellipsis"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>
  )
};

const Sidebar = ({ isSidebarOpen, setSidebarOpen }) => {
  const { user } = useAuth();

  const createIcon = (src, alt) => <img src={src} alt={alt} className="w-5 h-5" />;

  const mainMenuItems = [
    { name: 'Dashboard', icon: createIcon(Dash, 'Dashboard Icon'), path: '/dashboard' },
    { name: 'Forms', icon: createIcon(Forms, 'Forms Icon'), path: '/forms' },
    { name: 'Templates', icon: createIcon(Templates, 'Templates Icon'), path: '/templates' },
    { name: 'Submissions', icon: createIcon(Submissions, 'Submissions Icon'), path: '/submissions' },
  ];

  const accountMenuItems = [
    { name: 'Settings', icon: createIcon(Settings, 'Settings Icon'), path: '/settings' },
    // { name: 'Payment', icon: createIcon(Payments, 'Payment Icon'), path: '/payments' },
    { name: 'Audit Logs', icon: createIcon(AuditLogs, 'Audit Logs Icon'), path: '/audit-logs' },
  ];

  const activeLinkStyle = 'bg-blue-600 text-white'; // Your primary color handles active links

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      {/* Overlay for mobile */}
      <div
        className={`fixed inset-0 bg-transparent z-30 md:hidden ${isSidebarOpen ? 'block' : 'hidden'}`}
        onClick={() => setSidebarOpen(false)}
      ></div>

      <div
        className={`
          fixed inset-y-0 left-0 bg-white dark:bg-gray-800 p-4 transition-all duration-300 ease-in-out z-40 flex flex-col border-r border-gray-200 dark:border-gray-700
          ${isSidebarOpen ? 'w-64' : 'w-20'}
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          md:relative md:translate-x-0
        `}
      >
        <div className={`flex items-center ${isSidebarOpen ? 'justify-between' : 'justify-center'} mb-10`}>
          {isSidebarOpen ? (
            <a href='/'><img src={logo} alt="Logo" className="w-35 h-10 mb-10" /></a>
          ) : (
            <a href='/'><img src={icon} alt="icon" className="w-10 h-10 rounded-lg" /></a>
          )}
          <button 
          onClick={toggleSidebar} 
          className="text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white transition-transform duration-300 ease-in-out"
          >   
          {isSidebarOpen ? menuIcons.arrowLeft : menuIcons.arrowRight}
          </button>
        </div>

        {/* Main Menu */}
        <nav className="flex-1">
          {isSidebarOpen && (
            <h2 className="text-xs font-semibold text-gray-800 dark:text-gray-300 uppercase tracking-wider mb-3 px-2">Main Menu</h2>
          )}
          <ul>
            {mainMenuItems.map((item, index) => (
              <li key={index} className="mb-2">
                <NavLink
                  to={item.path}
                  className={({ isActive }) => `
                    flex items-center p-2 text-sm text-gray-600 dark:text-gray-300 rounded-full transition-colors duration-200
                    ${isActive ? activeLinkStyle : 'hover:bg-gray-100 dark:hover:bg-gray-700'}
                    ${!isSidebarOpen && 'justify-center'}
                  `}
                >
                  <span className={`${isSidebarOpen && 'mr-3'}`}>{item.icon}</span>
                  {isSidebarOpen && item.name}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* Account Management */}
          {isSidebarOpen && (
            <h2 className="text-xs font-semibold text-gray-800 dark:text-gray-300 uppercase tracking-wider mt-8 mb-3 px-2">Account Management</h2>
          )}
          <ul>
            {accountMenuItems.map((item, index) => (
              <li key={index} className="mb-2">
                <NavLink
                  to={item.path}
                  className={({ isActive }) => `
                    flex items-center p-2 text-sm text-gray-600 dark:text-gray-300 rounded-full transition-colors duration-200
                    ${isActive ? activeLinkStyle : 'hover:bg-gray-100 dark:hover:bg-gray-700'}
                    ${!isSidebarOpen && 'justify-center'}
                  `}
                >
                  <span className={`${isSidebarOpen && 'mr-3'}`}>{item.icon}</span>
                  {isSidebarOpen && item.name}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* User Profile with Dropdown */}
        <div className="mt-auto border-t border-gray-200 dark:border-gray-700 pt-4">
              <Menu as="div" className="relative">
                    <Menu.Button className={`flex items-center w-full focus:outline-none ${isSidebarOpen ? 'justify-between' : 'justify-center'}`}>
                        <div className="flex items-center">
                            {/* --- AVATAR DISPLAY LOGIC --- */}
                            {user?.avatar?.url ? (
                                <img src={user.avatar.url} alt="User Avatar" className="w-10 h-10 rounded-full object-cover" />
                            ) : (
                                <div className="w-10 h-10 rounded-full bg-yellow-400 flex items-center justify-center font-bold text-white">
                                    {user && user.firstName ? user.firstName.charAt(0).toUpperCase() : 'P'}
                                </div>
                            )}

                            {isSidebarOpen && (
                                <span className="ml-3 text-sm font-semibold text-gray-800 dark:text-gray-100">
                                    {user ? `${user.firstName} ${user.lastName}` : 'Guest User'}
                                </span>
                            )}
                        </div>
                    </Menu.Button>
                </Menu>
        </div>
      </div>
    </>
  );
};

export default Sidebar;