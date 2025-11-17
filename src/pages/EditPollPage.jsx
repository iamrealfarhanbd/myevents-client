import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { X, Plus, Save, FileText, ListChecks, Clock, CalendarIcon, Sparkles, Type, MousePointerClick, ChevronDown, ArrowLeft, CheckSquare } from 'lucide-react';
import config from '@/config/config';

const EditPollPage = () => {
  const { pollId } = useParams();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [questions, setQuestions] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [showCalendar, setShowCalendar] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [consentEnabled, setConsentEnabled] = useState(false);
  const [consentText, setConsentText] = useState('I agree to receive event updates and notifications.');
  const { token } = useAuth();
  const navigate = useNavigate();

  const API_URL = config.apiUrl;

  useEffect(() => {
    fetchPoll();
  }, [pollId]);

  const fetchPoll = async () => {
    try {
      const response = await axios.get(`${API_URL}/polls/${pollId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      const poll = response.data.poll;
      setTitle(poll.title);
      setDescription(poll.description || '');
      setQuestions(poll.questions);
      setConsentEnabled(poll.consentEnabled || false);
      setConsentText(poll.consentText || 'I agree to receive event updates and notifications.');
      
      // Set expiry date and time
      const expireDate = new Date(poll.expireAt);
      setSelectedDate(expireDate);
      
      const hours = expireDate.getHours().toString().padStart(2, '0');
      const minutes = expireDate.getMinutes().toString().padStart(2, '0');
      setSelectedTime(`${hours}:${minutes}`);
      
      setLoading(false);
    } catch (error) {
      toast.error('Failed to fetch poll details');
      navigate('/dashboard');
    }
  };

  const addQuestion = () => {
    const newId = (questions.length + 1).toString();
    setQuestions([...questions, { id: newId, text: '', type: 'text', options: [] }]);
  };

  const removeQuestion = (id) => {
    if (questions.length > 1) {
      setQuestions(questions.filter(q => q.id !== id));
    }
  };

  const updateQuestion = (id, field, value) => {
    setQuestions(questions.map(q => {
      if (q.id === id) {
        const updated = { ...q, [field]: value };
        // Reset options when changing type to text
        if (field === 'type' && value === 'text') {
          updated.options = [];
        }
        // Set default Yes/No options for button type if no options exist
        if (field === 'type' && value === 'button' && (!q.options || q.options.length === 0)) {
          updated.options = ['Yes', 'No'];
        }
        return updated;
      }
      return q;
    }));
  };

  const updateQuestionOptions = (id, options) => {
    setQuestions(questions.map(q => q.id === id ? { ...q, options } : q));
  };

  const addOption = (questionId) => {
    const question = questions.find(q => q.id === questionId);
    if (question) {
      updateQuestionOptions(questionId, [...(question.options || []), '']);
    }
  };

  const removeOption = (questionId, optionIndex) => {
    const question = questions.find(q => q.id === questionId);
    if (question && question.options && question.options.length > 1) {
      const newOptions = question.options.filter((_, idx) => idx !== optionIndex);
      updateQuestionOptions(questionId, newOptions);
    }
  };

  const updateOption = (questionId, optionIndex, value) => {
    const question = questions.find(q => q.id === questionId);
    if (question && question.options) {
      const newOptions = [...question.options];
      newOptions[optionIndex] = value;
      updateQuestionOptions(questionId, newOptions);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedDate || !selectedTime) {
      toast.error('Please select both date and time for expiry');
      return;
    }

    // Combine date and time
    const [hours, minutes] = selectedTime.split(':');
    const expireAt = new Date(selectedDate);
    expireAt.setHours(parseInt(hours), parseInt(minutes), 0, 0);

    if (expireAt <= new Date()) {
      toast.error('Expiry date must be in the future');
      return;
    }

    setIsLoading(true);

    try {
      await axios.put(
        `${API_URL}/polls/${pollId}`,
        {
          title,
          description,
          questions,
          expireAt: expireAt.toISOString(),
          consentEnabled,
          consentText: consentEnabled ? consentText : null
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      toast.success('Poll updated successfully!');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Failed to update poll. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const questionTypeOptions = [
    { value: 'text', label: 'Text Field', icon: Type, description: 'Free text response' },
    { value: 'button', label: 'Button Options', icon: MousePointerClick, description: 'Single choice buttons' },
    { value: 'dropdown', label: 'Dropdown', icon: ChevronDown, description: 'Select from list' }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Card className="border-0 shadow-xl p-8">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-purple-600 border-t-transparent mb-4"></div>
            <p className="text-gray-600 text-lg">Loading poll...</p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-12 max-w-5xl">
        {/* Header */}
        <div className="mb-10">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/dashboard')}
            className="mb-4 hover:bg-blue-50"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
          
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full mb-4">
              <Save className="h-5 w-5 text-purple-600" />
              <span className="text-sm font-semibold text-purple-900">Edit Mode</span>
            </div>
            <h1 className="text-5xl font-extrabold text-gray-900 mb-3">
              Edit <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Poll</span>
            </h1>
            <p className="text-xl text-gray-600">Update your poll details and questions</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 overflow-visible">
          {/* Basic Info Card */}
          <Card className="border-0 shadow-xl bg-white/90 backdrop-blur overflow-visible">
            <CardHeader className="border-b bg-gradient-to-r from-blue-50 to-purple-50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg">
                  <FileText className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-2xl">Poll Information</CardTitle>
                  <CardDescription className="text-base">Update your poll title and description</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="space-y-3">
                <Label htmlFor="title" className="text-lg font-semibold flex items-center gap-2">
                  <span>Poll Title</span>
                  <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="title"
                  type="text"
                  placeholder="e.g., Customer Feedback Survey 2024"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="text-lg py-6 border-2 focus:border-purple-500 transition-colors"
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="description" className="text-lg font-semibold">
                  Description <span className="text-gray-400 text-sm font-normal">(Optional)</span>
                </Label>
                <textarea
                  id="description"
                  className="flex w-full rounded-md border-2 border-input bg-background px-4 py-3 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:border-purple-500 disabled:cursor-not-allowed disabled:opacity-50 min-h-[120px] transition-colors"
                  placeholder="e.g., Please share your feedback about our recent event. Your responses will help us improve future experiences..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Questions Card */}
          <Card className="border-0 shadow-xl bg-white/90 backdrop-blur overflow-visible">
            <CardHeader className="border-b bg-gradient-to-r from-purple-50 to-pink-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg">
                    <ListChecks className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">Questions</CardTitle>
                    <CardDescription className="text-base">Update your poll questions</CardDescription>
                  </div>
                </div>
                <Button 
                  type="button" 
                  onClick={addQuestion}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Add Question
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              {questions.map((question, index) => (
                <div 
                  key={question.id} 
                  className="border-2 border-gray-200 rounded-xl p-6 space-y-4 bg-gradient-to-br from-gray-50 to-white hover:border-purple-300 transition-all duration-200"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="bg-gradient-to-br from-purple-600 to-pink-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">
                        {index + 1}
                      </div>
                      <span className="font-semibold text-gray-700">Question {index + 1}</span>
                    </div>
                    {questions.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeQuestion(question.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <X className="h-5 w-5 mr-1" />
                        Remove
                      </Button>
                    )}
                  </div>

                  <div className="space-y-3">
                    <Label className="text-base font-medium">Question Text *</Label>
                    <Input
                      type="text"
                      placeholder={`Enter your question here...`}
                      value={question.text}
                      onChange={(e) => updateQuestion(question.id, 'text', e.target.value)}
                      required
                      className="text-base py-5 border-2 focus:border-purple-500"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label className="text-base font-medium">Response Type *</Label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {questionTypeOptions.map((typeOption) => {
                        const Icon = typeOption.icon;
                        const isSelected = (question.type || 'text') === typeOption.value;
                        return (
                          <button
                            key={typeOption.value}
                            type="button"
                            onClick={() => updateQuestion(question.id, 'type', typeOption.value)}
                            className={`p-4 rounded-lg border-2 text-left transition-all duration-200 cursor-pointer ${
                              isSelected
                                ? 'border-purple-500 bg-purple-50 shadow-md'
                                : 'border-gray-200 hover:border-purple-300 hover:bg-gray-50'
                            }`}
                          >
                            <div className="flex items-center gap-3 mb-2">
                              <Icon className={`h-5 w-5 ${isSelected ? 'text-purple-600' : 'text-gray-400'}`} />
                              <span className={`font-semibold ${isSelected ? 'text-purple-900' : 'text-gray-700'}`}>
                                {typeOption.label}
                              </span>
                            </div>
                            <p className="text-sm text-gray-500">{typeOption.description}</p>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {(question.type === 'button' || question.type === 'dropdown') && (
                    <div className="space-y-3 pt-2">
                      <div className="flex justify-between items-center">
                        <Label className="text-base font-medium">Options *</Label>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => addOption(question.id)}
                          className="border-purple-300 text-purple-600 hover:bg-purple-50"
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Add Option
                        </Button>
                      </div>
                      <div className="space-y-2">
                        {question.options && question.options.map((option, optionIndex) => (
                          <div key={optionIndex} className="flex gap-2 items-center">
                            <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center text-xs font-bold text-purple-600">
                              {optionIndex + 1}
                            </div>
                            <Input
                              type="text"
                              placeholder={`Option ${optionIndex + 1}`}
                              value={option}
                              onChange={(e) => updateOption(question.id, optionIndex, e.target.value)}
                              required
                              className="border-2 focus:border-purple-500"
                            />
                            {question.options.length > 1 && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => removeOption(question.id, optionIndex)}
                                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Expiry Settings Card */}
          <Card className="border-0 shadow-xl bg-white/90 backdrop-blur overflow-visible">
            <CardHeader className="border-b bg-gradient-to-r from-orange-50 to-red-50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-orange-600 to-red-600 rounded-lg">
                  <Clock className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-2xl">Expiry Schedule</CardTitle>
                  <CardDescription className="text-base">Update when this poll should automatically delete</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6 pb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label className="text-base font-semibold flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4" />
                    Expiry Date *
                  </Label>
                  <div className="relative z-50">
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full justify-start text-left text-base py-6 border-2 hover:border-purple-500"
                      onClick={() => setShowCalendar(!showCalendar)}
                    >
                      <CalendarIcon className="mr-2 h-5 w-5 text-purple-600" />
                      {selectedDate ? selectedDate.toLocaleDateString('en-US', { 
                        weekday: 'short', 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric' 
                      }) : 'Select expiry date'}
                    </Button>
                    {showCalendar && (
                      <div className="absolute z-[9999] mt-2 bg-white border-2 rounded-xl shadow-2xl">
                        <Calendar
                          mode="single"
                          selected={selectedDate}
                          onSelect={(date) => {
                            setSelectedDate(date);
                            setShowCalendar(false);
                          }}
                          disabled={(date) => date < new Date()}
                          className="rounded-xl"
                        />
                      </div>
                    )}
                  </div>
                </div>
                <div className="space-y-3">
                  <Label className="text-base font-semibold flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Expiry Time *
                  </Label>
                  <Input
                    type="time"
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    required
                    className="text-base py-6 border-2 focus:border-purple-500"
                  />
                </div>
              </div>
              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-900">
                  ℹ️ <strong>Note:</strong> Your poll and all responses will be automatically and permanently deleted at the scheduled time.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Consent Feature Card */}
          <Card className="border-0 shadow-xl bg-white/90 backdrop-blur mt-8">
            <CardHeader className="border-b bg-gradient-to-r from-green-50 to-cyan-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-green-600 to-cyan-600 rounded-lg">
                    <CheckSquare className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">Consent Agreement</CardTitle>
                    <CardDescription className="text-base">Add optional consent checkbox for participants</CardDescription>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setConsentEnabled(!consentEnabled)}
                  className="relative inline-flex items-center cursor-pointer"
                >
                  <div className={`w-14 h-7 rounded-full transition-colors duration-200 ${
                    consentEnabled ? 'bg-gradient-to-r from-green-500 to-cyan-500' : 'bg-gray-300'
                  }`}>
                    <div className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-200 ${
                      consentEnabled ? 'translate-x-7' : 'translate-x-0'
                    }`}></div>
                  </div>
                  <span className="ml-3 text-sm font-medium text-gray-700">
                    {consentEnabled ? 'Enabled' : 'Disabled'}
                  </span>
                </button>
              </div>
            </CardHeader>
            {consentEnabled && (
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="space-y-3">
                    <Label htmlFor="consentText" className="text-base font-semibold">
                      Consent Text *
                    </Label>
                    <textarea
                      id="consentText"
                      className="flex w-full rounded-md border-2 border-input bg-background px-4 py-3 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:border-green-500 disabled:cursor-not-allowed disabled:opacity-50 min-h-[100px] transition-colors"
                      placeholder="Enter the consent message that participants must agree to..."
                      value={consentText}
                      onChange={(e) => setConsentText(e.target.value)}
                    />
                    <p className="text-sm text-gray-500">
                      This text will appear as a required checkbox above the submit button on the poll form.
                    </p>
                  </div>
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm font-semibold text-green-900 mb-2">Preview:</p>
                    <div className="flex items-start gap-3 p-3 bg-white rounded border border-green-200">
                      <input 
                        type="checkbox" 
                        checked 
                        readOnly
                        className="mt-1 h-4 w-4 text-green-600 rounded border-gray-300 cursor-pointer"
                      />
                      <span className="text-sm text-gray-700">{consentText}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            )}
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-center pt-4">
            <Button 
              type="submit" 
              disabled={isLoading}
              size="lg"
              className="text-lg px-10 py-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              {isLoading ? (
                <>
                  <Clock className="mr-2 h-5 w-5 animate-spin" />
                  Updating Poll...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-5 w-5" />
                  Update Poll
                </>
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={() => navigate('/dashboard')}
              className="text-lg px-10 py-6 border-2 hover:bg-gray-50"
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPollPage;
