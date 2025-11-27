// 🆕 NEW FILE - BOOKING SYSTEM
// This file can be deleted if booking system is not needed

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Utensils, Calendar, Clock, Users, ArrowRight } from 'lucide-react';
import config from '@/config/config';

const PublicBookingMenuPage = () => {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const API_URL = config.apiUrl;

  useEffect(() => {
    fetchPublicVenues();
  }, []);

  const fetchPublicVenues = async () => {
    try {
      // We need a public endpoint to get all active venues
      const response = await axios.get(`${API_URL}/bookings/public/venues`);
      setVenues(response.data.venues);
    } catch (error) {
      toast.error('Failed to load booking options');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-purple-600 border-t-transparent mb-4"></div>
          <p className="text-gray-600 text-lg">Loading booking options...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-12 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full mb-4">
            <Utensils className="h-5 w-5 text-purple-600" />
            <span className="text-sm font-semibold text-purple-900">Table Reservations</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-3">
            Book Your <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Table</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Choose from our available venues and reserve your table instantly
          </p>
        </div>

        {venues.length === 0 ? (
          <Card className="border-0 shadow-xl max-w-2xl mx-auto">
            <CardContent className="py-16 text-center">
              <div className="inline-flex p-6 bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl mb-6">
                <Utensils className="h-16 w-16 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-3">No Venues Available</h2>
              <p className="text-gray-600">
                There are currently no booking venues available. Please check back later.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {venues.map((venue) => (
              <Card key={venue._id} className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 group">
                <CardHeader className="border-b bg-gradient-to-r from-blue-50 to-purple-50">
                  <div className="flex justify-between items-start mb-2">
                    <CardTitle className="text-2xl">{venue.name}</CardTitle>
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                      {venue.venueType}
                    </span>
                  </div>
                  {venue.description && (
                    <CardDescription className="text-base">{venue.description}</CardDescription>
                  )}
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Users className="h-5 w-5 text-blue-600" />
                      <span className="text-sm">
                        <span className="font-semibold text-gray-900">{venue.tables?.length || 0}</span> tables available
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Clock className="h-5 w-5 text-purple-600" />
                      <span className="text-sm">
                        <span className="font-semibold text-gray-900">{venue.timeSlots?.length || 0}</span> time slots
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar className="h-5 w-5 text-green-600" />
                      <span className="text-sm font-semibold text-green-700">Available for booking</span>
                    </div>
                  </div>

                  <Button
                    onClick={() => navigate(`/booking/${venue._id}`)}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 group-hover:scale-105 transition-transform"
                    size="lg"
                  >
                    Book Now
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PublicBookingMenuPage;
