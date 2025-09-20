import React, { Fragment, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Menu, Transition, Popover } from '@headlessui/react';
import { 
    FiSearch, FiBell, FiChevronDown, FiMenu, FiUser, FiRepeat, 
    FiLogOut, FiMoon, FiSun, FiMonitor, FiLoader, FiArrowLeft, FiCheck, FiChevronRight
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { useTheme } from '../../context/ThemeContext';

const Header = ({ setSidebarOpen }) => {
    const { user, logout } = useAuth();
    const { notifications, unreadCount, loading, markAllAsRead, markAsRead } = useNotifications();
    const { theme, setTheme } = useTheme(); 
    const [menuView, setMenuView] = useState('main');

    const themeOptions = [
        { name: 'System', value: 'system', icon: FiMonitor },
        { name: 'Light', value: 'light', icon: FiSun },
        { name: 'Dark', value: 'dark', icon: FiMoon },
    ];

    return (
        <header className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
            {/* --- Left side & Notifications (Unchanged) --- */}
            <div className="flex items-center">
                <button onClick={() => setSidebarOpen(true)} className="text-gray-500 dark:text-gray-400 focus:outline-none md:hidden">
                    <FiMenu size={24} />
                </button>
                <div className="relative hidden md:block ml-4">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3"><FiSearch className="text-gray-400" /></span>
                    <input type="text" placeholder="Search forms, templates..." className="w-full max-w-xs py-2 pl-10 pr-4 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white dark:focus:bg-gray-600" />
                </div>
            </div>
            <div className="flex items-center space-x-4">
                                <Popover className="relative">
                    <Popover.Button className="relative text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 focus:outline-none">
                        <FiBell size={22} />
                        {unreadCount > 0 && <span className="absolute top-0 right-0 flex h-3 w-3"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 justify-center items-center text-white text-[10px]">{unreadCount}</span></span>}
                    </Popover.Button>
                    <Transition as={Fragment} enter="transition ease-out duration-200" enterFrom="opacity-0 translate-y-1" enterTo="opacity-100 translate-y-0" leave="transition ease-in duration-150" leaveFrom="opacity-100 translate-y-0" leaveTo="opacity-0 translate-y-1">
                        <Popover.Panel className="absolute right-0 z-10 mt-2 w-80 max-w-sm transform">
                            <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                                <div className="bg-white dark:bg-gray-800 p-4">
                                    <div className="flex justify-between items-center">
                                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Notifications</h3>
                                        {unreadCount > 0 && <button onClick={markAllAsRead} className="text-sm text-blue-600 dark:text-blue-400 hover:underline">Mark all as read</button>}
                                    </div>
                                    <div className="mt-4 flow-root max-h-96 overflow-y-auto">
                                        {loading && notifications.length === 0 ? <div className="flex justify-center items-center h-24"><FiLoader className="animate-spin text-gray-400" size={24} /></div>
                                        : notifications.length === 0 ? <p className="text-center text-sm text-gray-500 dark:text-gray-400 py-4">No new notifications</p>
                                        : 
                                        // --- MODIFICATION START ---
                                        <ul role="list" className="-my-2 divide-y divide-gray-200 dark:divide-gray-700">
                                            {notifications.map((notif) => (
                                                <li key={notif._id}>
                                                    <button 
                                                     onClick={() => markAsRead(notif._id)}
                                                        className="w-full text-left flex items-center p-2 space-x-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-700"
                                                    >
                                                        <div className={`flex-shrink-0 h-2.5 w-2.5 rounded-full ${!notif.isRead ? 'bg-blue-500' : 'bg-transparent'}`}></div>
                                                        <p className="text-sm text-gray-700 dark:text-gray-300">{notif.message}</p>
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                        // --- MODIFICATION END ---
                                        }
                                    </div>
                                </div>
                            </div>
                        </Popover.Panel>
                    </Transition>
                </Popover>
                {/* --- Profile Dropdown --- */}
                <Menu as="div" className="relative">
                   <div>
                        <Menu.Button className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 focus:outline-none">
                            {/* --- LOGO DISPLAY LOGIC --- */}
                            {user?.currentOrganization?.logo?.url ? (
                                <img src={user.currentOrganization.logo.url} alt="Organization Logo" className="w-9 h-9 rounded-full object-cover" />
                            ) : (
                                <div className="w-9 h-9 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center font-bold text-gray-600 dark:text-gray-300">
                                    {user?.currentOrganization?.name ? user.currentOrganization.name.charAt(0).toUpperCase() : 'O'}
                                </div>
                            )}

                            <span className="hidden lg:inline ml-2 ...">{user?.currentOrganization?.name || '...'}</span>
                            <FiChevronDown className="ml-2 ..." />
                        </Menu.Button>
                    </div>
                    <Transition as={Fragment} enter="transition ease-out duration-100" enterFrom="transform opacity-0 scale-95" enterTo="transform opacity-100 scale-100" leave="transition ease-in duration-75" leaveFrom="transform opacity-100 scale-100" leaveTo="transform opacity-0 scale-95" afterLeave={() => setMenuView('main')}>
                        <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none overflow-hidden">
                            <div className="relative">
                                {/* Panel 1: Main Menu */}
                                <div className={`transition-transform duration-200 ease-in-out ${menuView === 'main' ? 'translate-x-0' : '-translate-x-full'}`}>
                                    <div className="px-1 py-1">
                                        <Menu.Item>
                                            {({ active }) => <NavLink to="/settings" className={`${active ? 'bg-gray-100 dark:bg-gray-700' : ''} text-gray-900 dark:text-gray-200 group flex w-full items-center rounded-md px-2 py-2 text-sm`}><FiUser className="mr-2 h-5 w-5" />Account Settings</NavLink>}
                                        </Menu.Item>
                                        <Menu.Item>
                                            {({ active }) => <button disabled className={`${active ? 'bg-gray-100 dark:bg-gray-700' : ''} text-gray-500 dark:text-gray-400 group flex w-full items-center rounded-md px-2 py-2 text-sm cursor-not-allowed`}><FiRepeat className="mr-2 h-5 w-5" />Switch Organization</button>}
                                        </Menu.Item>
                                    </div>
                                    <div className="px-1 py-1 border-t border-gray-100 dark:border-gray-700">
                                        {/* THIS IS THE FIX: A regular button/div that is NOT a Menu.Item */}
                                        <button onClick={() => setMenuView('theme')} className="text-gray-900 dark:text-gray-200 group flex w-full items-center rounded-md px-2 py-2 text-sm justify-between hover:bg-gray-100 dark:hover:bg-gray-700">
                                            <span className="flex items-center"><FiMonitor className="mr-2 h-5 w-5" />Theme</span>
                                            <FiChevronRight className="h-4 w-4 text-gray-400" />
                                        </button>
                                    </div>
                                    <div className="px-1 py-1 border-t border-gray-100 dark:border-gray-700">
                                        <Menu.Item>
                                            {({ active }) => <button onClick={logout} className={`${active ? 'bg-red-500 text-white' : 'text-red-600 dark:text-red-400'} group flex w-full items-center rounded-md px-2 py-2 text-sm`}><FiLogOut className="mr-2 h-5 w-5" />Sign Out</button>}
                                        </Menu.Item>
                                    </div>
                                </div>

                                {/* Panel 2: Theme Selection */}
                                <div className={`absolute top-0 left-0 w-full bg-white dark:bg-gray-800 transition-transform duration-200 ease-in-out ${menuView === 'theme' ? 'translate-x-0' : 'translate-x-full'}`}>
                                    <div className="p-1">
                                        <div className="flex items-center border-b border-gray-200 dark:border-gray-700 mb-1">
                                            <button onClick={() => setMenuView('main')} className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full m-1 cursor-pointer">
                                                <FiArrowLeft className="h-5 w-5" />
                                            </button>
                                            <span className="font-semibold text-sm text-gray-700 dark:text-gray-200">back</span>
                                        </div>
                                        {themeOptions.map((option) => (
                                            <Menu.Item key={option.value}>
                                                {({ active }) => <button onClick={() => setTheme(option.value)} className={`group flex w-full items-center justify-between rounded-md px-3 py-2 text-sm ${theme === option.value ? 'bg-blue-600 text-white' : 'text-gray-900 dark:text-gray-200'} ${active && theme !== option.value ? 'bg-gray-100 dark:bg-gray-700' : ''}`}>
                                                    <span className="flex items-center"><option.icon className="mr-3 h-5 w-5" />{option.name}</span>
                                                    {theme === option.value && <FiCheck className="h-5 w-5" />}
                                                </button>}
                                            </Menu.Item>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </Menu.Items>
                    </Transition>
                </Menu>
            </div>
        </header>
    );
};

export default Header;