// 🆕 NEW FILE - BOOKING SYSTEM
// This file can be deleted if booking system is not needed

import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Calendar as CalendarIcon, Clock, Users, Utensils, CheckCircle2 } from 'lucide-react';
import config from '@/config/config';

const PublicBookingPage = () => {
  const { venueId } = useParams();
  const [venue, setVenue] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [selectedTables, setSelectedTables] = useState([]); // Changed to array for multiple tables
  const [bookedSlots, setBookedSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const [formData, setFormData] = useState({
    guestName: '',
    guestEmail: '',
    guestPhone: '',
    numberOfGuests: 1,
    specialRequests: ''
  });

  const API_URL = config.apiUrl;

  useEffect(() => {
    // Load venue info on mount
    fetchVenueInfo();
  }, []);

  useEffect(() => {
    // Load availability when date is selected
    if (selectedDate && venue) {
      fetchAvailability();
    }
  }, [selectedDate]);

  const fetchVenueInfo = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/bookings/public/${venueId}/availability?date=${new Date().toISOString()}`
      );
      setVenue(response.data.venue);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to load venue information');
      setLoading(false);
    }
  };

  const fetchAvailability = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/bookings/public/${venueId}/availability?date=${selectedDate.toISOString()}`
      );
      console.log('📅 Fetched bookings for date:', selectedDate.toLocaleDateString());
      console.log('Total bookings:', response.data.bookings.length);
      response.data.bookings.forEach((booking, index) => {
        console.log(`Booking ${index + 1}:`, {
          table: booking.tableNumber,
          time: `${booking.timeSlot?.startTime} - ${booking.timeSlot?.endTime}`,
          status: booking.status
        });
      });
      setBookedSlots(response.data.bookings);
    } catch (error) {
      toast.error('Failed to load availability');
    }
  };

  const isTableBooked = (tableNumber, timeSlot) => {
    if (!timeSlot) return false;
    
    // Find bookings that match BOTH the table number AND time slot
    const matchingBookings = bookedSlots.filter(booking => {
      // Strict comparison - both must match
      const tableNumberMatch = String(booking.tableNumber).trim() === String(tableNumber).trim();
      const timeSlotMatch = booking.timeSlot &&
        String(booking.timeSlot.startTime).trim() === String(timeSlot.startTime).trim() &&
        String(booking.timeSlot.endTime).trim() === String(timeSlot.endTime).trim();
      
      return tableNumberMatch && timeSlotMatch;
    });
    
    // Only consider pending or confirmed bookings as "booked"
    return matchingBookings.some(b => b.status === 'pending' || b.status === 'confirmed');
  };

  // Calculate total capacity of selected tables
  const getTotalSelectedCapacity = () => {
    return selectedTables.reduce((sum, table) => sum + table.capacity, 0);
  };

  // Get available tables for selected date and time slot
  const getAvailableTables = () => {
    if (!venue || !selectedDate || !selectedTimeSlot) return [];
    
    return venue.tables.filter(table => 
      !isTableBooked(table.tableNumber, selectedTimeSlot)
    );
  };

  // Calculate total capacity of all available tables
  const getTotalAvailableCapacity = () => {
    return getAvailableTables().reduce((sum, table) => sum + table.capacity, 0);
  };

  // Check if we can accommodate the number of guests
  const canAccommodateGuests = () => {
    const guestCount = parseInt(formData.numberOfGuests) || 1;
    return getTotalAvailableCapacity() >= guestCount;
  };

  // Toggle table selection
  const toggleTableSelection = (table) => {
    const isAlreadySelected = selectedTables.some(
      t => t.tableNumber === table.tableNumber && t.capacity === table.capacity
    );

    if (isAlreadySelected) {
      // Remove table from selection
      setSelectedTables(selectedTables.filter(
        t => !(t.tableNumber === table.tableNumber && t.capacity === table.capacity)
      ));
    } else {
      // Check if adding this table would exceed guest count unnecessarily
      const currentCapacity = getTotalSelectedCapacity();
      const guestCount = parseInt(formData.numberOfGuests) || 1;
      const newCapacity = currentCapacity + table.capacity;

      // If we already have enough capacity, warn user
      if (currentCapacity >= guestCount) {
        toast.error(
          `You already have enough seats (${currentCapacity}) for ${guestCount} guest${guestCount !== 1 ? 's' : ''}. ` +
          `Please increase guest count or contact the venue for additional tables.`
        );
        return;
      }

      // Add table to selection
      setSelectedTables([...selectedTables, table]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedDate || !selectedTimeSlot || selectedTables.length === 0) {
      toast.error('Please select date, time slot, and at least one table');
      return;
    }

    // Validate guest count against total table capacity
    const guestCount = parseInt(formData.numberOfGuests);
    const totalCapacity = getTotalSelectedCapacity();
    
    if (guestCount > totalCapacity) {
      toast.error(
        `Selected table${selectedTables.length > 1 ? 's have' : ' has'} ${totalCapacity} seats total. ` +
        `Please select more tables or reduce guest count to ${totalCapacity}.`
      );
      return;
    }

    if (guestCount < 1) {
      toast.error('Number of guests must be at least 1');
      return;
    }

    setSubmitting(true);

    try {
      // Book each table separately
      const bookingPromises = selectedTables.map(table =>
        axios.post(`${API_URL}/bookings/public/${venueId}/book`, {
          tableNumber: table.tableNumber,
          date: selectedDate,
          timeSlot: selectedTimeSlot,
          ...formData,
          numberOfGuests: guestCount, // Same guest info for all tables
          specialRequests: `${formData.specialRequests}${selectedTables.length > 1 ? ` [Part of group booking - ${selectedTables.length} tables total]` : ''}`
        })
      );

      await Promise.all(bookingPromises);

      setBookingSuccess(true);
      toast.success(
        `Booking confirmed for ${selectedTables.length} table${selectedTables.length > 1 ? 's' : ''}!`
      );
      
      // Reset form
      setSelectedTables([]);
      setFormData({
        guestName: '',
        guestEmail: '',
        guestPhone: '',
        numberOfGuests: 1,
        specialRequests: ''
      });
      
      // Refresh availability after successful booking
      if (selectedDate) {
        await fetchAvailability();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create booking');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading && !venue) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-purple-600 border-t-transparent mb-4"></div>
          <p className="text-gray-600 text-lg">Loading venue...</p>
        </div>
      </div>
    );
  }

  if (bookingSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full border-0 shadow-2xl">
          <CardContent className="pt-12 pb-12 text-center">
            <div className="inline-flex p-6 bg-gradient-to-br from-green-500 to-green-600 rounded-full mb-6">
              <CheckCircle2 className="h-16 w-16 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Booking Submitted!</h2>
            <p className="text-lg text-gray-600 mb-6">
              Your table reservation request has been submitted successfully. The restaurant will confirm your booking shortly.
            </p>
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl mb-6">
              <p className="text-sm font-semibold text-gray-700 mb-2">Booking Details:</p>
              <p className="text-gray-600">{venue?.name} - {venue?.venueType}</p>
              <p className="text-gray-600">
                {selectedTables.length > 0 && `Table${selectedTables.length > 1 ? 's' : ''}: ${selectedTables.map(t => t.tableNumber).join(', ')}`}
              </p>
              <p className="text-gray-600">{selectedDate?.toLocaleDateString()}</p>
              <p className="text-gray-600">{selectedTimeSlot?.startTime} - {selectedTimeSlot?.endTime}</p>
            </div>
            <p className="text-sm text-gray-500">
              A confirmation email will be sent to <span className="font-semibold">{formData.guestEmail}</span>
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-12 max-w-6xl">
        {/* Header */}
        {venue && (
          <div className="mb-8 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full mb-4">
              <Utensils className="h-5 w-5 text-purple-600" />
              <span className="text-sm font-semibold text-purple-900">{venue.venueType}</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-3">
              {venue.name}
            </h1>
            {venue.description && (
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">{venue.description}</p>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Selection */}
          <div className="space-y-6">
            {/* Date Selection */}
            <Card className="border-0 shadow-xl">
              <CardHeader className="border-b bg-gradient-to-r from-blue-50 to-purple-50">
                <CardTitle className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5 text-purple-600" />
                  Select Date
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 flex justify-center">
                <div className="w-full flex justify-center">
                  <Calendar
                    value={selectedDate}
                    onChange={setSelectedDate}
                    className="rounded-xl border-2 border-purple-200 shadow-lg p-4 bg-white"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Time Slot Selection */}
            {selectedDate && venue && (
              <Card className="border-0 shadow-xl">
                <CardHeader className="border-b bg-gradient-to-r from-blue-50 to-purple-50">
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-purple-600" />
                    Select Time Slot
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-2 gap-3">
                    {venue.timeSlots.map((slot, index) => {
                      const isSelected = selectedTimeSlot && 
                        selectedTimeSlot.name === slot.name &&
                        selectedTimeSlot.startTime === slot.startTime &&
                        selectedTimeSlot.endTime === slot.endTime;
                      
                      return (
                        <button
                          key={index}
                          type="button"
                          onClick={() => {
                            setSelectedTimeSlot(slot);
                            setSelectedTables([]); // Reset table selection
                          }}
                          className={`p-4 rounded-lg border-2 transition-all ${
                            isSelected
                              ? 'border-purple-600 bg-purple-50'
                              : 'border-gray-200 hover:border-purple-300'
                          }`}
                        >
                          <p className="font-semibold text-gray-900">{slot.name}</p>
                          <p className="text-sm text-gray-600">{slot.startTime} - {slot.endTime}</p>
                        </button>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Table Selection */}
            {selectedDate && selectedTimeSlot && venue && (
              <Card className="border-0 shadow-xl">
                <CardHeader className="border-b bg-gradient-to-r from-blue-50 to-purple-50">
                  <CardTitle className="flex items-center gap-2">
                    <Utensils className="h-5 w-5 text-purple-600" />
                    Select Table{selectedTables.length > 0 ? 's' : ''} ({selectedTables.length} selected)
                  </CardTitle>
                  <CardDescription>
                    {selectedTables.length > 0 
                      ? `Total capacity: ${getTotalSelectedCapacity()} seats for ${formData.numberOfGuests} guest${formData.numberOfGuests !== 1 ? 's' : ''}`
                      : 'Click tables to select (you can select multiple)'}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  {/* No Tables Available Warning */}
                  {!canAccommodateGuests() && getAvailableTables().length === 0 && (
                    <div className="mb-4 p-4 bg-red-50 border-2 border-red-300 rounded-lg text-center">
                      <p className="text-red-800 font-bold mb-2">😔 No Tables Available</p>
                      <p className="text-sm text-red-700">
                        Sorry, all tables are booked for this time slot. Please select a different date or time.
                      </p>
                    </div>
                  )}
                  
                  {/* Insufficient Capacity Warning */}
                  {!canAccommodateGuests() && getAvailableTables().length > 0 && (
                    <div className="mb-4 p-4 bg-red-50 border-2 border-red-300 rounded-lg text-center">
                      <p className="text-red-800 font-bold mb-2">😔 Not Enough Capacity</p>
                      <p className="text-sm text-red-700 mb-2">
                        Sorry, we can't accommodate {formData.numberOfGuests} guests at this time.
                      </p>
                      <p className="text-sm text-red-700">
                        Only {getAvailableTables().length} table{getAvailableTables().length !== 1 ? 's' : ''} available 
                        with {getTotalAvailableCapacity()} total seat{getTotalAvailableCapacity() !== 1 ? 's' : ''}.
                        Please reduce guest count or try a different time/date.
                      </p>
                    </div>
                  )}
                  {/* Info message about capacity */}
                  {getTotalSelectedCapacity() < parseInt(formData.numberOfGuests) && selectedTables.length > 0 && (
                    <div className="mb-4 p-3 bg-orange-50 border border-orange-300 rounded-lg">
                      <p className="text-sm text-orange-800">
                        <span className="font-semibold">⚠️ Notice:</span> You have {getTotalSelectedCapacity()} seats 
                        selected but need {formData.numberOfGuests}. Please select {parseInt(formData.numberOfGuests) - getTotalSelectedCapacity()} 
                        more seat{parseInt(formData.numberOfGuests) - getTotalSelectedCapacity() !== 1 ? 's' : ''}.
                      </p>
                    </div>
                  )}
                  {getTotalSelectedCapacity() >= parseInt(formData.numberOfGuests) && selectedTables.length > 0 && (
                    <div className="mb-4 p-3 bg-green-50 border border-green-300 rounded-lg">
                      <p className="text-sm text-green-800">
                        <span className="font-semibold">✓ Perfect!</span> You have {getTotalSelectedCapacity()} seats 
                        for {formData.numberOfGuests} guest{formData.numberOfGuests !== 1 ? 's' : ''}. Ready to book!
                      </p>
                    </div>
                  )}
                  
                  {/* Show tables only if we can accommodate guests OR if user hasn't entered count yet */}
                  {(canAccommodateGuests() || formData.numberOfGuests === 1) && getAvailableTables().length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {venue.tables.map((table, index) => {
                      const isBooked = isTableBooked(table.tableNumber, selectedTimeSlot);
                      const isSelected = selectedTables.some(
                        t => t.tableNumber === table.tableNumber && t.capacity === table.capacity
                      );
                      
                      return (
                        <button
                          key={`${table.tableNumber}-${index}`}
                          type="button"
                          disabled={isBooked}
                          onClick={() => toggleTableSelection(table)}
                          className={`p-4 rounded-lg border-2 transition-all ${
                            isBooked
                              ? 'border-red-200 bg-red-50 opacity-50 cursor-not-allowed'
                              : isSelected
                              ? 'border-purple-600 bg-purple-100 ring-2 ring-purple-300'
                              : 'border-gray-200 hover:border-purple-300 hover:bg-purple-50'
                          }`}
                        >
                          <p className="font-semibold text-gray-900">
                            Table {table.tableNumber}
                            {isSelected && <span className="ml-1 text-purple-600">✓</span>}
                          </p>
                          <p className="text-xs text-gray-600 flex items-center justify-center gap-1">
                            <Users className="h-3 w-3" />
                            {table.capacity} seats
                          </p>
                          {isBooked && (
                            <p className="text-xs text-red-600 font-semibold mt-1">Booked</p>
                          )}
                          {isSelected && (
                            <p className="text-xs text-purple-600 font-semibold mt-1">Selected</p>
                          )}
                        </button>
                      );
                    })}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Guest Information */}
          <div>
            <Card className="border-0 shadow-xl sticky top-6">
              <CardHeader className="border-b bg-gradient-to-r from-blue-50 to-purple-50">
                <CardTitle>Your Information</CardTitle>
                <CardDescription>Fill in your details to complete the booking</CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div>
                  <Label htmlFor="guestName">Full Name *</Label>
                  <Input
                    id="guestName"
                    value={formData.guestName}
                    onChange={(e) => setFormData({ ...formData, guestName: e.target.value })}
                    placeholder="John Doe"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="guestEmail">Email *</Label>
                  <Input
                    id="guestEmail"
                    type="email"
                    value={formData.guestEmail}
                    onChange={(e) => setFormData({ ...formData, guestEmail: e.target.value })}
                    placeholder="john@example.com"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="guestPhone">Phone *</Label>
                  <Input
                    id="guestPhone"
                    type="tel"
                    value={formData.guestPhone}
                    onChange={(e) => setFormData({ ...formData, guestPhone: e.target.value })}
                    placeholder="+1 234 567 8900"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="numberOfGuests">Number of Guests *</Label>
                  <Input
                    id="numberOfGuests"
                    type="number"
                    min="1"
                    value={formData.numberOfGuests}
                    onChange={(e) => setFormData({ ...formData, numberOfGuests: parseInt(e.target.value) || 1 })}
                    required
                    className={
                      selectedTables.length > 0 && formData.numberOfGuests > getTotalSelectedCapacity()
                        ? 'border-red-500 focus:border-red-500'
                        : ''
                    }
                  />
                  {selectedTables.length > 0 && formData.numberOfGuests > getTotalSelectedCapacity() && (
                    <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                      <span>⚠️</span>
                      <span>
                        You need {formData.numberOfGuests - getTotalSelectedCapacity()} more seat{formData.numberOfGuests - getTotalSelectedCapacity() !== 1 ? 's' : ''}. 
                        Please select additional table{formData.numberOfGuests - getTotalSelectedCapacity() !== 1 ? 's' : ''}.
                      </span>
                    </p>
                  )}
                  {selectedTables.length > 0 && formData.numberOfGuests <= getTotalSelectedCapacity() && (
                    <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                      <span>✓</span>
                      <span>
                        {selectedTables.length} table{selectedTables.length > 1 ? 's' : ''} selected with {getTotalSelectedCapacity()} total seats for {formData.numberOfGuests} guest{formData.numberOfGuests !== 1 ? 's' : ''}.
                      </span>
                    </p>
                  )}
                  {selectedTables.length === 0 && (
                    <p className="text-xs text-gray-500 mt-1">
                      Select table(s) below to match your guest count
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="specialRequests">Special Requests</Label>
                  <Textarea
                    id="specialRequests"
                    value={formData.specialRequests}
                    onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
                    placeholder="Any special requirements or requests..."
                    rows={3}
                  />
                </div>

                {/* Summary */}
                {selectedDate && selectedTimeSlot && selectedTables.length > 0 && (
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg">
                    <p className="font-semibold text-gray-900 mb-2">Booking Summary:</p>
                    <p className="text-sm text-gray-600">📅 {selectedDate.toLocaleDateString()}</p>
                    <p className="text-sm text-gray-600">🕐 {selectedTimeSlot.startTime} - {selectedTimeSlot.endTime}</p>
                    <p className="text-sm text-gray-600">
                      🪑 {selectedTables.length} Table{selectedTables.length > 1 ? 's' : ''}: {selectedTables.map(t => `${t.tableNumber} (${t.capacity} seats)`).join(', ')}
                    </p>
                    <p className="text-sm text-gray-600">👥 Total: {getTotalSelectedCapacity()} seats for {formData.numberOfGuests} guest{formData.numberOfGuests !== 1 ? 's' : ''}</p>
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={!selectedDate || !selectedTimeSlot || selectedTables.length === 0 || submitting}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg py-6"
                >
                  {submitting ? (
                    <>
                      <div className="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                      Submitting...
                    </>
                  ) : (
                    'Confirm Booking'
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PublicBookingPage;
