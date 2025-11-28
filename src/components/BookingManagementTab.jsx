// 🆕 NEW FILE - BOOKING SYSTEM
// This component can be removed if booking system is not needed

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Edit2, Trash2, Eye, Clock, Utensils, Calendar, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import config from '@/config/config';

const BookingManagementTab = () => {
  const [venues, setVenues] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();
  const navigate = useNavigate();

  const API_URL = config.apiUrl;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [venuesRes, bookingsRes] = await Promise.all([
        axios.get(`${API_URL}/booking-venues`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${API_URL}/bookings/admin/all`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);
      
      setVenues(venuesRes.data.venues);
      setBookings(bookingsRes.data.bookings);
    } catch (error) {
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteVenue = async (venueId) => {
    if (!window.confirm('Are you sure? This will delete all bookings for this venue.')) {
      return;
    }

    try {
      await axios.delete(`${API_URL}/booking-venues/${venueId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Venue deleted successfully');
      fetchData();
    } catch (error) {
      toast.error('Failed to delete venue');
    }
  };

  const handleConfirmBooking = async (bookingId) => {
    try {
      await axios.put(`${API_URL}/bookings/admin/${bookingId}/confirm`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Booking confirmed!');
      fetchData();
    } catch (error) {
      toast.error('Failed to confirm booking');
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Cancel this booking?')) return;

    try {
      await axios.put(`${API_URL}/bookings/admin/${bookingId}/cancel`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Booking cancelled');
      fetchData();
    } catch (error) {
      toast.error('Failed to cancel booking');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const pendingBookings = bookings.filter(b => b.status === 'pending');
  const confirmedBookings = bookings.filter(b => b.status === 'confirmed');

  if (loading) {
    return (
      <Card className="border-0 shadow-xl">
        <CardContent className="py-20">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-purple-600 border-t-transparent mb-4"></div>
            <p className="text-gray-600 text-lg">Loading bookings...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600 mb-1">Total Venues</p>
                <p className="text-4xl font-bold text-blue-900">{venues.length}</p>
              </div>
              <div className="p-4 bg-blue-500 rounded-2xl">
                <Utensils className="h-8 w-8 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-orange-100">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600 mb-1">Pending</p>
                <p className="text-4xl font-bold text-orange-900">{pendingBookings.length}</p>
              </div>
              <div className="p-4 bg-orange-500 rounded-2xl">
                <AlertCircle className="h-8 w-8 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600 mb-1">Confirmed</p>
                <p className="text-4xl font-bold text-green-900">{confirmedBookings.length}</p>
              </div>
              <div className="p-4 bg-green-500 rounded-2xl">
                <CheckCircle2 className="h-8 w-8 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600 mb-1">Total</p>
                <p className="text-4xl font-bold text-purple-900">{bookings.length}</p>
              </div>
              <div className="p-4 bg-purple-500 rounded-2xl">
                <Calendar className="h-8 w-8 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Venues Section */}
      <Card className="border-0 shadow-xl">
        <CardHeader className="border-b bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Utensils className="h-6 w-6 text-purple-600" />
                Booking Venues
              </CardTitle>
              <CardDescription className="text-base">
                Manage your restaurant/venue booking options
              </CardDescription>
            </div>
            <Button
              onClick={() => navigate('/dashboard/bookings/create-venue')}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <Plus className="mr-2 h-4 w-4" />
              Create Venue
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          {venues.length === 0 ? (
            <div className="text-center py-12">
              <div className="inline-flex p-6 bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl mb-6">
                <Utensils className="h-16 w-16 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">No Venues Yet</h3>
              <p className="text-gray-600 mb-6">Create your first booking venue to start accepting table reservations.</p>
              <Button
                onClick={() => navigate('/dashboard/bookings/create-venue')}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <Plus className="mr-2 h-4 w-4" />
                Create First Venue
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {venues.map((venue) => (
                <Card key={venue._id} className="border-2 hover:border-purple-300 transition-colors">
                  <CardHeader>
                    <CardTitle className="text-lg">{venue.name}</CardTitle>
                    <CardDescription>
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                        {venue.venueType}
                      </span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 mb-4">
                      <p className="text-sm text-gray-600">
                        <span className="font-semibold">{venue.tables.length}</span> tables
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-semibold">{venue.timeSlots.length}</span> time slots
                      </p>
                      <span
                        className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-bold ${
                          venue.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        <div className={`w-2 h-2 rounded-full ${venue.isActive ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`}></div>
                        {venue.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/dashboard/bookings/venue/${venue._id}`)}
                        className="flex-1 border-purple-300 text-purple-600 hover:bg-purple-50"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/dashboard/bookings/edit-venue/${venue._id}`)}
                        className="border-blue-300 text-blue-600 hover:bg-blue-50"
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteVenue(venue._id)}
                        className="border-red-300 text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Bookings */}
      {bookings.length > 0 && (
        <Card className="border-0 shadow-xl">
          <CardHeader className="border-b bg-gradient-to-r from-blue-50 to-purple-50">
            <CardTitle className="text-2xl flex items-center gap-2">
              <Calendar className="h-6 w-6 text-purple-600" />
              Recent Bookings
            </CardTitle>
            <CardDescription className="text-base">
              Manage and confirm table reservations
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="overflow-x-auto -mx-6 sm:mx-0">
              <div className="inline-block min-w-full align-middle">
                <div className="overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50">
                        <TableHead className="font-bold text-xs sm:text-sm whitespace-nowrap">Guest</TableHead>
                        <TableHead className="font-bold text-xs sm:text-sm whitespace-nowrap">Venue</TableHead>
                        <TableHead className="font-bold text-xs sm:text-sm whitespace-nowrap hidden sm:table-cell">Table</TableHead>
                        <TableHead className="font-bold text-xs sm:text-sm whitespace-nowrap">Date & Time</TableHead>
                        <TableHead className="font-bold text-xs sm:text-sm whitespace-nowrap hidden md:table-cell">Status</TableHead>
                        <TableHead className="font-bold text-xs sm:text-sm text-right whitespace-nowrap">Actions</TableHead>
                      </TableRow>
              </TableHeader>
              <TableBody>
                {bookings.slice(0, 10).map((booking) => (
                  <TableRow key={booking._id} className="hover:bg-blue-50/50">
                    <TableCell className="text-xs sm:text-sm">
                      <div>
                        <p className="font-semibold">{booking.guestName}</p>
                        <p className="text-xs text-gray-500 truncate max-w-[150px]">{booking.guestEmail}</p>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium text-xs sm:text-sm">{booking.venue?.name}</TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium whitespace-nowrap">
                        Table {booking.tableNumber}
                      </span>
                    </TableCell>
                    <TableCell className="text-xs sm:text-sm">
                      <div>
                        <p className="font-medium whitespace-nowrap">{formatDate(booking.date)}</p>
                        <p className="text-xs text-gray-500 whitespace-nowrap">{booking.timeSlot?.startTime} - {booking.timeSlot?.endTime}</p>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-bold whitespace-nowrap ${
                          booking.status === 'confirmed'
                            ? 'bg-green-100 text-green-800'
                            : booking.status === 'pending'
                            ? 'bg-orange-100 text-orange-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {booking.status === 'confirmed' && <CheckCircle2 className="h-3 w-3" />}
                        {booking.status === 'pending' && <Clock className="h-3 w-3" />}
                        {booking.status === 'cancelled' && <XCircle className="h-3 w-3" />}
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1 sm:gap-2 justify-end">
                        {booking.status === 'pending' && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleConfirmBooking(booking._id)}
                              className="border-green-300 text-green-600 hover:bg-green-50 p-2"
                            >
                              <CheckCircle2 className="h-3 w-3 sm:h-4 sm:w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleCancelBooking(booking._id)}
                              className="border-red-300 text-red-600 hover:bg-red-50 p-2"
                            >
                              <XCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BookingManagementTab;
