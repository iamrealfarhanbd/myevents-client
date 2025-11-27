import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, User, Mail, Lock, ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';
import config from '@/config/config';

const SetupPage = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const API_URL = config.apiUrl;

  const [setupData, setSetupData] = useState({
    // Business Details
    businessName: '',
    businessType: 'restaurant',
    // Admin Account
    adminName: '',
    adminEmail: '',
    adminPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    // If user is already logged in, redirect to dashboard
    if (isAuthenticated) {
      navigate('/dashboard');
      return;
    }
    checkIfSetupComplete();
  }, [isAuthenticated, navigate]);

  const checkIfSetupComplete = async () => {
    try {
      const response = await axios.get(`${API_URL}/auth/check-setup`);
      if (response.data.isSetupComplete) {
        // Setup already done, redirect to login
        navigate('/login');
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.error('Error checking setup:', error);
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (setupData.adminPassword !== setupData.confirmPassword) {
      toast.error('Passwords do not match!');
      return;
    }

    if (setupData.adminPassword.length < 6) {
      toast.error('Password must be at least 6 characters!');
      return;
    }

    setSubmitting(true);

    try {
      await axios.post(`${API_URL}/auth/setup`, {
        businessName: setupData.businessName,
        businessType: setupData.businessType,
        name: setupData.adminName,
        email: setupData.adminEmail,
        password: setupData.adminPassword
      });

      toast.success('Setup completed successfully! Please login.');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Setup failed. Please try again.');
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-purple-600 border-t-transparent mb-4"></div>
          <p className="text-gray-600 text-lg">Checking setup status...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full mb-4">
            <Sparkles className="h-5 w-5 text-purple-600" />
            <span className="text-sm font-semibold text-purple-900">First Time Setup</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-3">
            Welcome to <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">EventPro</span>
          </h1>
          <p className="text-lg text-gray-600">Set up your event management system in 2 simple steps</p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center gap-4">
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${step === 1 ? 'bg-purple-600 text-white' : 'bg-green-100 text-green-700'}`}>
              {step === 1 ? (
                <Building2 className="h-5 w-5" />
              ) : (
                <CheckCircle2 className="h-5 w-5" />
              )}
              <span className="font-semibold">Business Info</span>
            </div>
            <div className="h-1 w-12 bg-gray-300"></div>
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${step === 2 ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
              <User className="h-5 w-5" />
              <span className="font-semibold">Admin Account</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <Card className="border-0 shadow-2xl">
            <CardHeader className="border-b bg-gradient-to-r from-blue-50 to-purple-50">
              <CardTitle className="text-2xl">
                {step === 1 ? 'Business Information' : 'Create Admin Account'}
              </CardTitle>
              <CardDescription className="text-base">
                {step === 1 
                  ? 'Configure your venue or business details' 
                  : 'Set up your administrator credentials'}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              {step === 1 ? (
                <>
                  <div className="space-y-3">
                    <Label htmlFor="businessName" className="text-lg font-semibold flex items-center gap-2">
                      <Building2 className="h-5 w-5 text-purple-600" />
                      Business Name *
                    </Label>
                    <Input
                      id="businessName"
                      type="text"
                      placeholder="e.g., Grand Hotel & Restaurant"
                      value={setupData.businessName}
                      onChange={(e) => setSetupData({ ...setupData, businessName: e.target.value })}
                      required
                      className="text-lg py-6 border-2 focus:border-purple-500"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="businessType" className="text-lg font-semibold">
                      Business Type *
                    </Label>
                    <select
                      id="businessType"
                      value={setupData.businessType}
                      onChange={(e) => setSetupData({ ...setupData, businessType: e.target.value })}
                      required
                      className="flex h-14 w-full rounded-md border-2 border-input bg-background px-4 py-3 text-lg ring-offset-background focus-visible:outline-none focus-visible:border-purple-500"
                    >
                      <option value="restaurant">Restaurant</option>
                      <option value="hotel">Hotel</option>
                      <option value="cafe">Café</option>
                      <option value="bar">Bar</option>
                      <option value="venue">Event Venue</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <Button
                    type="button"
                    onClick={() => setStep(2)}
                    className="w-full text-lg py-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    Continue to Admin Setup
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </>
              ) : (
                <>
                  <div className="space-y-3">
                    <Label htmlFor="adminName" className="text-lg font-semibold flex items-center gap-2">
                      <User className="h-5 w-5 text-purple-600" />
                      Admin Name *
                    </Label>
                    <Input
                      id="adminName"
                      type="text"
                      placeholder="Your full name"
                      value={setupData.adminName}
                      onChange={(e) => setSetupData({ ...setupData, adminName: e.target.value })}
                      required
                      className="text-lg py-6 border-2 focus:border-purple-500"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="adminEmail" className="text-lg font-semibold flex items-center gap-2">
                      <Mail className="h-5 w-5 text-purple-600" />
                      Admin Email *
                    </Label>
                    <Input
                      id="adminEmail"
                      type="email"
                      placeholder="admin@yourbusiness.com"
                      value={setupData.adminEmail}
                      onChange={(e) => setSetupData({ ...setupData, adminEmail: e.target.value })}
                      required
                      className="text-lg py-6 border-2 focus:border-purple-500"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="adminPassword" className="text-lg font-semibold flex items-center gap-2">
                      <Lock className="h-5 w-5 text-purple-600" />
                      Password *
                    </Label>
                    <Input
                      id="adminPassword"
                      type="password"
                      placeholder="Minimum 6 characters"
                      value={setupData.adminPassword}
                      onChange={(e) => setSetupData({ ...setupData, adminPassword: e.target.value })}
                      required
                      className="text-lg py-6 border-2 focus:border-purple-500"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="confirmPassword" className="text-lg font-semibold flex items-center gap-2">
                      <Lock className="h-5 w-5 text-purple-600" />
                      Confirm Password *
                    </Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Re-enter your password"
                      value={setupData.confirmPassword}
                      onChange={(e) => setSetupData({ ...setupData, confirmPassword: e.target.value })}
                      required
                      className="text-lg py-6 border-2 focus:border-purple-500"
                    />
                  </div>

                  <div className="flex gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setStep(1)}
                      className="flex-1 text-lg py-6 border-2"
                    >
                      Back
                    </Button>
                    <Button
                      type="submit"
                      disabled={submitting}
                      className="flex-1 text-lg py-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    >
                      {submitting ? (
                        <>
                          <div className="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                          Setting up...
                        </>
                      ) : (
                        <>
                          Complete Setup
                          <CheckCircle2 className="ml-2 h-5 w-5" />
                        </>
                      )}
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            This is a one-time setup. You'll use these credentials to access the admin dashboard.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SetupPage;
