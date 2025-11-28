import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useSettings } from '@/context/SettingsContext';
import { Button } from '@/components/ui/button';
import { LogOut, Sparkles, LayoutDashboard, Home, Utensils, Calendar } from 'lucide-react';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { settings } = useSettings();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-14 sm:h-16">
          <Link to="/" className="flex items-center gap-2 group">
            {settings.logo ? (
              <img 
                src={settings.logo} 
                alt={settings.businessName} 
                className="h-8 sm:h-10 w-auto object-contain"
              />
            ) : (
              <>
                <div 
                  className="p-1.5 sm:p-2 rounded-lg group-hover:shadow-lg transition-shadow"
                  style={{ 
                    background: `linear-gradient(to right, var(--color-primary), var(--color-secondary))` 
                  }}
                >
                  <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                </div>
                <span 
                  className="text-lg sm:text-2xl font-bold bg-clip-text text-transparent"
                  style={{ 
                    backgroundImage: `linear-gradient(to right, var(--color-primary), var(--color-secondary))` 
                  }}
                >
                  {settings.businessName}
                </span>
              </>
            )}
          </Link>

          <div className="flex items-center gap-1.5 sm:gap-3">
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
                  onClick={() => navigate('/')}
                  className="hover:bg-blue-50 hidden sm:flex text-sm sm:text-base px-2 sm:px-4"
                  size="sm"
                >
                  <Home className="sm:mr-2 h-4 w-4" />
                  <span className="hidden sm:inline">Home</span>
                </Button>
                <Button 
                  variant="ghost" 
                  onClick={() => navigate('/events')}
                  className="hover:bg-purple-50 text-sm sm:text-base px-2 sm:px-4"
                  size="sm"
                >
                  <Calendar className="sm:mr-2 h-4 w-4" />
                  <span className="hidden sm:inline">Events</span>
                </Button>
                <Button 
                  variant="ghost" 
                  onClick={() => navigate('/bookings')}
                  className="hover:bg-green-50 text-sm sm:text-base px-2 sm:px-4"
                  size="sm"
                >
                  <Utensils className="sm:mr-2 h-4 w-4" />
                  <span className="hidden sm:inline">Book Table</span>
                </Button>
                <Button 
                  variant="ghost" 
                  onClick={() => navigate('/dashboard')}
                  className="hover:bg-purple-50 text-sm sm:text-base px-2 sm:px-4"
                  size="sm"
                >
                  <LayoutDashboard className="sm:mr-2 h-4 w-4" />
                  <span className="hidden sm:inline">Dashboard</span>
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleLogout}
                  className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 text-sm sm:text-base px-2 sm:px-4"
                  size="sm"
                >
                  <LogOut className="sm:mr-2 h-4 w-4" />
                  <span className="hidden sm:inline">Logout</span>
                </Button>
              </>
            ) : (
              <>
                <Button 
                  variant="ghost" 
                  onClick={() => navigate('/')}
                  className="hover:bg-blue-50 hidden sm:flex text-sm sm:text-base px-2 sm:px-4"
                  size="sm"
                >
                  <Home className="sm:mr-2 h-4 w-4" />
                  <span className="hidden sm:inline">Home</span>
                </Button>
                <Button 
                  variant="ghost" 
                  onClick={() => navigate('/events')}
                  className="hover:bg-purple-50 text-sm sm:text-base px-2 sm:px-4"
                  size="sm"
                >
                  <Calendar className="sm:mr-2 h-4 w-4" />
                  <span className="hidden sm:inline">Events</span>
                </Button>
                <Button 
                  variant="ghost" 
                  onClick={() => navigate('/bookings')}
                  className="hover:bg-green-50 text-sm sm:text-base px-2 sm:px-4"
                  size="sm"
                >
                  <Utensils className="sm:mr-2 h-4 w-4" />
                  <span className="hidden sm:inline">Book Table</span>
                </Button>
                <Button 
                  onClick={() => navigate('/login')}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-md text-sm sm:text-base px-4 sm:px-6"
                  size="sm"
                >
                  <Sparkles className="sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                  <span>Admin Login</span>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
