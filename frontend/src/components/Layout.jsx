import React, { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { analyticsAPI, messagesAPI, uploadAPI } from '../utils/api';
import toast from 'react-hot-toast';
import { 
  Users, 
  UserCheck, 
  DollarSign, 
  Code, 
  LogOut, 
  Menu,
  X,
  Bell,
  Search,
  Settings,
  BarChart3,
  Calendar,
  MessageSquare,
  Home,
  ChevronDown,
  Zap,
  Camera
} from 'lucide-react';
import { useState } from 'react';

const Layout = ({ children }) => {
  const { user, logout, refreshUser } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileDropdown, setProfileDropdown] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [badgeCounts, setBadgeCounts] = useState({ leads: 0, expenses: 0, messages: 0 });
  const [notifications] = useState([
    { id: 1, message: 'New lead John Doe added', time: '2 min ago', unread: true },
    { id: 2, message: 'Payment received from ABC Corp', time: '1 hour ago', unread: true },
    { id: 3, message: 'Project deadline approaching', time: '3 hours ago', unread: false }
  ]);

  useEffect(() => {
    fetchBadgeCounts();
  }, []);

  const fetchBadgeCounts = async () => {
    try {
      const [dashboardData, conversationsData] = await Promise.all([
        analyticsAPI.getDashboard(),
        messagesAPI.getConversations().catch(() => ({ data: [] }))
      ]);
      
      const stats = dashboardData.data;
      const conversations = conversationsData.data || [];
      const unreadMessages = conversations.reduce((sum, conv) => sum + (conv.unreadCount || 0), 0);
      
      setBadgeCounts({
        leads: stats.totalLeads || 0,
        expenses: stats.pendingExpenses || 0,
        messages: unreadMessages
      });
    } catch (error) {
      console.error('Failed to fetch badge counts:', error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handlePhotoUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('profilePhoto', file);

    try {
      const response = await uploadAPI.uploadProfilePhoto(formData);
      console.log('Upload response:', response.data);
      await refreshUser();
      console.log('User after refresh:', user);
      toast.success('Profile photo updated!');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload photo');
    } finally {
      setUploading(false);
    }
  };

  const adminNavigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home, badge: null },
    { name: 'Leads', href: '/leads', icon: Users, badge: badgeCounts.leads > 0 ? badgeCounts.leads.toString() : null },
    { name: 'Clients', href: '/clients', icon: UserCheck, badge: null },
    { name: 'Expenses', href: '/expenses', icon: DollarSign, badge: badgeCounts.expenses > 0 ? badgeCounts.expenses.toString() : null },
    { name: 'Development', href: '/development', icon: Code, badge: null },
    { name: 'Analytics', href: '/analytics', icon: BarChart3, badge: null },
    { name: 'Calendar', href: '/calendar', icon: Calendar, badge: null },
    { name: 'Messages', href: '/messages', icon: MessageSquare, badge: badgeCounts.messages > 0 ? badgeCounts.messages.toString() : null },
    { name: 'Users', href: '/users', icon: Settings, badge: null }
  ];

  const staffNavigation = [
    { name: 'Leads', href: '/leads', icon: Users, badge: badgeCounts.leads > 0 ? badgeCounts.leads.toString() : null },
    { name: 'Messages', href: '/messages', icon: MessageSquare, badge: badgeCounts.messages > 0 ? badgeCounts.messages.toString() : null },
    { name: 'Calendar', href: '/calendar', icon: Calendar, badge: null }
  ];

  const navigation = user?.role === 'admin' ? adminNavigation : staffNavigation;

  const adminQuickActions = [
    { 
      name: 'New Lead', 
      action: () => {
        navigate('/leads');
        toast.success('Navigate to Leads page to add new lead');
      }, 
      color: 'bg-blue-500' 
    },
    { 
      name: 'Add Client', 
      action: () => {
        navigate('/clients');
        toast.success('Navigate to Clients page to add new client');
      }, 
      color: 'bg-green-500' 
    },
    { 
      name: 'Log Expense', 
      action: () => {
        navigate('/expenses');
        toast.success('Navigate to Expenses page to log expense');
      }, 
      color: 'bg-purple-500' 
    },
  ];

  const staffQuickActions = [
    { 
      name: 'New Lead', 
      action: () => {
        navigate('/leads');
        toast.success('Navigate to Leads page to add new lead');
      }, 
      color: 'bg-blue-500' 
    }
  ];

  const quickActions = user?.role === 'admin' ? adminQuickActions : staffQuickActions;

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      toast.info(`Searching for: ${searchTerm}`);
      // Implement actual search functionality here
    }
  };

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-40 lg:hidden ${sidebarOpen ? '' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
        <div className="relative flex w-80 max-w-xs flex-1 flex-col bg-white shadow-2xl h-full">
          <div className="absolute top-4 right-4 z-50">
            <button
              type="button"
              className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 focus:outline-none"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5 text-gray-600" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto pt-5 pb-4">
            <div className="flex flex-shrink-0 items-center px-4 mb-8">
              <div className="flex items-center space-x-3">
                <img 
                  src="/logo.jpg" 
                  alt="Sirswa Solutions Logo" 
                  className="w-10 h-10 rounded-xl object-cover"
                />
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Sirswa</h1>
                  <p className="text-xs text-gray-500">Solutions</p>
                </div>
              </div>
            </div>
            <nav className="mt-5 space-y-2 px-3">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`group flex items-center justify-between px-3 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                      isActive
                        ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg transform scale-105'
                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900 hover:scale-105'
                    }`}
                  >
                    <div className="flex items-center">
                      <Icon className={`mr-3 h-5 w-5 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                      {item.name}
                    </div>
                    {item.badge && (
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        isActive ? 'bg-white bg-opacity-20 text-white' : 'bg-red-100 text-red-600'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
            
            {/* Quick Actions Mobile */}
            <div className="mt-8 px-3">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Quick Actions</h3>
              <div className="space-y-2">
                {quickActions.map((action) => (
                  <button
                    key={action.name}
                    onClick={action.action}
                    className={`w-full flex items-center px-3 py-2 text-sm font-medium text-white rounded-lg ${action.color} hover:opacity-90 transition-opacity`}
                  >
                    {action.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-72 lg:flex-col">
        <div className="flex min-h-0 flex-1 flex-col bg-white/80 backdrop-blur-xl border-r border-gray-200/50 shadow-xl">
          <div className="flex flex-1 flex-col overflow-y-auto pt-6 pb-4">
            {/* Logo */}
            <div className="flex flex-shrink-0 items-center px-6 mb-8">
              <div className="flex items-center space-x-3">
                <img 
                  src="/logo.jpg" 
                  alt="Sirswa Solutions Logo" 
                  className="w-12 h-12 rounded-2xl object-cover shadow-lg"
                />
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Sirswa Solutions</h1>
                  <p className="text-sm text-gray-500">CRM Software</p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="mt-5 flex-1 space-y-2 px-4">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`group flex items-center justify-between px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                      isActive
                        ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg transform scale-105'
                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900 hover:scale-105'
                    }`}
                  >
                    <div className="flex items-center">
                      <Icon className={`mr-3 h-5 w-5 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                      {item.name}
                    </div>
                    {item.badge && (
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        isActive ? 'bg-white bg-opacity-20 text-white' : 'bg-red-100 text-red-600'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Quick Actions */}
            <div className="mt-8 px-4">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Quick Actions</h3>
              <div className="space-y-2">
                {quickActions.map((action) => (
                  <button
                    key={action.name}
                    onClick={action.action}
                    className={`w-full flex items-center justify-center px-4 py-3 text-sm font-medium text-white rounded-xl ${action.color} hover:opacity-90 transition-all duration-200 hover:scale-105 shadow-md`}
                  >
                    {action.name}
                  </button>
                ))}
              </div>
            </div>

            {/* User Profile Card */}
            <div className="mt-8 mx-4 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200">
              <div className="flex items-center space-x-3">
                {user?.profilePhoto ? (
                  <img 
                    src={`http://localhost:5000${user.profilePhoto}`} 
                    alt="Profile" 
                    className="w-10 h-10 rounded-full object-cover"
                    onError={(e) => {
                      console.log('Sidebar image failed to load:', user.profilePhoto);
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div className={`w-10 h-10 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold ${user?.profilePhoto ? 'hidden' : ''}`}>
                  {user?.name?.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
                  <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-72 flex flex-col flex-1">
        {/* Mobile header */}
        <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-xl border-b border-gray-200/50 p-3 lg:hidden">
          <button
            type="button"
            className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-xl text-gray-500 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 transition-colors"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>

        {/* Enhanced Top bar */}
        <div className="bg-white/80 backdrop-blur-xl shadow-sm border-b border-gray-200/50 relative z-10">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16 md:h-20">
              <div className="flex items-center space-x-4">
                <div>
                  <h2 className="text-lg md:text-2xl font-bold text-gray-900">
                    Welcome back, {user?.name}! 👋
                  </h2>
                  <p className="text-xs md:text-sm text-gray-600 hidden sm:block">Here's what's happening with your business today.</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                {/* Profile Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setProfileDropdown(!profileDropdown)}
                    className="flex items-center space-x-3 p-2 text-sm rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    {user?.profilePhoto ? (
                      <img 
                        src={`http://localhost:5000${user.profilePhoto}`} 
                        alt="Profile" 
                        className="w-8 h-8 rounded-full object-cover"
                        onError={(e) => {
                          console.log('Image failed to load:', user.profilePhoto);
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div className={`w-8 h-8 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-sm ${user?.profilePhoto ? 'hidden' : ''}`}>
                      {user?.name?.charAt(0)}
                    </div>
                    <div className="hidden md:block text-left">
                      <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                      <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                    </div>
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                  </button>

                  {profileDropdown && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg ring-1 ring-black ring-opacity-5 z-[9999]">
                      <div className="py-1">
                        <label className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer">
                          <div className="flex items-center">
                            <Camera className="h-4 w-4 mr-2" />
                            {uploading ? 'Uploading...' : 'Change Photo'}
                          </div>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handlePhotoUpload}
                            className="hidden"
                            disabled={uploading}
                          />
                        </label>
                        <button
                          onClick={handleLogout}
                          className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                        >
                          <div className="flex items-center">
                            <LogOut className="h-4 w-4 mr-2" />
                            Sign out
                          </div>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Page content with enhanced styling */}
        <main className="flex-1 relative z-0">
          <div className="py-4 md:py-8">
            <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 p-3 md:p-6 min-h-[400px] md:min-h-[600px] relative z-0">
                {children}
              </div>
            </div>
          </div>
          
          {/* Floating background elements */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute top-20 left-20 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
            <div className="absolute top-40 right-20 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
            <div className="absolute -bottom-8 left-40 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;