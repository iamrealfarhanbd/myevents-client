import { useState } from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useSettings } from '@/context/SettingsContext';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  BarChart3, 
  Calendar, 
  Utensils, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  ChevronDown,
  Plus,
  Home,
  Palette,
  Users,
  Building2,
  Shield,
  User,
  FileText,
  Bell,
  Search
} from 'lucide-react';

const DashboardLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { settings } = useSettings();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    {
      title: 'Overview',
      icon: LayoutDashboard,
      path: '/dashboard',
      badge: null
    },
    {
      title: 'Polls',
      icon: BarChart3,
      path: '/dashboard/polls',
      badge: null,
      children: [
        { title: 'All Polls', path: '/dashboard/polls', icon: BarChart3 },
        { title: 'Create Poll', path: '/dashboard/create', icon: Plus }
      ]
    },
    {
      title: 'Bookings',
      icon: Utensils,
      path: '/dashboard/bookings',
      badge: null,
      children: [
        { title: 'Manage Bookings', path: '/dashboard/bookings', icon: Utensils },
        { title: 'Create Venue', path: '/dashboard/bookings/create-venue', icon: Plus }
      ]
    },
    {
      title: 'Appearance',
      icon: Palette,
      path: '/dashboard/appearance',
      badge: null
    },
    {
      title: 'Account',
      icon: User,
      path: '/dashboard/account',
      badge: null
    }
  ];

  const isActive = (path) => {
    if (path === '/dashboard') {
      return location.pathname === '/dashboard';
    }
    return location.pathname.startsWith(path);
  };

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState(() => {
    // Auto-expand menu if we're on a child route
    const initialExpanded = {};
    menuItems.forEach(item => {
      if (item.children) {
        const isChildActive = item.children.some(child => location.pathname === child.path);
        if (isChildActive) {
          initialExpanded[item.title] = true;
        }
      }
    });
    return initialExpanded;
  });

  const toggleMenu = (title) => {
    setExpandedMenus(prev => ({
      ...prev,
      [title]: !prev[title]
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Header Bar */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 z-40">
        <div className="h-full px-4 flex items-center justify-between">
          {/* Left: Logo + Menu Toggle */}
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="hidden lg:flex"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>

            <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
              {settings.logo ? (
                <img src={settings.logo} alt={settings.businessName} className="h-8 w-auto" />
              ) : (
                <div 
                  className="p-2 rounded-lg"
                  style={{ 
                    background: `linear-gradient(to right, var(--color-primary), var(--color-secondary))` 
                  }}
                >
                  <Building2 className="h-5 w-5 text-white" />
                </div>
              )}
              <span className="font-bold text-lg hidden sm:block">{settings.businessName}</span>
            </div>
          </div>

          {/* Center: Search Bar (Desktop) */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search polls, bookings, events..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          {/* Right: View Site + Notifications + User Menu */}
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => window.open('/', '_blank')}
              className="hidden md:flex"
            >
              <Home className="h-4 w-4 mr-2" />
              View Site
            </Button>

            <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-lg">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white font-semibold">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-semibold text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-500">Admin</p>
              </div>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="hidden sm:flex"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed top-16 left-0 bottom-0 bg-white border-r border-gray-200 transition-all duration-300 z-30 ${
          sidebarOpen ? 'w-64' : 'w-20'
        } hidden lg:block`}
      >
        <div className="h-full overflow-y-auto py-6">
          <nav className="space-y-1 px-3">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isItemActive = isActive(item.path);
              const hasChildren = item.children && item.children.length > 0;
              const isExpanded = expandedMenus[item.title];

              return (
                <div key={item.title}>
                  <button
                    onClick={() => {
                      if (hasChildren) {
                        toggleMenu(item.title);
                      } else {
                        navigate(item.path);
                      }
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors ${
                      isItemActive
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    } ${!sidebarOpen && 'justify-center'}`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="h-5 w-5 flex-shrink-0" />
                      {sidebarOpen && (
                        <>
                          <span className="font-medium text-sm">{item.title}</span>
                          {item.badge && (
                            <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                              {item.badge}
                            </span>
                          )}
                        </>
                      )}
                    </div>
                    {sidebarOpen && hasChildren && (
                      <ChevronDown
                        className={`h-4 w-4 transition-transform ${
                          isExpanded ? 'rotate-180' : ''
                        }`}
                      />
                    )}
                  </button>

                  {/* Sub-menu items */}
                  {sidebarOpen && hasChildren && isExpanded && (
                    <div className="ml-4 mt-1 space-y-1 border-l-2 border-gray-200 pl-4">
                      {item.children.map((child) => {
                        const ChildIcon = child.icon;
                        const isChildActive = location.pathname === child.path;
                        
                        return (
                          <button
                            key={child.path}
                            onClick={() => navigate(child.path)}
                            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm ${
                              isChildActive
                                ? 'bg-purple-50 text-purple-700 font-medium'
                                : 'text-gray-600 hover:bg-gray-50'
                            }`}
                          >
                            <ChildIcon className="h-4 w-4" />
                            <span>{child.title}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Quick Actions (Bottom of Sidebar) - Commented out */}
        </div>
      </aside>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setMobileMenuOpen(false)}>
          <aside
            className="fixed top-16 left-0 bottom-0 w-64 bg-white overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="py-6">
              <nav className="space-y-1 px-3">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isItemActive = isActive(item.path);
                  const hasChildren = item.children && item.children.length > 0;

                  return (
                    <div key={item.title}>
                      <button
                        onClick={() => {
                          if (!hasChildren) {
                            navigate(item.path);
                            setMobileMenuOpen(false);
                          } else {
                            toggleMenu(item.title);
                          }
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors ${
                          isItemActive
                            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className="h-5 w-5" />
                          <span className="font-medium text-sm">{item.title}</span>
                        </div>
                        {hasChildren && (
                          <ChevronDown
                            className={`h-4 w-4 transition-transform ${
                              expandedMenus[item.title] ? 'rotate-180' : ''
                            }`}
                          />
                        )}
                      </button>
                      
                      {/* Mobile Sub-menu */}
                      {hasChildren && expandedMenus[item.title] && (
                        <div className="ml-4 mt-1 space-y-1 border-l-2 border-gray-200 pl-4">
                          {item.children.map((child) => {
                            const ChildIcon = child.icon;
                            const isChildActive = location.pathname === child.path;
                            
                            return (
                              <button
                                key={child.path}
                                onClick={() => {
                                  navigate(child.path);
                                  setMobileMenuOpen(false);
                                }}
                                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm ${
                                  isChildActive
                                    ? 'bg-purple-50 text-purple-700 font-medium'
                                    : 'text-gray-600 hover:bg-gray-50'
                                }`}
                              >
                                <ChildIcon className="h-4 w-4" />
                                <span>{child.title}</span>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </nav>

              <div className="px-3 mt-6">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          </aside>
        </div>
      )}

      {/* Main Content Area */}
      <main
        className={`pt-16 transition-all duration-300 ${
          sidebarOpen ? 'lg:ml-64' : 'lg:ml-20'
        }`}
      >
        <div className="p-6">
          {children || <Outlet />}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
