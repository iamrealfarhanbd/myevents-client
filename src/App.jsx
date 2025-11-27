import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import CreatePollPage from './pages/CreatePollPage';
import EditPollPage from './pages/EditPollPage';
import ResultsPage from './pages/ResultsPage';
import PublicPollPage from './pages/PublicPollPage';
import PublicEventsPage from './pages/PublicEventsPage'; // 🆕 PUBLIC EVENTS PAGE
// 🆕 BOOKING SYSTEM IMPORTS - Can be removed if system not needed
import CreateBookingVenuePage from './pages/CreateBookingVenuePage';
import PublicBookingPage from './pages/PublicBookingPage';
import VenueDetailsPage from './pages/VenueDetailsPage';
import PublicBookingMenuPage from './pages/PublicBookingMenuPage';
import EditBookingVenuePage from './pages/EditBookingVenuePage';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/poll/:pollId" element={<PublicPollPage />} />
        <Route path="/events" element={<PublicEventsPage />} /> {/* 🆕 PUBLIC EVENTS PAGE */}
        {/* 🆕 BOOKING SYSTEM ROUTES - Can be removed if system not needed */}
        <Route path="/bookings" element={<PublicBookingMenuPage />} />
        <Route path="/booking/:venueId" element={<PublicBookingPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/create"
          element={
            <ProtectedRoute>
              <CreatePollPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/edit/:pollId"
          element={
            <ProtectedRoute>
              <EditPollPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/results/:pollId"
          element={
            <ProtectedRoute>
              <ResultsPage />
            </ProtectedRoute>
          }
        />
        {/* 🆕 BOOKING SYSTEM ROUTES - Can be removed if system not needed */}
        <Route
          path="/dashboard/bookings/create-venue"
          element={
            <ProtectedRoute>
              <CreateBookingVenuePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/bookings/venue/:venueId"
          element={
            <ProtectedRoute>
              <VenueDetailsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/bookings/edit-venue/:venueId"
          element={
            <ProtectedRoute>
              <EditBookingVenuePage />
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
