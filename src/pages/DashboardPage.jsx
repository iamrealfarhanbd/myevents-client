import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Edit2, Trash2, BarChart3, Eye, Clock, Calendar, Sparkles, TrendingUp } from 'lucide-react';
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

  const activePolls = polls.filter(poll => !isExpired(poll.expireAt));
  const expiredPolls = polls.filter(poll => isExpired(poll.expireAt));

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        {/* Header */}
        <div className="mb-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full mb-4">
                <Sparkles className="h-5 w-5 text-purple-600" />
                <span className="text-sm font-semibold text-purple-900">Dashboard</span>
              </div>
              <h1 className="text-5xl font-extrabold text-gray-900 mb-3">
                My <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Polls</span>
              </h1>
              <p className="text-xl text-gray-600">Create and manage your temporary polls</p>
            </div>
            <Button 
              onClick={() => navigate('/dashboard/create')} 
              size="lg"
              className="text-lg px-8 py-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              <Plus className="mr-2 h-5 w-5" />
              Create New Poll
            </Button>
          </div>

          {/* Stats Cards */}
          {polls.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-blue-600 mb-1">Total Polls</p>
                      <p className="text-4xl font-bold text-blue-900">{polls.length}</p>
                    </div>
                    <div className="p-4 bg-blue-500 rounded-2xl">
                      <BarChart3 className="h-8 w-8 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-green-600 mb-1">Active Polls</p>
                      <p className="text-4xl font-bold text-green-900">{activePolls.length}</p>
                    </div>
                    <div className="p-4 bg-green-500 rounded-2xl">
                      <TrendingUp className="h-8 w-8 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-gradient-to-br from-red-50 to-red-100">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-red-600 mb-1">Expired</p>
                      <p className="text-4xl font-bold text-red-900">{expiredPolls.length}</p>
                    </div>
                    <div className="p-4 bg-red-500 rounded-2xl">
                      <Clock className="h-8 w-8 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {loading ? (
          <Card className="border-0 shadow-xl">
            <CardContent className="py-20">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-purple-600 border-t-transparent mb-4"></div>
                <p className="text-gray-600 text-lg">Loading your polls...</p>
              </div>
            </CardContent>
          </Card>
        ) : polls.length === 0 ? (
          <Card className="border-0 shadow-xl bg-gradient-to-br from-blue-50 to-purple-50">
            <CardContent className="py-16">
              <div className="text-center max-w-md mx-auto">
                <div className="inline-flex p-6 bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl mb-6">
                  <BarChart3 className="h-16 w-16 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-3">No Polls Yet</h2>
                <p className="text-gray-600 mb-6 text-lg">
                  Get started by creating your first temporary poll! Share it with your audience and collect responses instantly.
                </p>
                <Button 
                  onClick={() => navigate('/dashboard/create')}
                  size="lg"
                  className="text-lg px-8 py-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-xl"
                >
                  <Plus className="mr-2 h-5 w-5" />
                  Create Your First Poll
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-0 shadow-xl bg-white/90 backdrop-blur">
            <CardHeader className="border-b bg-gradient-to-r from-blue-50 to-purple-50">
              <CardTitle className="text-2xl flex items-center gap-2">
                <BarChart3 className="h-6 w-6 text-purple-600" />
                Your Polls
              </CardTitle>
              <CardDescription className="text-base">
                View and manage all your temporary polls
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="font-bold text-gray-900">Title</TableHead>
                      <TableHead className="font-bold text-gray-900">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          Created
                        </div>
                      </TableHead>
                      <TableHead className="font-bold text-gray-900">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          Expires
                        </div>
                      </TableHead>
                      <TableHead className="font-bold text-gray-900">Status</TableHead>
                      <TableHead className="font-bold text-gray-900 text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {polls.map((poll) => (
                      <TableRow key={poll._id} className="hover:bg-blue-50/50 transition-colors">
                        <TableCell className="font-semibold text-gray-900 max-w-xs">
                          <div className="truncate">{poll.title}</div>
                          {poll.description && (
                            <div className="text-sm text-gray-500 truncate">{poll.description}</div>
                          )}
                        </TableCell>
                        <TableCell className="text-gray-600">
                          {formatDate(poll.createdAt)}
                        </TableCell>
                        <TableCell className="text-gray-600">
                          {formatDate(poll.expireAt)}
                        </TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${
                              isExpired(poll.expireAt)
                                ? 'bg-red-100 text-red-800'
                                : 'bg-green-100 text-green-800'
                            }`}
                          >
                            <div className={`w-2 h-2 rounded-full ${
                              isExpired(poll.expireAt) ? 'bg-red-500' : 'bg-green-500 animate-pulse'
                            }`}></div>
                            {isExpired(poll.expireAt) ? 'Expired' : 'Active'}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2 justify-end">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => navigate(`/dashboard/results/${poll._id}`)}
                              className="border-blue-300 text-blue-600 hover:bg-blue-50 hover:border-blue-400"
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              Results
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => navigate(`/dashboard/edit/${poll._id}`)}
                              className="border-purple-300 text-purple-600 hover:bg-purple-50 hover:border-purple-400"
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(poll._id)}
                              className="border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
