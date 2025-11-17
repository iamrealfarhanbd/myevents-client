import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import config from '@/config/config';

const PublicPollPage = () => {
  const { pollId } = useParams();
  const [poll, setPoll] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [participantName, setParticipantName] = useState('');
  const [participantEmail, setParticipantEmail] = useState('');
  const [participantPhone, setParticipantPhone] = useState('');
  const [answers, setAnswers] = useState({});
  const [consentAgreed, setConsentAgreed] = useState(false);

  const API_URL = config.apiUrl;

  useEffect(() => {
    fetchPoll();
  }, [pollId]);

  const fetchPoll = async () => {
    try {
      const response = await axios.get(`${API_URL}/public/poll/${pollId}`);
      setPoll(response.data.poll);
      
      // Initialize answers object
      const initialAnswers = {};
      response.data.poll.questions.forEach(q => {
        initialAnswers[q.id] = '';
      });
      setAnswers(initialAnswers);
    } catch (error) {
      toast.error('Poll not found or has expired');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if consent is required and agreed
    if (poll.consentEnabled && !consentAgreed) {
      toast.error('Please agree to the consent terms to submit.');
      return;
    }

    setSubmitting(true);

    try {
      // Convert answers object to array format
      const answersArray = Object.entries(answers).map(([questionId, answer]) => ({
        questionId,
        answer
      }));

      await axios.post(`${API_URL}/public/submit/${pollId}`, {
        participantName,
        participantEmail,
        participantPhone,
        answers: answersArray,
        consentAgreed: poll.consentEnabled ? consentAgreed : false
      });

      toast.success('Thank you for your submission!');
      setSubmitted(true);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit poll. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-lg">Loading poll...</div>
      </div>
    );
  }

  if (!poll) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Poll Not Found</CardTitle>
            <CardDescription>
              This poll does not exist or has expired.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
        <Card className="w-full max-w-lg shadow-2xl border-0">
          <CardContent className="p-12 text-center">
            <div className="mb-6 animate-bounce">
              <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-blue-500 rounded-full mx-auto flex items-center justify-center shadow-lg">
                <span className="text-4xl">✓</span>
              </div>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Thank You! 🎉
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              Your response has been recorded successfully.
            </p>
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <p className="text-sm text-gray-700">
                We appreciate you taking the time to complete this survey. Your feedback is valuable to us!
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-block px-4 py-2 bg-blue-100 rounded-full mb-4">
            <span className="text-blue-700 text-sm font-semibold">📋 Survey</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {poll.title}
          </h1>
          {poll.description && (
            <div className="mt-4 mx-auto max-w-2xl">
              <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl shadow-sm">
                <p className="text-gray-700 text-lg leading-relaxed">{poll.description}</p>
              </div>
            </div>
          )}
        </div>

        {/* Form Card */}
        <Card className="shadow-xl border-0 overflow-hidden">
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Personal Information Section */}
              <div className="space-y-5 pb-8 border-b-2 border-gray-100">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-purple-600 font-semibold">👤</span>
                  </div>
                  <h3 className="font-bold text-xl text-gray-800">Your Information</h3>
                </div>
              
                <div className="space-y-2 group">
                  <Label htmlFor="participantName" className="text-sm font-medium text-gray-700">
                    Name *
                  </Label>
                  <Input
                    id="participantName"
                    type="text"
                    value={participantName}
                    onChange={(e) => setParticipantName(e.target.value)}
                    placeholder="Enter your full name"
                    className="transition-all duration-200 focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>

                <div className="space-y-2 group">
                  <Label htmlFor="participantEmail" className="text-sm font-medium text-gray-700">
                    Email Address *
                  </Label>
                  <Input
                    id="participantEmail"
                    type="email"
                    value={participantEmail}
                    onChange={(e) => setParticipantEmail(e.target.value)}
                    placeholder="your.email@example.com"
                    className="transition-all duration-200 focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>

                <div className="space-y-2 group">
                  <Label htmlFor="participantPhone" className="text-sm font-medium text-gray-700">
                    Phone Number <span className="text-gray-400 text-xs">(Optional)</span>
                  </Label>
                  <Input
                    id="participantPhone"
                    type="tel"
                    value={participantPhone}
                    onChange={(e) => setParticipantPhone(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className="transition-all duration-200 focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              {/* Questions Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-semibold">❓</span>
                  </div>
                  <h3 className="font-bold text-xl text-gray-800">Survey Questions</h3>
                </div>

                {poll.questions.map((question, index) => (
                  <div key={question.id} className="p-5 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200">
                    <Label htmlFor={question.id} className="text-base font-semibold text-gray-800 mb-3 block">
                      <span className="inline-flex items-center justify-center w-7 h-7 bg-blue-500 text-white rounded-full text-sm mr-2">
                        {index + 1}
                      </span>
                      {question.text}
                    </Label>
                    
                    {question.type === 'text' && (
                      <Input
                        id={question.id}
                        type="text"
                        value={answers[question.id] || ''}
                        onChange={(e) => setAnswers({ ...answers, [question.id]: e.target.value })}
                        placeholder="Type your answer here..."
                        className="mt-2 transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    )}

                    {question.type === 'button' && (
                      <div className="flex flex-wrap gap-3 mt-3">
                        {question.options && question.options.map((option, optionIndex) => (
                          <Button
                            key={optionIndex}
                            type="button"
                            variant={answers[question.id] === option ? 'default' : 'outline'}
                            onClick={() => setAnswers({ ...answers, [question.id]: option })}
                            className={`flex-1 min-w-[120px] transition-all duration-200 ${
                              answers[question.id] === option 
                                ? 'bg-gradient-to-r from-blue-500 to-purple-500 shadow-lg scale-105' 
                                : 'hover:scale-105 hover:border-blue-400'
                            }`}
                          >
                            {answers[question.id] === option && <span className="mr-2">✓</span>}
                            {option}
                          </Button>
                        ))}
                      </div>
                    )}

                    {question.type === 'dropdown' && (
                      <select
                        id={question.id}
                        value={answers[question.id] || ''}
                        onChange={(e) => setAnswers({ ...answers, [question.id]: e.target.value })}
                        className="mt-2 flex h-11 w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        required
                      >
                        <option value="">Choose an option...</option>
                        {question.options && question.options.map((option, optionIndex) => (
                          <option key={optionIndex} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                ))}
              </div>

              {/* Consent Checkbox */}
              {poll.consentEnabled && (
                <div className="pt-6 pb-4">
                  <div className="p-4 bg-gradient-to-r from-green-50 to-cyan-50 border-2 border-green-300 rounded-xl">
                    <label className="flex items-start gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={consentAgreed}
                        onChange={(e) => setConsentAgreed(e.target.checked)}
                        required
                        className="mt-1 h-5 w-5 text-green-600 rounded border-gray-300 focus:ring-green-500 focus:ring-2 cursor-pointer transition-all"
                      />
                      <span className="text-sm text-gray-800 leading-relaxed group-hover:text-gray-900 transition-colors">
                        {poll.consentText}
                      </span>
                    </label>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <div className="pt-2">
                <Button 
                  type="submit" 
                  className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105" 
                  disabled={submitting}
                >
                  {submitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="animate-spin">⏳</span> Submitting...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      Submit Survey ✨
                    </span>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-500 text-sm">
          <p>🔒 Your responses are secure and will be kept confidential</p>
        </div>
      </div>
    </div>
  );
};

export default PublicPollPage;
