// 🆕 NEW FILE - BOOKING SYSTEM
// This file can be deleted if booking system is not needed

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, Edit2, Users, Clock, Calendar, CheckCircle2, XCircle, AlertCircle, Copy, ExternalLink, QrCode, Download } from 'lucide-react';
import config from '@/config/config';

const VenueDetailsPage = () => {
  const { venueId } = useParams();
  const [venue, setVenue] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();
  const navigate = useNavigate();

  const API_URL = config.apiUrl;
  const PUBLIC_URL = config.publicUrl;

  useEffect(() => {
    fetchVenueDetails();
  }, []);

  const fetchVenueDetails = async () => {
    try {
      const [venueRes, bookingsRes] = await Promise.all([
        axios.get(`${API_URL}/booking-venues/${venueId}`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${API_URL}/booking-venues/${venueId}/bookings`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      setVenue(venueRes.data.venue);
      setBookings(bookingsRes.data.bookings);
    } catch (error) {
      toast.error('Failed to load venue details');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmBooking = async (bookingId) => {
    try {
      await axios.put(`${API_URL}/bookings/admin/${bookingId}/confirm`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Booking confirmed!');
      fetchVenueDetails();
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
      fetchVenueDetails();
    } catch (error) {
      toast.error('Failed to cancel booking');
    }
  };

  const copyPublicLink = () => {
    const link = `${PUBLIC_URL}/booking/${venueId}`;
    navigator.clipboard.writeText(link);
    toast.success('Link copied to clipboard!');
  };

  const openPublicLink = () => {
    const link = `${PUBLIC_URL}/booking/${venueId}`;
    window.open(link, '_blank');
  };

  const generateQRCode = async () => {
    try {
      const response = await axios.get(`${API_URL}/booking-venues/${venueId}/qrcode`);
      
      // Create a new window and display the QR code
      const qrWindow = window.open('', '_blank');
      qrWindow.document.write(`
        <html>
          <head>
            <title>QR Code - ${venue.name}</title>
            <style>
              body {
                margin: 0;
                padding: 20px;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                min-height: 100vh;
                font-family: system-ui, -apple-system, sans-serif;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              }
              .container {
                background: white;
                padding: 40px;
                border-radius: 20px;
                box-shadow: 0 20px 60px rgba(0,0,0,0.3);
                text-align: center;
              }
              h1 {
                color: #333;
                margin-bottom: 10px;
              }
              p {
                color: #666;
                margin-bottom: 30px;
              }
              img {
                border: 2px solid #667eea;
                border-radius: 10px;
                padding: 10px;
                background: white;
              }
              .url {
                margin-top: 20px;
                padding: 10px;
                background: #f3f4f6;
                border-radius: 8px;
                word-break: break-all;
                font-size: 14px;
                color: #667eea;
              }
              button {
                margin-top: 20px;
                padding: 12px 24px;
                background: #667eea;
                color: white;
                border: none;
                border-radius: 8px;
                cursor: pointer;
                font-size: 16px;
              }
              button:hover {
                background: #5568d3;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>${venue.name}</h1>
              <p>Scan this QR code to book a table</p>
              <img src="${response.data.qrCode}" alt="QR Code" />
              <div class="url">${response.data.url}</div>
              <button onclick="window.print()">Print QR Code</button>
            </div>
          </body>
        </html>
      `);
      qrWindow.document.close();
    } catch (error) {
      toast.error('Failed to generate QR code');
      console.error('QR generation error:', error);
    }
  };

  const downloadCSV = () => {
    if (bookings.length === 0) {
      toast.error('No bookings to export');
      return;
    }

    // Create CSV content
    const headers = ['Date', 'Time Slot', 'Table', 'Guest Name', 'Email', 'Phone', 'Guests', 'Status', 'Special Requests'];
    const rows = bookings.map(booking => [
      formatDate(booking.date),
      `${booking.timeSlot?.startTime} - ${booking.timeSlot?.endTime}`,
      booking.tableNumber,
      booking.guestName,
      booking.guestEmail,
      booking.guestPhone,
      booking.numberOfGuests,
      booking.status,
      booking.specialRequests || ''
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    // Download file
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${venue.name}_bookings_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    toast.success('CSV downloaded successfully!');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-purple-600 border-t-transparent mb-4"></div>
          <p className="text-gray-600 text-lg">Loading venue details...</p>
        </div>
      </div>
    );
  }

  if (!venue) {
    return null;
  }

  const pendingBookings = bookings.filter(b => b.status === 'pending');
  const confirmedBookings = bookings.filter(b => b.status === 'confirmed');
  const upcomingBookings = bookings.filter(b => new Date(b.date) >= new Date() && b.status !== 'cancelled');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-12 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="outline"
            onClick={() => navigate('/dashboard')}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full mb-3">
                <span className="text-sm font-semibold text-purple-900">{venue.venueType}</span>
              </div>
              <h1 className="text-4xl font-extrabold text-gray-900 mb-2">{venue.name}</h1>
              {venue.description && (
                <p className="text-lg text-gray-600">{venue.description}</p>
              )}
            </div>
            <Button
              onClick={() => navigate(`/dashboard/bookings/edit-venue/${venueId}`)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <Edit2 className="mr-2 h-4 w-4" />
              Edit Venue
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600 mb-1">Tables</p>
                  <p className="text-4xl font-bold text-blue-900">{venue.tables.length}</p>
                </div>
                <div className="p-4 bg-blue-500 rounded-2xl">
                  <Users className="h-8 w-8 text-white" />
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
                  <p className="text-sm font-medium text-purple-600 mb-1">Upcoming</p>
                  <p className="text-4xl font-bold text-purple-900">{upcomingBookings.length}</p>
                </div>
                <div className="p-4 bg-purple-500 rounded-2xl">
                  <Calendar className="h-8 w-8 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Public Link */}
        <Card className="border-0 shadow-xl mb-8">
          <CardHeader className="border-b bg-gradient-to-r from-blue-50 to-purple-50">
            <CardTitle>Public Booking Link</CardTitle>
            <CardDescription>Share this link with customers to accept bookings</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg font-mono text-sm break-all">
                  {PUBLIC_URL}/booking/{venueId}
                </div>
                <div className="flex gap-2">
                  <Button onClick={copyPublicLink} variant="outline">
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </Button>
                  <Button onClick={openPublicLink} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Open
                  </Button>
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={generateQRCode} variant="outline" className="flex-1 border-green-300 text-green-600 hover:bg-green-50">
                  <QrCode className="h-4 w-4 mr-2" />
                  Generate QR Code
                </Button>
                <Button onClick={downloadCSV} variant="outline" className="flex-1 border-purple-300 text-purple-600 hover:bg-purple-50">
                  <Download className="h-4 w-4 mr-2" />
                  Export CSV
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Tables */}
          <Card className="border-0 shadow-xl">
            <CardHeader className="border-b bg-gradient-to-r from-blue-50 to-purple-50">
              <CardTitle>Tables ({venue.tables.length})</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-3">
                {venue.tables.map((table, index) => (
                  <div key={index} className="p-4 border-2 rounded-lg hover:border-purple-300 transition-colors">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-semibold text-lg">Table {table.tableNumber}</p>
                        <p className="text-sm text-gray-600 flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          Capacity: {table.capacity} guests
                        </p>
                      </div>
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                        {table.shape}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Time Slots */}
          <Card className="border-0 shadow-xl">
            <CardHeader className="border-b bg-gradient-to-r from-blue-50 to-purple-50">
              <CardTitle>Time Slots ({venue.timeSlots.length})</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-3">
                {venue.timeSlots.map((slot, index) => (
                  <div key={index} className="p-4 border-2 rounded-lg hover:border-purple-300 transition-colors">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-semibold text-lg">{slot.name}</p>
                        <p className="text-sm text-gray-600 flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {slot.startTime} - {slot.endTime}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bookings */}
        <Card className="border-0 shadow-xl">
          <CardHeader className="border-b bg-gradient-to-r from-blue-50 to-purple-50">
            <CardTitle>All Bookings ({bookings.length})</CardTitle>
            <CardDescription>Manage reservations for this venue</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            {bookings.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Calendar className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <p>No bookings yet for this venue.</p>
                <p className="text-sm">Share the public link to start accepting reservations.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="font-bold">Guest</TableHead>
                      <TableHead className="font-bold">Table</TableHead>
                      <TableHead className="font-bold">Date & Time</TableHead>
                      <TableHead className="font-bold">Guests</TableHead>
                      <TableHead className="font-bold">Status</TableHead>
                      <TableHead className="font-bold text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bookings.map((booking) => (
                      <TableRow key={booking._id} className="hover:bg-blue-50/50">
                        <TableCell>
                          <div>
                            <p className="font-semibold">{booking.guestName}</p>
                            <p className="text-xs text-gray-500">{booking.guestEmail}</p>
                            <p className="text-xs text-gray-500">{booking.guestPhone}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                            Table {booking.tableNumber}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{formatDate(booking.date)}</p>
                            <p className="text-xs text-gray-500">{booking.timeSlot?.startTime} - {booking.timeSlot?.endTime}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="flex items-center gap-1">
                            <Users className="h-4 w-4 text-gray-500" />
                            {booking.numberOfGuests}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-bold ${
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
                          <div className="flex gap-1 justify-end">
                            {booking.status === 'pending' && (
                              <>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleConfirmBooking(booking._id)}
                                  className="border-green-300 text-green-600 hover:bg-green-50"
                                >
                                  <CheckCircle2 className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleCancelBooking(booking._id)}
                                  className="border-red-300 text-red-600 hover:bg-red-50"
                                >
                                  <XCircle className="h-4 w-4" />
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
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VenueDetailsPage;
