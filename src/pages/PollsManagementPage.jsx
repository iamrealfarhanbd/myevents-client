import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  BarChart3, 
  Search,
  Clock,
  CheckCircle,
  XCircle,
  Eye
} from 'lucide-react';
import config from '@/config/config';

const PollsManagementPage = () => {
  const [polls, setPolls] = useState([]);
  const [filteredPolls, setFilteredPolls] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // all, active, expired
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchPolls();
  }, []);

  useEffect(() => {
    filterPolls();
  }, [polls, searchQuery, filterStatus]);

  const fetchPolls = async () => {
    try {
      const response = await axios.get(`${config.apiUrl}/polls`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPolls(response.data.polls);
    } catch (error) {
      toast.error('Failed to fetch polls');
    } finally {
      setLoading(false);
    }
  };

  const filterPolls = () => {
    let filtered = [...polls];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(poll =>
        poll.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        poll.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Status filter
    if (filterStatus !== 'all') {
      const now = new Date();
      if (filterStatus === 'active') {
        filtered = filtered.filter(poll => new Date(poll.expireAt) > now);
      } else if (filterStatus === 'expired') {
        filtered = filtered.filter(poll => new Date(poll.expireAt) <= now);
      }
    }

    setFilteredPolls(filtered);
  };

  const handleDelete = async (pollId) => {
    if (!window.confirm('Are you sure you want to delete this poll?')) return;

    try {
      await axios.delete(`${config.apiUrl}/polls/${pollId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Poll deleted successfully');
      fetchPolls();
    } catch (error) {
      toast.error('Failed to delete poll');
    }
  };

  const isExpired = (dateString) => new Date(dateString) < new Date();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Polls</h1>
          <p className="text-gray-600 mt-1">Manage all your polls in one place</p>
        </div>
        <Button
          onClick={() => navigate('/dashboard/create')}
          className="bg-gradient-to-r from-blue-600 to-purple-600"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Poll
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search polls..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Status Filter */}
            <div className="flex gap-2">
              <Button
                variant={filterStatus === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus('all')}
              >
                All ({polls.length})
              </Button>
              <Button
                variant={filterStatus === 'active' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus('active')}
                className={filterStatus === 'active' ? 'bg-green-600' : ''}
              >
                <CheckCircle className="h-4 w-4 mr-1" />
                Active ({polls.filter(p => !isExpired(p.expireAt)).length})
              </Button>
              <Button
                variant={filterStatus === 'expired' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus('expired')}
                className={filterStatus === 'expired' ? 'bg-gray-600' : ''}
              >
                <XCircle className="h-4 w-4 mr-1" />
                Expired ({polls.filter(p => isExpired(p.expireAt)).length})
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Polls Grid */}
      {filteredPolls.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No polls found</h3>
            <p className="text-gray-600 mb-6">
              {searchQuery || filterStatus !== 'all'
                ? 'Try adjusting your filters'
                : 'Create your first poll to get started'}
            </p>
            {!searchQuery && filterStatus === 'all' && (
              <Button onClick={() => navigate('/dashboard/create')}>
                <Plus className="h-4 w-4 mr-2" />
                Create Poll
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPolls.map((poll) => {
            const expired = isExpired(poll.expireAt);
            return (
              <Card key={poll._id} className="hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  {/* Status Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        expired
                          ? 'bg-gray-100 text-gray-600'
                          : 'bg-green-100 text-green-600'
                      }`}
                    >
                      {expired ? 'Expired' : 'Active'}
                    </span>
                    <span className="text-sm text-gray-500">
                      {poll.responses?.length || 0} responses
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2">
                    {poll.title}
                  </h3>
                  {poll.description && (
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {poll.description}
                    </p>
                  )}

                  {/* Meta Info */}
                  <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
                    <Clock className="h-3 w-3" />
                    <span>
                      Expires: {new Date(poll.expireAt).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="grid grid-cols-3 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(`/poll/${poll._id}`, '_blank')}
                      className="w-full"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/dashboard/edit/${poll._id}`)}
                      className="w-full"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/dashboard/results/${poll._id}`)}
                      className="w-full bg-purple-50 hover:bg-purple-100 border-purple-200"
                    >
                      <BarChart3 className="h-4 w-4 text-purple-600" />
                    </Button>
                  </div>

                  {/* Delete Button */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(poll._id)}
                    className="w-full mt-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PollsManagementPage;
