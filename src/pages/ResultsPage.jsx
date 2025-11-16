import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import { QRCodeSVG } from 'qrcode.react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Copy, Download, ArrowLeft } from 'lucide-react';
import config from '@/config/config';

const ResultsPage = () => {
  const { pollId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();
  const navigate = useNavigate();

  const API_URL = config.apiUrl;
  const PUBLIC_URL = config.publicUrl;

  useEffect(() => {
    fetchResults();
  }, [pollId]);

  const fetchResults = async () => {
    try {
      const response = await axios.get(`${API_URL}/results/${pollId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setData(response.data);
    } catch (error) {
      toast.error('Failed to fetch results');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const copyLink = () => {
    const link = `${PUBLIC_URL}/poll/${pollId}`;
    navigator.clipboard.writeText(link);
    toast.success('Link copied to clipboard!');
  };

  const downloadCSV = () => {
    if (!data || !data.submissions || data.submissions.length === 0) {
      toast.error('No submissions to export');
      return;
    }

    // Create CSV header
    const headers = ['Submission Time', 'Name', 'Email', 'Phone', ...data.poll.questions.map((q, i) => `Question ${i + 1}`)];
    
    // Create CSV rows
    const rows = data.submissions.map(submission => {
      const row = [
        new Date(submission.submittedAt).toLocaleString(),
        submission.participantName || '',
        submission.participantEmail || '',
        submission.participantPhone || ''
      ];
      
      // Match answers to questions
      data.poll.questions.forEach(question => {
        const answer = submission.answers.find(a => a.questionId === question.id);
        row.push(answer ? answer.answer : '');
      });
      
      return row;
    });

    // Combine headers and rows
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `poll-results-${pollId}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    toast.success('CSV downloaded successfully!');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-lg">Loading results...</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Card>
          <CardHeader>
            <CardTitle>Results Not Found</CardTitle>
            <CardDescription>This poll does not exist or has expired.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const publicLink = `${PUBLIC_URL}/poll/${pollId}`;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <Button variant="ghost" onClick={() => navigate('/dashboard')} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
          <h1 className="text-4xl font-bold">{data.poll.title}</h1>
          {data.poll.description && (
            <p className="text-gray-700 mt-3 text-lg">{data.poll.description}</p>
          )}
          <p className="text-gray-600 mt-2">
            Created: {new Date(data.poll.createdAt).toLocaleString()} | 
            Expires: {new Date(data.poll.expireAt).toLocaleString()}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Share Poll</CardTitle>
              <CardDescription>Share this link with participants</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <Input
                  value={publicLink}
                  readOnly
                  className="flex-1 text-sm"
                />
                <Button size="icon" variant="outline" onClick={copyLink}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex justify-center">
                <QRCodeSVG value={publicLink} size={150} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Total Submissions</CardTitle>
              <CardDescription>Number of responses received</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">{data.totalSubmissions}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Export Data</CardTitle>
              <CardDescription>Download submissions as CSV</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={downloadCSV} className="w-full">
                <Download className="mr-2 h-4 w-4" />
                Download CSV
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Results</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="summary">
              <TabsList>
                <TabsTrigger value="summary">Summary</TabsTrigger>
                <TabsTrigger value="submissions">All Submissions</TabsTrigger>
              </TabsList>

              <TabsContent value="summary" className="space-y-4">
                <div className="text-lg font-semibold mb-4">
                  Total Responses: {data.totalSubmissions}
                </div>
                {data.poll.questions.map((question, index) => (
                  <div key={question.id} className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-medium mb-2">
                      {index + 1}. {question.text}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {data.submissions.length} response(s)
                    </p>
                  </div>
                ))}
              </TabsContent>

              <TabsContent value="submissions">
                {data.submissions.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No submissions yet
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Submitted At</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Phone</TableHead>
                        {data.poll.questions.map((q, i) => (
                          <TableHead key={q.id}>Question {i + 1}</TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data.submissions.map((submission) => (
                        <TableRow key={submission._id}>
                          <TableCell>
                            {new Date(submission.submittedAt).toLocaleString()}
                          </TableCell>
                          <TableCell>{submission.participantName || '-'}</TableCell>
                          <TableCell>{submission.participantEmail || '-'}</TableCell>
                          <TableCell>{submission.participantPhone || '-'}</TableCell>
                          {data.poll.questions.map((question) => {
                            const answer = submission.answers.find(
                              (a) => a.questionId === question.id
                            );
                            return (
                              <TableCell key={question.id}>
                                {answer ? answer.answer : '-'}
                              </TableCell>
                            );
                          })}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Simple Input component for the share link
const Input = ({ className, ...props }) => {
  return (
    <input
      className={`flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ${className}`}
      {...props}
    />
  );
};

export default ResultsPage;
