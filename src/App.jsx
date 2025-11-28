import { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useSettings } from '@/context/SettingsContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './layouts/DashboardLayout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SetupPage from './pages/SetupPage';
import DashboardOverviewPage from './pages/DashboardOverviewPage';
import PollsManagementPage from './pages/PollsManagementPage';
import BookingsManagementPage from './pages/BookingsManagementPage';
import CreatePollPage from './pages/CreatePollPage';
import EditPollPage from './pages/EditPollPage';
import ResultsPage from './pages/ResultsPage';
import PublicPollPage from './pages/PublicPollPage';
import PublicEventsPage from './pages/PublicEventsPage';
import AppearanceSettingsPage from './pages/AppearanceSettingsPage';
import AccountSettingsPage from './pages/AccountSettingsPage';
import CreateBookingVenuePage from './pages/CreateBookingVenuePage';
import PublicBookingPage from './pages/PublicBookingPage';
import VenueDetailsPage from './pages/VenueDetailsPage';
import PublicBookingMenuPage from './pages/PublicBookingMenuPage';
import EditBookingVenuePage from './pages/EditBookingVenuePage';

function App() {
  const location = useLocation();
  const isDashboard = location.pathname.startsWith('/dashboard');
  const { settings, loading } = useSettings();

  // Get initials from business name
  const getInitials = (name) => {
    if (!name) return 'EP';
    const words = name.trim().split(' ');
    if (words.length === 1) {
      return words[0].charAt(0).toUpperCase();
    }
    return words.map(word => word.charAt(0).toUpperCase()).slice(0, 2).join('');
  };

  // Generate favicon from initials
  const generateFaviconFromInitials = (initials, primaryColor = '#7c3aed') => {
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    
    // Create gradient background
    const gradient = ctx.createLinearGradient(0, 0, 32, 32);
    gradient.addColorStop(0, primaryColor);
    gradient.addColorStop(1, '#3b82f6');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 32, 32);
    
    // Add text
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(initials, 16, 16);
    
    return canvas.toDataURL('image/png');
  };

  // Update favicon dynamically when settings change
  useEffect(() => {
    // Remove existing favicon links
    const existingLinks = document.querySelectorAll("link[rel*='icon']");
    existingLinks.forEach(link => link.remove());

    let faviconUrl;
    
    if (settings.favicon) {
      faviconUrl = settings.favicon;
    } else {
      // Generate favicon from initials
      const initials = getInitials(settings.businessName);
      faviconUrl = generateFaviconFromInitials(initials);
    }

    // Create and add new favicon link
    const link = document.createElement('link');
    link.rel = 'icon';
    link.type = 'image/png';
    link.href = faviconUrl;
    document.head.appendChild(link);
  }, [settings.favicon, settings.businessName]);

  // Update page title dynamically
  useEffect(() => {
    if (settings.metaTitle) {
      document.title = settings.metaTitle;
    } else if (settings.businessName) {
      document.title = `${settings.businessName} - Event Management & Booking`;
    }
  }, [settings.metaTitle, settings.businessName]);

  // Show loading screen while settings are loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="text-center">
          <div className="relative">
            <div className="h-20 w-20 mx-auto mb-4">
              <div className="absolute inset-0 rounded-full border-4 border-gray-200"></div>
              <div className="absolute inset-0 rounded-full border-4 border-t-blue-600 border-r-purple-600 animate-spin"></div>
            </div>
          </div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Loading...</h2>
          <p className="text-gray-500 text-sm">Preparing your experience</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Show Navbar only on non-dashboard pages */}
      {!isDashboard && <Navbar />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/setup" element={<SetupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/poll/:pollId" element={<PublicPollPage />} />
        <Route path="/events" element={<PublicEventsPage />} />
        <Route path="/bookings" element={<PublicBookingMenuPage />} />
        <Route path="/booking/:venueId" element={<PublicBookingPage />} />
        
        {/* Dashboard with Layout */}
        <Route
          path="/dashboard/*"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Routes>
                  <Route index element={<DashboardOverviewPage />} />
                  <Route path="polls" element={<PollsManagementPage />} />
                  <Route path="create" element={<CreatePollPage />} />
                  <Route path="edit/:pollId" element={<EditPollPage />} />
                  <Route path="results/:pollId" element={<ResultsPage />} />
                  <Route path="appearance" element={<AppearanceSettingsPage />} />
                  <Route path="account" element={<AccountSettingsPage />} />
                  <Route path="bookings" element={<BookingsManagementPage />} />
                  <Route path="bookings/create-venue" element={<CreateBookingVenuePage />} />
                  <Route path="bookings/venue/:venueId" element={<VenueDetailsPage />} />
                  <Route path="bookings/edit-venue/:venueId" element={<EditBookingVenuePage />} />
                </Routes>
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      
      {/* Show Footer only on non-dashboard pages */}
      {!isDashboard && <Footer />}
      
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
    </>
  );
}

export default App;
