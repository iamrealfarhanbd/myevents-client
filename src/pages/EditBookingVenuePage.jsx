// 🆕 NEW FILE - BOOKING SYSTEM
// This file can be deleted if booking system is not needed

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Plus, Trash2, Save } from 'lucide-react';
import config from '@/config/config';

const EditBookingVenuePage = () => {
  const { venueId } = useParams();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    venueType: '',
    tables: [],
    timeSlots: [],
    isActive: true
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { token } = useAuth();
  const navigate = useNavigate();

  const API_URL = config.apiUrl;

  useEffect(() => {
    fetchVenue();
  }, []);

  const fetchVenue = async () => {
    try {
      const response = await axios.get(`${API_URL}/booking-venues/${venueId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFormData(response.data.venue);
    } catch (error) {
      toast.error('Failed to load venue');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const addTable = () => {
    setFormData({
      ...formData,
      tables: [...formData.tables, { tableNumber: '', capacity: 4, position: { x: 0, y: 0 }, shape: 'square' }]
    });
  };

  const removeTable = (index) => {
    const newTables = formData.tables.filter((_, i) => i !== index);
    setFormData({ ...formData, tables: newTables });
  };

  const updateTable = (index, field, value) => {
    const newTables = [...formData.tables];
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      newTables[index][parent][child] = value;
    } else {
      newTables[index][field] = value;
    }
    setFormData({ ...formData, tables: newTables });
  };

  const addTimeSlot = () => {
    setFormData({
      ...formData,
      timeSlots: [...formData.timeSlots, {
        name: '',
        startTime: '',
        endTime: '',
        daysAvailable: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
      }]
    });
  };

  const removeTimeSlot = (index) => {
    const newSlots = formData.timeSlots.filter((_, i) => i !== index);
    setFormData({ ...formData, timeSlots: newSlots });
  };

  const updateTimeSlot = (index, field, value) => {
    const newSlots = [...formData.timeSlots];
    newSlots[index][field] = value;
    setFormData({ ...formData, timeSlots: newSlots });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.venueType) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (formData.tables.length === 0) {
      toast.error('Please add at least one table');
      return;
    }

    if (formData.timeSlots.length === 0) {
      toast.error('Please add at least one time slot');
      return;
    }

    setSaving(true);

    try {
      await axios.put(`${API_URL}/booking-venues/${venueId}`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success('Venue updated successfully!');
      navigate(`/dashboard/bookings/venue/${venueId}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update venue');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-purple-600 border-t-transparent mb-4"></div>
          <p className="text-gray-600 text-lg">Loading venue...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-12 max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="outline"
            onClick={() => navigate(`/dashboard/bookings/venue/${venueId}`)}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Venue Details
          </Button>
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
            Edit <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Venue</span>
          </h1>
          <p className="text-lg text-gray-600">Update venue details, tables, and time slots</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <Card className="border-0 shadow-xl">
            <CardHeader className="border-b bg-gradient-to-r from-blue-50 to-purple-50">
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div>
                <Label htmlFor="name">Venue Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Main Restaurant"
                  required
                />
              </div>
              <div>
                <Label htmlFor="venueType">Venue Type *</Label>
                <Input
                  id="venueType"
                  value={formData.venueType}
                  onChange={(e) => setFormData({ ...formData, venueType: e.target.value })}
                  placeholder="e.g., Lunch, Dinner, Breakfast"
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe your venue..."
                  rows={3}
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4 text-purple-600 rounded"
                />
                <Label htmlFor="isActive" className="mb-0">Active (Allow public bookings)</Label>
              </div>
            </CardContent>
          </Card>

          {/* Tables */}
          <Card className="border-0 shadow-xl">
            <CardHeader className="border-b bg-gradient-to-r from-blue-50 to-purple-50">
              <div className="flex justify-between items-center">
                <CardTitle>Tables</CardTitle>
                <Button type="button" onClick={addTable} size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Table
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              {formData.tables.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>No tables added yet. Click "Add Table" to get started.</p>
                </div>
              ) : (
                formData.tables.map((table, index) => (
                  <Card key={index} className="border-2">
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-start mb-4">
                        <h4 className="font-semibold text-lg">Table {index + 1}</h4>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeTable(index)}
                          className="border-red-300 text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label>Table Number *</Label>
                          <Input
                            value={table.tableNumber}
                            onChange={(e) => updateTable(index, 'tableNumber', e.target.value)}
                            placeholder="e.g., T1, A1"
                            required
                          />
                        </div>
                        <div>
                          <Label>Capacity *</Label>
                          <Input
                            type="number"
                            value={table.capacity}
                            onChange={(e) => updateTable(index, 'capacity', parseInt(e.target.value))}
                            min="1"
                            required
                          />
                        </div>
                        <div>
                          <Label>Shape</Label>
                          <select
                            value={table.shape}
                            onChange={(e) => updateTable(index, 'shape', e.target.value)}
                            className="w-full px-3 py-2 border rounded-md"
                          >
                            <option value="square">Square</option>
                            <option value="circle">Circle</option>
                            <option value="rectangle">Rectangle</option>
                          </select>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </CardContent>
          </Card>

          {/* Time Slots */}
          <Card className="border-0 shadow-xl">
            <CardHeader className="border-b bg-gradient-to-r from-blue-50 to-purple-50">
              <div className="flex justify-between items-center">
                <CardTitle>Time Slots</CardTitle>
                <Button type="button" onClick={addTimeSlot} size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Time Slot
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              {formData.timeSlots.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>No time slots added yet. Click "Add Time Slot" to get started.</p>
                </div>
              ) : (
                formData.timeSlots.map((slot, index) => (
                  <Card key={index} className="border-2">
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-start mb-4">
                        <h4 className="font-semibold text-lg">Slot {index + 1}</h4>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeTimeSlot(index)}
                          className="border-red-300 text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label>Slot Name *</Label>
                          <Input
                            value={slot.name}
                            onChange={(e) => updateTimeSlot(index, 'name', e.target.value)}
                            placeholder="e.g., Morning, Evening"
                            required
                          />
                        </div>
                        <div>
                          <Label>Start Time *</Label>
                          <Input
                            type="time"
                            value={slot.startTime}
                            onChange={(e) => updateTimeSlot(index, 'startTime', e.target.value)}
                            required
                          />
                        </div>
                        <div>
                          <Label>End Time *</Label>
                          <Input
                            type="time"
                            value={slot.endTime}
                            onChange={(e) => updateTimeSlot(index, 'endTime', e.target.value)}
                            required
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(`/dashboard/bookings/venue/${venueId}`)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={saving}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              {saving ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditBookingVenuePage;
