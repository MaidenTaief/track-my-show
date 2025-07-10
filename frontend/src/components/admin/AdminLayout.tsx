import React, { ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, FileText, Users, Calendar, Radio, Star, UserPlus, LogOut, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface AdminLayoutProps {
  children: ReactNode;
  title?: string;
  showBackButton?: boolean;
  onBack?: () => void;
  rightActions?: ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ 
  children, 
  title, 
  showBackButton, 
  onBack,
  rightActions 
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const menuItems = [
    { id: 'homepage', label: 'Homepage', icon: Home, path: '/admin/homepage' },
    { id: 'articles', label: 'Articles', icon: FileText, path: '/admin/articles' },
    { id: 'organizer', label: 'Organizer', icon: Users, path: '/admin/organizers' },
    { id: 'event', label: 'Event', icon: Calendar, path: '/admin/events' },
    { id: 'live-event', label: 'Live Event', icon: Radio, path: '/admin/live-events' },
    { id: 'reviews', label: 'Reviews', icon: Star, path: '/admin/reviews' },
    { id: 'create-user', label: 'Create User', icon: UserPlus, path: '/admin/users/create' },
  ];

  const handleMenuClick = (path: string) => {
    navigate(path);
  };

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <div className="min-h-screen bg-gray-900 flex">
      {/* Sidebar */}
      <div className="w-64 bg-black text-white flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-gray-800">
          <button 
            onClick={() => navigate('/admin')}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <div className="text-white font-bold text-xl">TRACK</div>
            <div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[14px] border-b-yellow-400"></div>
            <div className="text-white font-bold text-xl">MY</div>
            <div className="text-yellow-400 font-bold text-xl">SHOW</div>
          </button>
        </div>

        {/* User Info */}
        <div className="px-6 py-4">
          <p className="text-gray-400 text-sm">Super Admin</p>
          <p className="text-white text-sm">{user?.firstName} {user?.lastName}</p>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-4 py-6">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const IconComponent = item.icon;
              const active = isActive(item.path);
              return (
                <li key={item.id}>
                  <button
                    onClick={() => handleMenuClick(item.path)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      active
                        ? 'bg-gray-800 text-white'
                        : 'text-gray-400 hover:text-white hover:bg-gray-800'
                    }`}
                  >
                    <IconComponent size={20} />
                    <span>{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-gray-800">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-gray-900">
        {/* Header */}
        {(title || showBackButton || rightActions) && (
          <div className="bg-gray-800 px-6 py-4 border-b border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {showBackButton && (
                  <button 
                    onClick={onBack || (() => navigate(-1))}
                    className="flex items-center gap-2 text-gray-400 hover:text-white"
                  >
                    <ArrowLeft size={20} />
                    <span>Back to {title}</span>
                  </button>
                )}
                {title && !showBackButton && (
                  <h1 className="text-2xl font-bold text-white">{title}</h1>
                )}
              </div>
              {rightActions && (
                <div className="flex items-center gap-4">
                  {rightActions}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Page Content */}
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
