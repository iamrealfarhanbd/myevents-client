import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Sparkles, Utensils } from 'lucide-react';
// Booking System Component
import BookingManagementTab from '@/components/BookingManagementTab';

const BookingsManagementPage = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-orange-100 to-red-100 rounded-full mb-3">
            <Utensils className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600" />
            <span className="text-xs sm:text-sm font-semibold text-orange-900">Table Bookings</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            Manage <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">Bookings</span>
          </h1>
          <p className="text-gray-600">
            View and manage all table reservations for your venues
          </p>
        </div>
        <Button
          onClick={() => navigate('/dashboard/bookings/create-venue')}
          className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Venue
        </Button>
      </div>

      {/* Booking Management Component */}
      <Card className="shadow-lg">
        <CardContent className="p-6">
          <BookingManagementTab />
        </CardContent>
      </Card>
    </div>
  );
};

export default BookingsManagementPage;
