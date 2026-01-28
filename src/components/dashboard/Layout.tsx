import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  ClipboardList, 
  Activity, 
  BarChart3, 
  Bell, 
  LogOut, 
  Menu, 
  X, 
  User,
  Search,
  ChevronDown
} from 'lucide-react';
import { Logo } from './Logo';

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}

const SidebarItem = ({ icon, label, active, onClick }: SidebarItemProps) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center space-x-3 px-6 py-3 transition-colors duration-200 ${
      active 
        ? 'bg-[#18392b]/10 border-r-4 border-[#18392b] text-[#18392b]' 
        : 'text-gray-500 hover:bg-gray-50 hover:text-[#18392b]'
    }`}
  >
    <span className={active ? 'text-[#18392b]' : 'text-gray-400'}>{icon}</span>
    <span className="font-medium">{label}</span>
  </button>
);

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
}

export const Layout = ({ children, activeTab, setActiveTab, onLogout }: LayoutProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <aside 
        className={`${
          isSidebarOpen ? 'w-64' : 'w-20'
        } bg-white border-r border-gray-200 transition-all duration-300 flex flex-col z-30`}
      >
        <div className="p-6 flex items-center justify-between">
          <Logo size={32} iconOnly={!isSidebarOpen} />
        </div>

        <nav className="flex-1 mt-6">
          <SidebarItem 
            icon={<LayoutDashboard size={20} />} 
            label={isSidebarOpen ? "Dashboard" : ""} 
            active={activeTab === 'dashboard'} 
            onClick={() => setActiveTab('dashboard')} 
          />
          <SidebarItem 
            icon={<ClipboardList size={20} />} 
            label={isSidebarOpen ? "Surveys" : ""} 
            active={activeTab === 'surveys'} 
            onClick={() => setActiveTab('surveys')} 
          />
          <SidebarItem 
            icon={<Activity size={20} />} 
            label={isSidebarOpen ? "Monitoring" : ""} 
            active={activeTab === 'monitoring'} 
            onClick={() => setActiveTab('monitoring')} 
          />
          <SidebarItem 
            icon={<BarChart3 size={20} />} 
            label={isSidebarOpen ? "Analytics" : ""} 
            active={activeTab === 'analytics'} 
            onClick={() => setActiveTab('analytics')} 
          />
          <SidebarItem 
            icon={<Bell size={20} />} 
            label={isSidebarOpen ? "Notifications" : ""} 
            active={activeTab === 'notifications'} 
            onClick={() => setActiveTab('notifications')} 
          />
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button 
            onClick={onLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut size={20} />
            {isSidebarOpen && <span className="font-medium">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-bottom border-gray-200 flex items-center justify-between px-8 z-20">
          <div className="flex items-center bg-gray-100 px-3 py-1.5 rounded-lg w-96">
            <Search size={18} className="text-gray-400" />
            <input 
              type="text" 
              placeholder="Search data, reports, surveys..." 
              className="bg-transparent border-none focus:outline-none ml-2 text-sm w-full"
            />
          </div>

          <div className="flex items-center space-x-4">
            <button className="p-2 text-gray-400 hover:text-[#18392b] transition-colors relative">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="h-8 w-px bg-gray-200"></div>
            <div className="flex items-center space-x-3 cursor-pointer group">
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-800 leading-tight">Admin User</p>
                <p className="text-xs text-gray-500">Ministry of Health</p>
              </div>
              <img 
                src="https://images.unsplash.com/photo-1645066928295-2506defde470?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBkb2N0b3IlMjBwcm9maWxlJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzY5NDg2NzgwfDA&ixlib=rb-4.1.0&q=80&w=1080" 
                alt="Profile" 
                className="w-10 h-10 rounded-full border border-gray-200"
              />
              <ChevronDown size={16} className="text-gray-400 group-hover:text-gray-600" />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-8">
          {children}
        </main>
      </div>
    </div>
  );
};
