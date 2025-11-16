import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, Lock, Trash2, BarChart } from 'lucide-react';

const HomePage = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const features = [
    {
      icon: Clock,
      title: 'Temporary Polls',
      description: 'Create polls that automatically expire after a set time period'
    },
    {
      icon: Trash2,
      title: 'Auto-Delete',
      description: 'All poll data is automatically deleted when the poll expires'
    },
    {
      icon: Lock,
      title: 'Secure & Private',
      description: 'Your data is protected with JWT authentication'
    },
    {
      icon: BarChart,
      title: 'Real-time Results',
      description: 'View submissions and export results as CSV'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold text-gray-900 mb-6">
            Welcome to MyEvents
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Create temporary polls that automatically delete themselves and all their data after a set time. 
            Perfect for time-sensitive surveys and feedback collection.
          </p>
          <div className="flex gap-4 justify-center">
            {isAuthenticated ? (
              <Button size="lg" onClick={() => navigate('/dashboard')}>
                Go to Dashboard
              </Button>
            ) : (
              <>
                <Button size="lg" onClick={() => navigate('/register')}>
                  Get Started
                </Button>
                <Button size="lg" variant="outline" onClick={() => navigate('/login')}>
                  Login
                </Button>
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="text-center">
                <CardHeader>
                  <div className="flex justify-center mb-4">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <Icon className="h-8 w-8 text-blue-600" />
                    </div>
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{feature.description}</CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="bg-blue-600 text-white border-0">
            <CardHeader>
              <CardTitle className="text-3xl text-white">How It Works</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="bg-white text-blue-600 rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">
                  1
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Create a Poll</h3>
                  <p className="text-blue-100">
                    Sign up and create your poll with custom questions and set an expiry date/time
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-white text-blue-600 rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">
                  2
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Share with Participants</h3>
                  <p className="text-blue-100">
                    Share the unique poll link or QR code with your audience
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-white text-blue-600 rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">
                  3
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Collect & Analyze</h3>
                  <p className="text-blue-100">
                    View real-time submissions and export results as CSV
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-white text-blue-600 rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">
                  4
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Auto-Delete</h3>
                  <p className="text-blue-100">
                    Poll and all submissions automatically delete when the expiry time is reached
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
