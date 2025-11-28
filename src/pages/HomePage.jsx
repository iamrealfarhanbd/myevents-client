import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useSettings } from '@/context/SettingsContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, Lock, Trash2, BarChart, Sparkles, Zap, Shield, TrendingUp, Users, QrCode, Calendar, Utensils, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import config from '@/config/config';

const HomePage = () => {
  const { isAuthenticated } = useAuth();
  const { settings } = useSettings();
  const navigate = useNavigate();
  const [checkingSetup, setCheckingSetup] = useState(true);
  const [setupComplete, setSetupComplete] = useState(true);

  useEffect(() => {
    // Check if setup is needed on first visit
    const checkSetup = async () => {
      try {
        const response = await axios.get(`${config.apiUrl}/auth/check-setup`);
        setSetupComplete(response.data.isSetupComplete);
        // Don't redirect - just show coming soon page
      } catch (error) {
        console.error('Setup check failed:', error);
      } finally {
        setCheckingSetup(false);
      }
    };
    
    checkSetup();
  }, [navigate]);

  if (checkingSetup) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show Coming Soon page if no admin exists
  if (!setupComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center px-4">
        <div className="text-center max-w-2xl">
          <div className="mb-8">
            <div className="w-24 h-24 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mx-auto flex items-center justify-center animate-pulse">
              <Sparkles className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-5xl sm:text-6xl font-extrabold text-gray-900 mb-4">
            Coming Soon
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            We're getting everything ready for you. Stay tuned!
          </p>
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-white rounded-full shadow-lg">
            <Clock className="h-5 w-5 text-purple-600 animate-spin" style={{ animationDuration: '3s' }} />
            <span className="text-gray-700 font-medium">Setting things up...</span>
          </div>
          <p className="mt-8 text-sm text-gray-500">
            Admin? Access setup at <code className="px-2 py-1 bg-gray-100 rounded text-purple-600">/setup</code>
          </p>
        </div>
      </div>
    );
  }

  const features = [
    {
      icon: Calendar,
      title: 'Event Polling',
      description: 'Create smart polls with auto-expiry for event planning and feedback',
      gradient: 'from-yellow-400 to-orange-500'
    },
    {
      icon: Utensils,
      title: 'Table Booking',
      description: 'Manage venue reservations with complete booking management system',
      gradient: 'from-green-400 to-cyan-500'
    },
    {
      icon: Clock,
      title: 'Auto-Expire',
      description: 'Set custom expiry times and let data auto-delete automatically',
      gradient: 'from-blue-400 to-purple-500'
    },
    {
      icon: TrendingUp,
      title: 'Real-time Analytics',
      description: 'Track responses and bookings live with comprehensive reports',
      gradient: 'from-pink-400 to-rose-500'
    }
  ];

  const stats = [
    { icon: Users, value: '10K+', label: 'Active Users' },
    { icon: BarChart, value: '50K+', label: 'Polls Created' },
    { icon: QrCode, value: '100%', label: 'Secure' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10" />
        <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-16 lg:py-20 relative">
          <div className="text-center max-w-5xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full mb-6 sm:mb-8 animate-pulse">
              <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
              <span className="text-xs sm:text-sm font-semibold text-purple-900">Event Management & Booking System</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold text-gray-900 mb-4 sm:mb-6 leading-tight px-2">
              Manage <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Events & Bookings</span>
              <br className="hidden sm:block" /><span className="sm:hidden"> </span>with Smart Automation
            </h1>
            
            <p className="text-base sm:text-lg lg:text-2xl text-gray-600 mb-8 sm:mb-10 max-w-3xl mx-auto leading-relaxed px-4">
              Complete solution for event polling and table bookings. Create time-sensitive polls,
              manage venue reservations, and automate your event workflow. 🎉
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-8 sm:mb-12 px-4">
              {isAuthenticated ? (
                <Button 
                  size="lg" 
                  onClick={() => navigate('/dashboard')}
                  className="w-full sm:w-auto text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-xl"
                >
                  <BarChart className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                  Go to Dashboard
                </Button>
              ) : (
                <Button 
                  size="lg" 
                  onClick={() => navigate('/events')}
                  className="w-full sm:w-auto text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-xl"
                >
                  <Calendar className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                  View Events & Polls
                </Button>
              )}
            </div>

            {/* Stats */}
            <div className="flex justify-center gap-6 sm:gap-8 lg:gap-12 flex-wrap px-4">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />
                      <span className="text-2xl sm:text-3xl font-bold text-gray-900">{stat.value}</span>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-600">{stat.label}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-16 lg:py-20">
        <div className="text-center mb-10 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 px-2">
            Why Choose EventPro?
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto px-4">
            Complete solution for event management and venue bookings
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-12 sm:mb-16">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card 
                key={index} 
                className="text-center border-0 shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 bg-white/80 backdrop-blur"
              >
                <CardHeader>
                  <div className="flex justify-center mb-4">
                    <div className={`p-4 bg-gradient-to-br ${feature.gradient} rounded-2xl shadow-lg`}>
                      <Icon className="h-10 w-10 text-white" />
                    </div>
                  </div>
                  <CardTitle className="text-xl font-bold">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Public Access Section - Events & Bookings */}
        <div className="max-w-5xl mx-auto mb-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              Explore & Participate
            </h2>
            <p className="text-lg sm:text-xl text-gray-600">
              Join events and make reservations - no login required
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Events Card */}
            <Card 
              onClick={() => navigate('/events')}
              className="border-0 shadow-xl bg-gradient-to-br from-purple-600 to-blue-600 text-white hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 cursor-pointer overflow-hidden group"
            >
              <CardContent className="p-8 relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500" />
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-6">
                    <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm">
                      <Calendar className="h-12 w-12 text-white" />
                    </div>
                    <ChevronRight className="h-8 w-8 text-white/60 group-hover:text-white group-hover:translate-x-2 transition-all duration-300" />
                  </div>
                  <h3 className="text-3xl font-bold mb-3">Browse Events</h3>
                  <p className="text-purple-100 text-lg mb-6">
                    Discover active polls and events. Vote on your favorites and see real-time results.
                  </p>
                  <div className="flex items-center gap-2 text-purple-100">
                    <Users className="h-5 w-5" />
                    <span className="text-sm">Public Access • No Login Required</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Bookings Card */}
            <Card 
              onClick={() => navigate('/bookings')}
              className="border-0 shadow-xl bg-gradient-to-br from-green-600 to-teal-600 text-white hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 cursor-pointer overflow-hidden group"
            >
              <CardContent className="p-8 relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500" />
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-6">
                    <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm">
                      <Utensils className="h-12 w-12 text-white" />
                    </div>
                    <ChevronRight className="h-8 w-8 text-white/60 group-hover:text-white group-hover:translate-x-2 transition-all duration-300" />
                  </div>
                  <h3 className="text-3xl font-bold mb-3">Book a Table</h3>
                  <p className="text-green-100 text-lg mb-6">
                    Reserve your table at available venues. Choose date, time, and table - instantly.
                  </p>
                  <div className="flex items-center gap-2 text-green-100">
                    <Users className="h-5 w-5" />
                    <span className="text-sm">Public Access • No Login Required</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* How It Works Section */}
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-5xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">
              Get started in 4 simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="border-0 shadow-xl bg-gradient-to-br from-blue-50 to-blue-100 hover:shadow-2xl transition-shadow duration-300">
              <CardHeader>
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-gradient-to-br from-blue-600 to-purple-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-xl shadow-lg">
                    1
                  </div>
                  <CardTitle className="text-2xl">Create Events</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 text-lg">
                  Set up polls and venues with custom options, time slots, and flexible configurations
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-xl bg-gradient-to-br from-purple-50 to-purple-100 hover:shadow-2xl transition-shadow duration-300">
              <CardHeader>
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-gradient-to-br from-purple-600 to-pink-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-xl shadow-lg">
                    2
                  </div>
                  <CardTitle className="text-2xl">Share & Accept</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 text-lg">
                  Share polls via links and QR codes. Accept table bookings with instant confirmations
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-xl bg-gradient-to-br from-pink-50 to-pink-100 hover:shadow-2xl transition-shadow duration-300">
              <CardHeader>
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-gradient-to-br from-pink-600 to-rose-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-xl shadow-lg">
                    3
                  </div>
                  <CardTitle className="text-2xl">Track Activity</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 text-lg">
                  Monitor poll responses and bookings in real-time with comprehensive analytics
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-xl bg-gradient-to-br from-green-50 to-green-100 hover:shadow-2xl transition-shadow duration-300">
              <CardHeader>
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-gradient-to-br from-green-600 to-cyan-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-xl shadow-lg">
                    4
                  </div>
                  <CardTitle className="text-2xl">Auto-Manage</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 text-lg">
                  Polls auto-expire on schedule, bookings confirmed instantly - fully automated workflow
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-20 text-center">
          <Card className="border-0 shadow-2xl bg-gradient-to-r from-blue-600 to-purple-600 text-white overflow-hidden">
            <CardContent className="py-16 relative">
              <h2 className="text-4xl font-bold mb-4">Ready to Manage Your Events?</h2>
              <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                Complete platform for event polling and table bookings - perfect for venues, hotels, and event organizers
              </p>
              {!isAuthenticated && (
                <Button 
                  size="lg" 
                  onClick={() => navigate('/register')}
                  className="text-lg px-10 py-6 bg-white text-purple-600 hover:bg-gray-100 transform hover:scale-105 transition-all duration-200 shadow-xl font-bold"
                >
                  <Sparkles className="mr-2 h-6 w-6" />
                  Start Creating Free
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HomePage;