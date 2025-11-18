import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, Lock, Trash2, BarChart, Sparkles, Zap, Shield, TrendingUp, Users, QrCode } from 'lucide-react';

const HomePage = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const features = [
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Create and deploy polls in seconds with our intuitive interface',
      gradient: 'from-yellow-400 to-orange-500'
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Enterprise-grade security with JWT authentication & encryption',
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
      description: 'Track responses live and export comprehensive CSV reports',
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
              <span className="text-xs sm:text-sm font-semibold text-purple-900">Temporary Poll Platform</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold text-gray-900 mb-4 sm:mb-6 leading-tight px-2">
              Create <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Smart Polls</span>
              <br className="hidden sm:block" /><span className="sm:hidden"> </span>That Vanish on Schedule
            </h1>
            
            <p className="text-base sm:text-lg lg:text-2xl text-gray-600 mb-8 sm:mb-10 max-w-3xl mx-auto leading-relaxed px-4">
              Build beautiful, secure polls with automatic deletion. Perfect for events, surveys, 
              and time-sensitive feedback. No data left behind. 🚀
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
                <>
                  <Button 
                    size="lg" 
                    onClick={() => navigate('/register')}
                    className="w-full sm:w-auto text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-xl"
                  >
                    <Sparkles className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                    Get Started Free
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline" 
                    onClick={() => navigate('/login')}
                    className="w-full sm:w-auto text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 border-2 border-purple-600 text-purple-600 hover:bg-purple-50 transform hover:scale-105 transition-all duration-200"
                  >
                    Login
                  </Button>
                </>
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
            Why Choose MyEvents?
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto px-4">
            Powerful features designed for modern polling needs
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
                  <CardTitle className="text-2xl">Create a Poll</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 text-lg">
                  Sign up and craft your poll with custom questions, multiple choice options, and flexible question types
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-xl bg-gradient-to-br from-purple-50 to-purple-100 hover:shadow-2xl transition-shadow duration-300">
              <CardHeader>
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-gradient-to-br from-purple-600 to-pink-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-xl shadow-lg">
                    2
                  </div>
                  <CardTitle className="text-2xl">Share Instantly</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 text-lg">
                  Get a unique link and QR code to share via email, social media, or print for your event
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-xl bg-gradient-to-br from-pink-50 to-pink-100 hover:shadow-2xl transition-shadow duration-300">
              <CardHeader>
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-gradient-to-br from-pink-600 to-rose-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-xl shadow-lg">
                    3
                  </div>
                  <CardTitle className="text-2xl">Collect Responses</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 text-lg">
                  Watch submissions roll in real-time, with participant info and detailed analytics
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-xl bg-gradient-to-br from-green-50 to-green-100 hover:shadow-2xl transition-shadow duration-300">
              <CardHeader>
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-gradient-to-br from-green-600 to-cyan-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-xl shadow-lg">
                    4
                  </div>
                  <CardTitle className="text-2xl">Auto-Delete</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 text-lg">
                  Poll expires on schedule and all data vanishes automatically - no manual cleanup needed
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-20 text-center">
          <Card className="border-0 shadow-2xl bg-gradient-to-r from-blue-600 to-purple-600 text-white overflow-hidden">
            <CardContent className="py-16 relative">
              <h2 className="text-4xl font-bold mb-4">Ready to Create Your First Poll?</h2>
              <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                Join thousands of users creating secure, temporary polls for events, surveys, and feedback
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