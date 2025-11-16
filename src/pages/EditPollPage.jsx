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
import { X, Plus } from 'lucide-react';
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
          expireAt: expireAt.toISOString()
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-lg">Loading poll...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold">Edit Poll</h1>
          <p className="text-gray-600 mt-2">Update your temporary poll details</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Poll Details</CardTitle>
            <CardDescription>
              Update the details for your temporary poll
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Poll Title *</Label>
                <Input
                  id="title"
                  type="text"
                  placeholder="e.g., Customer Feedback Survey"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <textarea
                  id="description"
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm min-h-[100px]"
                  placeholder="e.g., Please share your feedback about our recent event..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label>Questions *</Label>
                  <Button type="button" variant="outline" size="sm" onClick={addQuestion}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Question
                  </Button>
                </div>
                
                {questions.map((question, index) => (
                  <div key={question.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex gap-2 items-start">
                      <div className="flex-1">
                        <Input
                          type="text"
                          placeholder={`Question ${index + 1}`}
                          value={question.text}
                          onChange={(e) => updateQuestion(question.id, 'text', e.target.value)}
                          required
                        />
                      </div>
                      {questions.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeQuestion(question.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm">Question Type</Label>
                      <select
                        value={question.type || 'text'}
                        onChange={(e) => updateQuestion(question.id, 'type', e.target.value)}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                      >
                        <option value="text">Text Field</option>
                        <option value="button">Button Options</option>
                        <option value="dropdown">Dropdown</option>
                      </select>
                    </div>

                    {(question.type === 'button' || question.type === 'dropdown') && (
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <Label className="text-sm">Options</Label>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => addOption(question.id)}
                          >
                            <Plus className="h-4 w-4 mr-1" />
                            Add Option
                          </Button>
                        </div>
                        {question.options && question.options.map((option, optionIndex) => (
                          <div key={optionIndex} className="flex gap-2">
                            <Input
                              type="text"
                              placeholder={`Option ${optionIndex + 1}`}
                              value={option}
                              onChange={(e) => updateOption(question.id, optionIndex, e.target.value)}
                              required
                            />
                            {question.options.length > 1 && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => removeOption(question.id, optionIndex)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                <Label>Expiry Date & Time *</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="relative">
                    <Input
                      type="text"
                      placeholder="Select date"
                      value={selectedDate ? selectedDate.toLocaleDateString() : ''}
                      onClick={() => setShowCalendar(!showCalendar)}
                      readOnly
                      required
                    />
                    {showCalendar && (
                      <div className="absolute z-10 mt-2 bg-white border rounded-lg shadow-lg">
                        <Calendar
                          mode="single"
                          selected={selectedDate}
                          onSelect={(date) => {
                            setSelectedDate(date);
                            setShowCalendar(false);
                          }}
                          disabled={(date) => date < new Date()}
                        />
                      </div>
                    )}
                  </div>
                  <Input
                    type="time"
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <Button type="submit" disabled={isLoading} className="flex-1">
                  {isLoading ? 'Updating...' : 'Update Poll'}
                </Button>
                <Button type="button" variant="outline" onClick={() => navigate('/dashboard')}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EditPollPage;
