import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import { QRCodeSVG } from 'qrcode.react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Copy, Download, ArrowLeft, Printer, FileDown, Sparkles, BarChart3, Users, Clock, Calendar, Share2, QrCode, ExternalLink } from 'lucide-react';
import config from '@/config/config';

const ResultsPage = () => {
  const { pollId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();
  const navigate = useNavigate();
  const qrCodeRef = useRef(null);

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

  const downloadQRCode = () => {
    const svg = qrCodeRef.current.querySelector('svg');
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    canvas.width = 400;
    canvas.height = 400;
    
    img.onload = () => {
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, 400, 400);
      
      canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `poll-qr-code-${pollId}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toast.success('QR Code downloaded!');
      });
    };
    
    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  const downloadQRAsPDF = () => {
    const publicLink = `${PUBLIC_URL}/poll/${pollId}`;
    
    // Create a printable window
    const printWindow = window.open('', '_blank');
    const svg = qrCodeRef.current.querySelector('svg');
    const svgData = new XMLSerializer().serializeToString(svg);
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Poll QR Code - ${data.poll.title}</title>
          <style>
            @media print {
              @page { 
                size: A4; 
                margin: 20mm; 
              }
              body {
                margin: 0;
                padding: 0;
              }
            }
            body {
              font-family: Arial, sans-serif;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              min-height: 100vh;
              padding: 40px;
              text-align: center;
            }
            .container {
              max-width: 600px;
              border: 2px solid #3b82f6;
              border-radius: 16px;
              padding: 40px;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }
            h1 {
              color: #1e40af;
              margin-bottom: 10px;
              font-size: 32px;
            }
            .description {
              color: #64748b;
              margin-bottom: 30px;
              font-size: 16px;
            }
            .qr-container {
              background: white;
              padding: 20px;
              border-radius: 12px;
              display: inline-block;
              margin: 20px 0;
            }
            .qr-code {
              width: 300px;
              height: 300px;
            }
            .link {
              color: #3b82f6;
              word-break: break-all;
              font-size: 14px;
              margin-top: 20px;
              padding: 15px;
              background: #eff6ff;
              border-radius: 8px;
              font-family: monospace;
            }
            .instructions {
              margin-top: 30px;
              color: #475569;
              font-size: 14px;
              line-height: 1.6;
            }
            .footer {
              margin-top: 40px;
              padding-top: 20px;
              border-top: 2px solid #e2e8f0;
              color: #94a3b8;
              font-size: 12px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>📋 ${data.poll.title}</h1>
            ${data.poll.description ? `<p class="description">${data.poll.description}</p>` : ''}
            
            <div class="qr-container">
              <div class="qr-code">
                ${svgData}
              </div>
            </div>
            
            <div class="link">
              ${publicLink}
            </div>
            
            <div class="instructions">
              <strong>How to use:</strong><br>
              1. Scan this QR code with your mobile device<br>
              2. Or visit the link above in your browser<br>
              3. Fill out the survey and submit your response
            </div>
            
            <div class="footer">
              Poll expires: ${new Date(data.poll.expireAt).toLocaleString()}<br>
              Generated by MyEvents - Temporary Poll Platform
            </div>
          </div>
        </body>
      </html>
    `);
    
    printWindow.document.close();
    
    // Wait for content to load then trigger print
    setTimeout(() => {
      printWindow.print();
      toast.success('Print dialog opened!');
    }, 250);
  };

  const printQRCode = () => {
    downloadQRAsPDF();
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
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Card className="border-0 shadow-xl p-8">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-purple-600 border-t-transparent mb-4"></div>
            <p className="text-gray-600 text-lg">Loading results...</p>
          </div>
        </Card>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Card className="border-0 shadow-xl max-w-md">
          <CardContent className="pt-16 pb-16 text-center">
            <div className="inline-flex p-6 bg-red-100 rounded-3xl mb-6">
              <BarChart3 className="h-16 w-16 text-red-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Results Not Found</h2>
            <p className="text-gray-600 mb-6">This poll does not exist or has expired.</p>
            <Button onClick={() => navigate('/dashboard')} className="bg-gradient-to-r from-blue-600 to-purple-600">
              Go to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const publicLink = `${PUBLIC_URL}/poll/${pollId}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        {/* Header */}
        <div className="mb-10">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/dashboard')} 
            className="mb-6 hover:bg-blue-50"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
          
          <div className="bg-white/90 backdrop-blur rounded-2xl shadow-xl p-8 border-0">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full mb-4">
              <BarChart3 className="h-5 w-5 text-purple-600" />
              <span className="text-sm font-semibold text-purple-900">Poll Results</span>
            </div>
            
            <h1 className="text-5xl font-extrabold text-gray-900 mb-4">
              {data.poll.title}
            </h1>
            {data.poll.description && (
              <p className="text-gray-700 text-xl mb-6 leading-relaxed">{data.poll.description}</p>
            )}
            <div className="flex flex-wrap gap-6 text-gray-600">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-600" />
                <span>Created: {new Date(data.poll.createdAt).toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-orange-600" />
                <span>Expires: {new Date(data.poll.expireAt).toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-green-600" />
                <span className="font-semibold">{data.submissions.length} Responses</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="border-0 shadow-xl bg-white/90 backdrop-blur lg:col-span-1">
            <CardHeader className="border-b bg-gradient-to-r from-blue-50 to-purple-50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg">
                  <Share2 className="h-5 w-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl">Share Poll</CardTitle>
                  <CardDescription>Send to participants</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Public Link</label>
                <div className="flex items-center gap-2">
                  <Input
                    value={publicLink}
                    readOnly
                    className="flex-1 text-sm border-2"
                  />
                  <Button size="icon" variant="outline" onClick={copyLink} title="Copy link" className="border-2 hover:bg-blue-50">
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="border-2 border-purple-300 rounded-xl p-6 bg-gradient-to-br from-blue-50 to-purple-50">
                <div ref={qrCodeRef} className="flex justify-center mb-3">
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <QRCodeSVG value={publicLink} size={180} />
                  </div>
                </div>
                
                <div className="flex gap-2 justify-center">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={printQRCode}
                    className="flex items-center gap-2"
                  >
                    <Printer className="h-4 w-4" />
                    Print
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={downloadQRCode}
                    className="flex items-center gap-2"
                  >
                    <FileDown className="h-4 w-4" />
                    Download PNG
                  </Button>
                </div>
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
const ShareLinkInput = ({ className, ...props }) => {
  return (
    <ShareLinkInput
      className={`flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ${className}`}
      {...props}
    />
  );
};

export default ResultsPage;
