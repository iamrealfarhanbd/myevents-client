import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useSettings } from '@/context/SettingsContext';
import { Button } from '@/components/ui/button';
import { LogOut, Sparkles, LayoutDashboard, Menu, X, Home, Calendar, Utensils } from 'lucide-react';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { settings } = useSettings();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Get initials from business name
  const getInitials = (name) => {
    if (!name) return 'EP'; // EventPro default
    const words = name.trim().split(' ');
    if (words.length === 1) {
      return words[0].charAt(0).toUpperCase();
    }
    return words.map(word => word.charAt(0).toUpperCase()).slice(0, 2).join('');
  };

  const handleNavigation = (path) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-14 sm:h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group" onClick={() => setMobileMenuOpen(false)}>
            {settings.logo ? (
              <>
                <img 
                  src={settings.logo} 
                  alt={settings.businessName} 
                  className="h-8 sm:h-10 w-auto object-contain"
                />
                {(settings.showBusinessNameInHeader === undefined || settings.showBusinessNameInHeader === null || Boolean(settings.showBusinessNameInHeader) === true) && (
                  <span 
                    className="text-lg sm:text-2xl font-bold bg-clip-text text-transparent"
                    style={{ 
                      backgroundImage: `linear-gradient(to right, var(--color-primary), var(--color-secondary))` 
                    }}
                  >
                    {settings.businessName || 'EventPro'}
                  </span>
                )}
              </>
            ) : (
              <>
                <div 
                  className="h-8 sm:h-10 w-8 sm:w-10 rounded-lg flex items-center justify-center font-bold text-white text-sm sm:text-base group-hover:shadow-lg transition-shadow"
                  style={{ 
                    background: `linear-gradient(to right, var(--color-primary), var(--color-secondary))` 
                  }}
                >
                  {getInitials(settings.businessName)}
                </div>
                {(settings.showBusinessNameInHeader === undefined || settings.showBusinessNameInHeader === null || Boolean(settings.showBusinessNameInHeader) === true) && (
                  <span 
                    className="text-lg sm:text-2xl font-bold bg-clip-text text-transparent"
                    style={{ 
                      backgroundImage: `linear-gradient(to right, var(--color-primary), var(--color-secondary))` 
                    }}
                  >
                    {settings.businessName || 'EventPro'}
                  </span>
                )}
              </>
            )}
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-1">
            <button onClick={() => navigate('/')} className="px-3 py-2 text-gray-700 hover:text-blue-600 font-medium transition-colors">
              Home
            </button>
            <button onClick={() => navigate('/events')} className="px-3 py-2 text-gray-700 hover:text-blue-600 font-medium transition-colors">
              Events
            </button>
            <button onClick={() => navigate('/bookings')} className="px-3 py-2 text-gray-700 hover:text-blue-600 font-medium transition-colors">
              Book Table
            </button>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {isAuthenticated ? (
              <>
                <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-blue-50 to-purple-50 rounded-full">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-gray-700">
                    {user?.name}
                  </span>
                </div>
                <Button 
                  variant="ghost" 
                  onClick={() => navigate('/dashboard')}
                  className="hover:bg-purple-50 hidden lg:flex"
                  size="sm"
                >
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  Dashboard
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleLogout}
                  className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 hidden lg:flex"
                  size="sm"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </>
            ) : (
              <Button 
                onClick={() => navigate('/login')}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-md hidden sm:flex"
                size="sm"
              >
                <Sparkles className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Admin Login</span>
              </Button>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6 text-gray-700" />
              ) : (
                <Menu className="h-6 w-6 text-gray-700" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 py-4 bg-white/95 backdrop-blur-md animate-in slide-in-from-top-2 duration-200">
            <div className="flex flex-col space-y-2">
              {/* Mobile Navigation Links */}
              <button
                onClick={() => handleNavigation('/')}
                className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-blue-600 font-medium transition-colors rounded-lg"
              >
                <Home className="h-5 w-5" />
                Home
              </button>
              <button
                onClick={() => handleNavigation('/events')}
                className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-blue-600 font-medium transition-colors rounded-lg"
              >
                <Calendar className="h-5 w-5" />
                Events
              </button>
              <button
                onClick={() => handleNavigation('/bookings')}
                className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-blue-600 font-medium transition-colors rounded-lg"
              >
                <Utensils className="h-5 w-5" />
                Book Table
              </button>

              {/* Mobile Auth Section */}
              <div className="border-t border-gray-200 pt-3 mt-2">
                {isAuthenticated ? (
                  <>
                    <div className="flex items-center gap-2 px-4 py-2 mb-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg mx-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-sm font-medium text-gray-700">
                        {user?.name}
                      </span>
                    </div>
                    <button
                      onClick={() => handleNavigation('/dashboard')}
                      className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-purple-50 hover:text-purple-600 font-medium transition-colors rounded-lg w-full"
                    >
                      <LayoutDashboard className="h-5 w-5" />
                      Dashboard
                    </button>
                    <button
                      onClick={() => {
                        handleLogout();
                        setMobileMenuOpen(false);
                      }}
                      className="flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 font-medium transition-colors rounded-lg w-full"
                    >
                      <LogOut className="h-5 w-5" />
                      Logout
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => handleNavigation('/login')}
                    className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 font-medium transition-colors rounded-lg w-full shadow-lg"
                  >
                    <Sparkles className="h-5 w-5" />
                    Admin Login
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
