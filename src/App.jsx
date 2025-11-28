import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
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
