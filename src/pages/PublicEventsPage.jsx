import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Calendar, Clock, Users, MapPin, ChevronRight, Search } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const PublicEventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axios.get(`${API_URL}/polls/public`);
      const pollsData = response.data.polls || [];
      setEvents(pollsData);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to load events');
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getEventStatus = (event) => {
    const now = new Date();
    const endDate = new Date(event.endDate);
    
    if (endDate < now) {
      return { text: 'Ended', color: 'bg-gray-100 text-gray-700' };
    }
    
    const totalVotes = getTotalVotes(event);
    if (totalVotes > 0) {
      return { text: 'Active', color: 'bg-green-100 text-green-700' };
    }
    
    return { text: 'Open', color: 'bg-blue-100 text-blue-700' };
  };

  const getTotalVotes = (event) => {
    // First check if totalSubmissions exists (from backend)
    if (event.totalSubmissions !== undefined) {
      return event.totalSubmissions;
    }
    
    // Otherwise calculate from options
    if (!event.options || !Array.isArray(event.options)) {
      return 0;
    }
    
    return event.options.reduce((sum, opt) => {
      // Handle both object format {text: "...", votes: 5} and simple format
      const votes = typeof opt === 'object' ? (opt.votes || opt.count || 0) : 0;
      return sum + votes;
    }, 0);
  };

  const filteredEvents = events.filter(event =>
    event.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate total votes across all events
  const totalVotes = events.reduce((sum, event) => {
    const eventVotes = getTotalVotes(event);
    return sum + eventVotes;
  }, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading events...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full mb-6 shadow-xl">
            <Calendar className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Discover Events
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Browse through our available events and make your voice heard by voting on your favorites
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search events by title or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-4 py-6 text-lg border-2 border-purple-200 focus:border-purple-500 rounded-xl shadow-lg"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="border-0 shadow-xl bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">Total Events</p>
                  <p className="text-4xl font-bold mt-2">{events.length}</p>
                </div>
                <Calendar className="h-12 w-12 text-purple-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Active Events</p>
                  <p className="text-4xl font-bold mt-2">
                    {events.filter(e => new Date(e.endDate) >= new Date()).length}
                  </p>
                </div>
                <Clock className="h-12 w-12 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-xl bg-gradient-to-br from-pink-500 to-pink-600 text-white">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-pink-100 text-sm font-medium">Total Votes</p>
                  <p className="text-4xl font-bold mt-2">
                    {totalVotes}
                  </p>
                </div>
                <Users className="h-12 w-12 text-pink-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Events Grid */}
        {filteredEvents.length === 0 ? (
          <Card className="border-0 shadow-xl">
            <CardContent className="py-12 text-center">
              <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Events Found</h3>
              <p className="text-gray-600">
                {searchTerm ? 'Try adjusting your search terms' : 'Check back later for new events'}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => {
              const status = getEventStatus(event);
              const totalVotes = getTotalVotes(event);
              
              return (
                <Card 
                  key={event._id} 
                  className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
                >
                  <div className="h-2 bg-gradient-to-r from-purple-500 via-blue-500 to-pink-500"></div>
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between mb-3">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${status.color}`}>
                        {status.text}
                      </span>
                      <span className="text-sm text-gray-500 flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {totalVotes}
                      </span>
                    </div>
                    <CardTitle className="text-xl line-clamp-2 text-gray-900">
                      {event.question}
                    </CardTitle>
                    {event.description && (
                      <CardDescription className="line-clamp-2 text-gray-600 mt-2">
                        {event.description}
                      </CardDescription>
                    )}
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Event Details */}
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="h-4 w-4 text-purple-600" />
                        <span className="font-medium">Starts:</span>
                        <span>{formatDate(event.startDate)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Clock className="h-4 w-4 text-blue-600" />
                        <span className="font-medium">Ends:</span>
                        <span>{formatDate(event.endDate)}</span>
                      </div>
                      {event.location && (
                        <div className="flex items-center gap-2 text-gray-600">
                          <MapPin className="h-4 w-4 text-pink-600" />
                          <span className="line-clamp-1">{event.location}</span>
                        </div>
                      )}
                    </div>

                    {/* Options Preview */}
                    <div className="border-t pt-3">
                      <p className="text-xs text-gray-500 mb-2 font-medium">
                        {event.options.length} Option{event.options.length !== 1 ? 's' : ''} Available
                      </p>
                      <div className="space-y-1">
                        {event.options.slice(0, 2).map((option, idx) => (
                          <div key={idx} className="flex items-center justify-between text-sm">
                            <span className="text-gray-700 line-clamp-1">{option.text}</span>
                            <span className="text-purple-600 font-semibold">{option.votes}</span>
                          </div>
                        ))}
                        {event.options.length > 2 && (
                          <p className="text-xs text-gray-500 italic">
                            +{event.options.length - 2} more option{event.options.length - 2 !== 1 ? 's' : ''}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Action Button */}
                    <Link to={`/poll/${event._id}`} className="block w-full">
                      <Button 
                        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg"
                      >
                        View & Vote
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default PublicEventsPage;
