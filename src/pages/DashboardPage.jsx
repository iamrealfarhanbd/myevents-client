import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import config from '@/config/config';

const DashboardPage = () => {
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();
  const navigate = useNavigate();

  const API_URL = config.apiUrl;

  useEffect(() => {
    fetchPolls();
  }, []);

  const fetchPolls = async () => {
    try {
      const response = await axios.get(`${API_URL}/polls`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setPolls(response.data.polls);
    } catch (error) {
      toast.error('Failed to fetch polls');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (pollId) => {
    if (!window.confirm('Are you sure you want to delete this poll? This action cannot be undone.')) {
      return;
    }

    try {
      await axios.delete(`${API_URL}/polls/${pollId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      toast.success('Poll deleted successfully');
      fetchPolls(); // Refresh the list
    } catch (error) {
      toast.error('Failed to delete poll');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const isExpired = (dateString) => {
    return new Date(dateString) < new Date();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold">My Polls</h1>
            <p className="text-gray-600 mt-2">Create and manage your temporary polls</p>
          </div>
          <Button onClick={() => navigate('/dashboard/create')} size="lg">
            <Plus className="mr-2 h-4 w-4" />
            Create New Poll
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-12">Loading polls...</div>
        ) : polls.length === 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>No Polls Yet</CardTitle>
              <CardDescription>
                Get started by creating your first temporary poll!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => navigate('/dashboard/create')}>
                <Plus className="mr-2 h-4 w-4" />
                Create Your First Poll
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Your Polls</CardTitle>
              <CardDescription>
                View and manage all your temporary polls
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Expires</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {polls.map((poll) => (
                    <TableRow key={poll._id}>
                      <TableCell className="font-medium">{poll.title}</TableCell>
                      <TableCell>{formatDate(poll.createdAt)}</TableCell>
                      <TableCell>{formatDate(poll.expireAt)}</TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            isExpired(poll.expireAt)
                              ? 'bg-red-100 text-red-800'
                              : 'bg-green-100 text-green-800'
                          }`}
                        >
                          {isExpired(poll.expireAt) ? 'Expired' : 'Active'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(`/dashboard/results/${poll._id}`)}
                          >
                            View Results
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(`/dashboard/edit/${poll._id}`)}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(poll._id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
