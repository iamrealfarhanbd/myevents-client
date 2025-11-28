import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useSettings } from '@/context/SettingsContext';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  BarChart3, 
  Users, 
  Calendar, 
  TrendingUp, 
  Plus, 
  ArrowRight,
  Clock,
  CheckCircle,
  XCircle,
  Sparkles,
  Utensils,
  Activity,
  Eye,
  MessageSquare,
  CalendarCheck
} from 'lucide-react';
import config from '@/config/config';

const DashboardOverviewPage = () => {
  const [pollStats, setPollStats] = useState({
    total: 0,
    active: 0,
    expired: 0,
    responses: 0
  });
  
  const [bookingStats, setBookingStats] = useState({
    totalVenues: 0,
    totalBookings: 0,
    pendingBookings: 0,
    todayBookings: 0
  });

  const [recentPolls, setRecentPolls] = useState([]);
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token, user } = useAuth();
  const { settings } = useSettings();
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch polls data
      const pollsResponse = await axios.get(`${config.apiUrl}/polls`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const polls = pollsResponse.data.polls;
      const now = new Date();
      
      const activePolls = polls.filter(p => new Date(p.expireAt) > now);
      const expiredPolls = polls.filter(p => new Date(p.expireAt) <= now);
      const totalResponses = polls.reduce((sum, p) => {
        const responses = p.responses?.length || 0;
        return sum + responses;
      }, 0);

      setPollStats({
        total: polls.length,
        active: activePolls.length,
        expired: expiredPolls.length,
        responses: totalResponses
      });

      setRecentPolls(polls.slice(0, 4).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));

      // Fetch venues and bookings data
      try {
        const venuesResponse = await axios.get(`${config.apiUrl}/booking-venues`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const venues = venuesResponse.data.venues || [];
        
        // Fetch bookings from all venues
        let allBookings = [];
        const today = new Date().toDateString();
        
        for (const venue of venues) {
          try {
            const bookingsResponse = await axios.get(
              `${config.apiUrl}/bookings/venue/${venue._id}`,
              { headers: { Authorization: `Bearer ${token}` } }
            );
            allBookings = [...allBookings, ...(bookingsResponse.data.bookings || [])];
          } catch (err) {
            // Failed to fetch bookings for this venue
          }
        }

        const pendingBookings = allBookings.filter(b => b.status === 'pending');
        
        // Better date comparison - normalize to midnight UTC
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);
        const todayEnd = new Date();
        todayEnd.setHours(23, 59, 59, 999);
        
        const todayBookings = allBookings.filter(b => {
          const bookingDate = new Date(b.date);
          return bookingDate >= todayStart && bookingDate <= todayEnd;
        });

        setBookingStats({
          totalVenues: venues.length,
          totalBookings: allBookings.length,
          pendingBookings: pendingBookings.length,
          todayBookings: todayBookings.length
        });

        setRecentBookings(allBookings.slice(0, 4).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
      } catch (error) {
        // Failed to fetch booking data
      }
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Compact Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-xl p-5 text-white shadow-lg">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-1">
              Welcome back, {user?.name}! 👋
            </h1>
            <p className="text-white/90 text-sm">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => navigate('/dashboard/create')}
              size="sm"
              className="bg-white text-blue-600 hover:bg-white/90 font-medium shadow-md"
            >
              <Plus className="h-4 w-4 mr-1" />
              New Event
            </Button>
            <Button
              onClick={() => navigate('/dashboard/bookings/create-venue')}
              size="sm"
              className="bg-white text-purple-600 hover:bg-white/90 font-medium shadow-md"
            >
              <Plus className="h-4 w-4 mr-1" />
              New Venue
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Overview - Polls & Bookings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Polls Section */}
        <Card className="border-2 border-dashed border-blue-200 hover:border-blue-400 bg-white hover:shadow-lg transition-all">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg">
                  <BarChart3 className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Event Polls</h3>
                  <p className="text-xs text-gray-500">Voting & Feedback</p>
                </div>
              </div>
              <Button
                size="sm"
                onClick={() => navigate('/dashboard/polls')}
                variant="ghost"
                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
              >
                View All
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
            
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{pollStats.total}</div>
                <div className="text-xs text-gray-600 mt-1">Total</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{pollStats.active}</div>
                <div className="text-xs text-gray-600 mt-1">Active</div>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{pollStats.responses}</div>
                <div className="text-xs text-gray-600 mt-1">Responses</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bookings Section */}
        <Card className="border-2 border-dashed border-purple-200 hover:border-purple-400 bg-white hover:shadow-lg transition-all">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg">
                  <Utensils className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Table Bookings</h3>
                  <p className="text-xs text-gray-500">Reservations & Venues</p>
                </div>
              </div>
              <Button
                size="sm"
                onClick={() => navigate('/dashboard/bookings')}
                variant="ghost"
                className="text-purple-600 hover:text-purple-700 hover:bg-purple-50"
              >
                View All
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
            
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{bookingStats.totalVenues}</div>
                <div className="text-xs text-gray-600 mt-1">Venues</div>
              </div>
              <div className="text-center p-3 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">{bookingStats.totalBookings}</div>
                <div className="text-xs text-gray-600 mt-1">Bookings</div>
              </div>
              <div className="text-center p-3 bg-emerald-50 rounded-lg">
                <div className="text-2xl font-bold text-emerald-600">{bookingStats.todayBookings}</div>
                <div className="text-xs text-gray-600 mt-1">Today</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity - Always Show */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:items-start">
        {/* Recent Polls */}
        <Card className="border-2 border-dashed border-blue-100 hover:border-blue-300 bg-white self-start">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-blue-600" />
                Recent Polls
              </h3>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => navigate('/dashboard/polls')}
                    className="h-7 text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                  >
                    View All
                  </Button>
                </div>
                {recentPolls.length === 0 ? (
                  <div className="text-center py-4">
                    <BarChart3 className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                    <p className="text-xs text-gray-500">No polls yet</p>
                  </div>
                ) : (
                  <div className="space-y-2 mt-3">
                    {recentPolls.slice(0, 3).map((poll) => {
                      const isExpired = new Date(poll.expireAt) < new Date();
                      return (
                        <div
                          key={poll._id}
                          className="p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50/30 cursor-pointer transition-all group"
                          onClick={() => navigate(`/dashboard/results/${poll._id}`)}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate group-hover:text-blue-600">
                                {poll.title}
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-xs text-gray-500">{poll.responses?.length || 0} votes</span>
                                <span className={`text-xs px-1.5 py-0.5 rounded ${isExpired ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                                  {isExpired ? 'Expired' : 'Active'}
                                </span>
                              </div>
                            </div>
                            <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-blue-600 flex-shrink-0" />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>

        {/* Recent Bookings */}
        <Card className="border-2 border-dashed border-purple-100 hover:border-purple-300 bg-white self-start">
          <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-purple-600" />
                    Recent Bookings
                  </h3>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => navigate('/dashboard/bookings')}
                    className="h-7 text-xs text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                  >
                    View All
                  </Button>
                </div>
                {recentBookings.length === 0 ? (
                  <div className="text-center py-4">
                    <Calendar className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                    <p className="text-xs text-gray-500">No bookings yet</p>
                  </div>
                ) : (
                  <div className="space-y-2 mt-3">
                    {recentBookings.slice(0, 3).map((booking, index) => (
                      <div
                        key={index}
                        className="p-3 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50/30 cursor-pointer transition-all group"
                        onClick={() => navigate('/dashboard/bookings')}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate group-hover:text-purple-600">
                              {booking.guestName}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs text-gray-500">{booking.numberOfGuests} guests</span>
                              <span className={`text-xs px-1.5 py-0.5 rounded ${
                                booking.status === 'confirmed' ? 'bg-green-100 text-green-600' :
                                booking.status === 'pending' ? 'bg-yellow-100 text-yellow-600' :
                                'bg-gray-100 text-gray-600'
                              }`}>
                                {booking.status}
                              </span>
                            </div>
                          </div>
                          <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-purple-600 flex-shrink-0" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      );
    };

export default DashboardOverviewPage;
