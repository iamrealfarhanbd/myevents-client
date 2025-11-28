import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Download, 
  Upload, 
  Trash2, 
  AlertTriangle,
  FileJson,
  Shield,
  Database
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import config from '@/config/config';

const AccountSettingsPage = () => {
  const { token, user, logout } = useAuth();
  const navigate = useNavigate();
  
  // Export state
  const [exporting, setExporting] = useState(false);
  
  // Import state
  const [importing, setImporting] = useState(false);
  const [importFile, setImportFile] = useState(null);
  const [replaceExisting, setReplaceExisting] = useState(false);
  
  // Delete account state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [deleting, setDeleting] = useState(false);

  // Export backup
  const handleExportBackup = async () => {
    try {
      setExporting(true);
      const response = await axios.post(
        `${config.apiUrl}/auth/export-backup`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        // Convert backup to JSON and download
        const dataStr = JSON.stringify(response.data.backup, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = response.data.filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        toast.success('Backup exported successfully!');
      }
    } catch (error) {
      console.error('Export error:', error);
      toast.error(error.response?.data?.message || 'Failed to export backup');
    } finally {
      setExporting(false);
    }
  };

  // Handle file selection
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type !== 'application/json') {
        toast.error('Please select a valid JSON backup file');
        return;
      }
      setImportFile(file);
    }
  };

  // Import backup
  const handleImportBackup = async () => {
    if (!importFile) {
      toast.error('Please select a backup file');
      return;
    }

    try {
      setImporting(true);
      
      // Read file content
      const fileContent = await importFile.text();
      const backup = JSON.parse(fileContent);

      const response = await axios.post(
        `${config.apiUrl}/auth/import-backup`,
        { backup, replaceExisting },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        toast.success(`Imported: ${response.data.imported.polls} polls, ${response.data.imported.venues} venues, ${response.data.imported.bookings} bookings`);
        setImportFile(null);
        setReplaceExisting(false);
        
        // Refresh the page to show new data
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      }
    } catch (error) {
      console.error('Import error:', error);
      toast.error(error.response?.data?.message || 'Failed to import backup');
    } finally {
      setImporting(false);
    }
  };

  // Delete account
  const handleDeleteAccount = async () => {
    if (!deletePassword) {
      toast.error('Please enter your password');
      return;
    }

    if (deleteConfirmText !== 'DELETE MY ACCOUNT') {
      toast.error('Please type "DELETE MY ACCOUNT" to confirm');
      return;
    }

    try {
      setDeleting(true);
      const response = await axios.post(
        `${config.apiUrl}/auth/delete-account`,
        { 
          confirmPassword: deletePassword,
          confirmText: deleteConfirmText
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        toast.success('Account deleted successfully');
        logout();
        navigate('/');
      }
    } catch (error) {
      console.error('Delete account error:', error);
      toast.error(error.response?.data?.message || 'Failed to delete account');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Account Settings</h1>
        <p className="text-gray-600 mt-1">Manage your account, backup data, and preferences</p>
      </div>

      {/* Account Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-600" />
            Account Information
          </CardTitle>
          <CardDescription>Your account details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-sm text-gray-600">Name</Label>
            <p className="text-lg font-medium">{user?.name}</p>
          </div>
          <div>
            <Label className="text-sm text-gray-600">Email</Label>
            <p className="text-lg font-medium">{user?.email}</p>
          </div>
        </CardContent>
      </Card>

      {/* Export Backup */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5 text-green-600" />
            Export Backup
          </CardTitle>
          <CardDescription>
            Download all your data as a JSON file for safekeeping
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-start gap-4 p-4 bg-green-50 rounded-lg border border-green-200">
            <FileJson className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
            <div className="flex-1">
              <p className="text-sm text-gray-700 mb-3">
                Exports all your polls, venues, bookings, submissions, and settings into a single JSON file.
                You can use this to restore your data later or transfer it to another account.
              </p>
              <Button 
                onClick={handleExportBackup}
                disabled={exporting}
                className="bg-green-600 hover:bg-green-700"
              >
                {exporting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Exporting...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    Export All Data
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Import Backup */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5 text-blue-600" />
            Import Backup
          </CardTitle>
          <CardDescription>
            Restore your data from a previously exported backup file
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="backup-file">Select Backup File</Label>
              <Input
                id="backup-file"
                type="file"
                accept=".json"
                onChange={handleFileSelect}
                className="mt-1"
              />
              {importFile && (
                <p className="text-sm text-green-600 mt-2">
                  ✓ Selected: {importFile.name}
                </p>
              )}
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="replace-existing"
                checked={replaceExisting}
                onChange={(e) => setReplaceExisting(e.target.checked)}
                className="rounded"
              />
              <Label htmlFor="replace-existing" className="font-normal">
                Replace existing data (Warning: This will delete all current data first)
              </Label>
            </div>

            <Button 
              onClick={handleImportBackup}
              disabled={!importFile || importing}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {importing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Importing...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Import Backup
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone - Delete Account */}
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            Danger Zone
          </CardTitle>
          <CardDescription>
            Permanent actions that cannot be undone
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!showDeleteModal ? (
            <div className="p-4 bg-red-50 rounded-lg border border-red-200">
              <div className="flex items-start gap-4">
                <Trash2 className="h-6 w-6 text-red-600 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h3 className="font-semibold text-red-900 mb-1">Delete Account</h3>
                  <p className="text-sm text-gray-700 mb-3">
                    Permanently delete your account and all associated data. This action cannot be undone.
                    Make sure to export a backup first if you want to keep your data.
                  </p>
                  <Button 
                    variant="destructive"
                    onClick={() => setShowDeleteModal(true)}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete My Account
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4 p-4 bg-red-50 rounded-lg border-2 border-red-300">
              <div className="flex items-center gap-2 text-red-700 font-semibold">
                <AlertTriangle className="h-5 w-5" />
                <span>Are you absolutely sure?</span>
              </div>
              
              <div className="space-y-3">
                <div>
                  <Label htmlFor="delete-password" className="text-red-900">
                    Enter your password to confirm
                  </Label>
                  <Input
                    id="delete-password"
                    type="password"
                    value={deletePassword}
                    onChange={(e) => setDeletePassword(e.target.value)}
                    placeholder="Your password"
                    className="mt-1 border-red-300"
                  />
                </div>

                <div>
                  <Label htmlFor="delete-confirm" className="text-red-900">
                    Type "DELETE MY ACCOUNT" to confirm
                  </Label>
                  <Input
                    id="delete-confirm"
                    type="text"
                    value={deleteConfirmText}
                    onChange={(e) => setDeleteConfirmText(e.target.value)}
                    placeholder="DELETE MY ACCOUNT"
                    className="mt-1 border-red-300"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowDeleteModal(false);
                    setDeletePassword('');
                    setDeleteConfirmText('');
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDeleteAccount}
                  disabled={deleting || !deletePassword || deleteConfirmText !== 'DELETE MY ACCOUNT'}
                  className="flex-1 bg-red-600 hover:bg-red-700"
                >
                  {deleting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Yes, Delete Everything
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AccountSettingsPage;
