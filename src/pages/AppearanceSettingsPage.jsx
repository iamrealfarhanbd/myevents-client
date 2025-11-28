import { useState, useEffect } from 'react';
import { useSettings } from '@/context/SettingsContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Palette, Type, Image, Globe, Mail, Phone, MapPin, Facebook, Instagram, Twitter, Linkedin, Save, RefreshCw, X } from 'lucide-react';
import toast from 'react-hot-toast';

const AppearanceSettingsPage = () => {
  const { settings, updateSettings, fetchSettings } = useSettings();
  const [formData, setFormData] = useState({});
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState({ logo: false, favicon: false });

  useEffect(() => {
    setFormData(settings);
  }, [settings]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = async (field, file) => {
    if (!file) return;
    
    // Validate file type
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/svg+xml', 'image/x-icon'];
    if (!validTypes.includes(file.type)) {
      toast.error('Please upload a valid image file (PNG, JPG, GIF, SVG, or ICO)');
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error('File size should be less than 2MB');
      return;
    }

    setUploading(prev => ({ ...prev, [field]: true }));

    try {
      // Convert to base64
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        handleChange(field, base64String);
        toast.success(`${field === 'logo' ? 'Logo' : 'Favicon'} uploaded! Remember to save changes.`);
        setUploading(prev => ({ ...prev, [field]: false }));
      };
      reader.onerror = () => {
        toast.error('Failed to read file');
        setUploading(prev => ({ ...prev, [field]: false }));
      };
      reader.readAsDataURL(file);
    } catch (error) {
      toast.error('Failed to upload file');
      setUploading(prev => ({ ...prev, [field]: false }));
    }
  };

  const handleSave = async () => {
    setSaving(true);
    const result = await updateSettings(formData);
    
    if (result.success) {
      toast.success('Settings saved successfully! Changes applied.');
    } else {
      toast.error(result.message);
    }
    
    setSaving(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Appearance Settings</h1>
          <p className="text-gray-600">Customize your site's look, feel, and branding</p>
        </div>

        <Tabs defaultValue="branding" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5 gap-2">
            <TabsTrigger value="branding" className="flex items-center gap-2">
              <Image className="h-4 w-4" />
              <span className="hidden sm:inline">Branding</span>
            </TabsTrigger>
            <TabsTrigger value="colors" className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              <span className="hidden sm:inline">Colors</span>
            </TabsTrigger>
            <TabsTrigger value="typography" className="flex items-center gap-2">
              <Type className="h-4 w-4" />
              <span className="hidden sm:inline">Typography</span>
            </TabsTrigger>
            <TabsTrigger value="business" className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              <span className="hidden sm:inline">Business Info</span>
            </TabsTrigger>
            <TabsTrigger value="social" className="flex items-center gap-2">
              <Facebook className="h-4 w-4" />
              <span className="hidden sm:inline">Social Media</span>
            </TabsTrigger>
          </TabsList>

          {/* Branding Tab */}
          <TabsContent value="branding">
            <Card>
              <CardHeader>
                <CardTitle>Branding & Logo</CardTitle>
                <CardDescription>Upload your logo and customize your brand identity</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="businessName">Business Name *</Label>
                  <Input
                    id="businessName"
                    value={formData.businessName || ''}
                    onChange={(e) => handleChange('businessName', e.target.value)}
                    placeholder="Enter your business name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="businessDescription">Business Description</Label>
                  <Textarea
                    id="businessDescription"
                    value={formData.businessDescription || ''}
                    onChange={(e) => handleChange('businessDescription', e.target.value)}
                    placeholder="Brief description of your business"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="logo">Logo Upload</Label>
                  <div className="flex items-center gap-3">
                    <Input
                      id="logo"
                      type="file"
                      accept="image/png,image/jpeg,image/jpg,image/gif,image/svg+xml"
                      onChange={(e) => handleFileUpload('logo', e.target.files[0])}
                      disabled={uploading.logo}
                      className="cursor-pointer"
                    />
                    {uploading.logo && (
                      <div className="flex items-center gap-2 text-sm text-blue-600">
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        Uploading...
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">Upload your logo (PNG, JPG, GIF, SVG - Max 2MB)</p>
                  
                  {/* Show Business Name Toggle */}
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg mt-3">
                    <input
                      type="checkbox"
                      id="showBusinessNameInHeader"
                      checked={formData.showBusinessNameInHeader === undefined || formData.showBusinessNameInHeader === null ? true : Boolean(formData.showBusinessNameInHeader)}
                      onChange={(e) => handleChange('showBusinessNameInHeader', e.target.checked)}
                      className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-2 focus:ring-blue-500 cursor-pointer"
                    />
                    <Label htmlFor="showBusinessNameInHeader" className="cursor-pointer mb-0">
                      Show business name text next to logo in header
                    </Label>
                  </div>
                  {formData.showBusinessNameInHeader !== undefined && (
                    <p className="text-xs text-gray-500 mt-1 ml-7">
                      Current value: {formData.showBusinessNameInHeader ? 'Enabled' : 'Disabled'}
                    </p>
                  )}
                  {formData.logo && (
                    <div className="mt-4 p-4 border-2 border-dashed border-gray-300 rounded-lg bg-white relative">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleChange('logo', '')}
                        className="absolute top-2 right-2 h-8 w-8 p-0 hover:bg-red-100 hover:text-red-600"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                      <p className="text-sm font-medium mb-3 text-gray-700">Logo Preview:</p>
                      <div className="flex items-center justify-center bg-gray-50 p-4 rounded">
                        <img src={formData.logo} alt="Logo preview" className="h-20 w-auto object-contain" />
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="favicon">Favicon Upload</Label>
                  <div className="flex items-center gap-3">
                    <Input
                      id="favicon"
                      type="file"
                      accept="image/png,image/x-icon,image/jpeg,image/jpg"
                      onChange={(e) => handleFileUpload('favicon', e.target.files[0])}
                      disabled={uploading.favicon}
                      className="cursor-pointer"
                    />
                    {uploading.favicon && (
                      <div className="flex items-center gap-2 text-sm text-blue-600">
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        Uploading...
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">Browser tab icon (32x32px recommended - PNG, ICO, JPG)</p>
                  {formData.favicon && (
                    <div className="mt-4 p-4 border-2 border-dashed border-gray-300 rounded-lg bg-white relative">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleChange('favicon', '')}
                        className="absolute top-2 right-2 h-8 w-8 p-0 hover:bg-red-100 hover:text-red-600"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                      <p className="text-sm font-medium mb-3 text-gray-700">Favicon Preview:</p>
                      <div className="flex items-center justify-center bg-gray-50 p-4 rounded">
                        <img src={formData.favicon} alt="Favicon preview" className="h-8 w-8 object-contain" />
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="metaTitle">Page Title (SEO)</Label>
                  <Input
                    id="metaTitle"
                    value={formData.metaTitle || ''}
                    onChange={(e) => handleChange('metaTitle', e.target.value)}
                    placeholder="Appears in browser tab and search results"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Colors Tab */}
          <TabsContent value="colors">
            <Card>
              <CardHeader>
                <CardTitle>Color Scheme</CardTitle>
                <CardDescription>Customize your brand colors</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="primaryColor">Primary Color</Label>
                    <div className="flex gap-2">
                      <Input
                        type="color"
                        id="primaryColor"
                        value={formData.primaryColor || '#7c3aed'}
                        onChange={(e) => handleChange('primaryColor', e.target.value)}
                        className="w-20 h-10"
                      />
                      <Input
                        value={formData.primaryColor || '#7c3aed'}
                        onChange={(e) => handleChange('primaryColor', e.target.value)}
                        placeholder="#7c3aed"
                        className="flex-1"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="secondaryColor">Secondary Color</Label>
                    <div className="flex gap-2">
                      <Input
                        type="color"
                        id="secondaryColor"
                        value={formData.secondaryColor || '#3b82f6'}
                        onChange={(e) => handleChange('secondaryColor', e.target.value)}
                        className="w-20 h-10"
                      />
                      <Input
                        value={formData.secondaryColor || '#3b82f6'}
                        onChange={(e) => handleChange('secondaryColor', e.target.value)}
                        placeholder="#3b82f6"
                        className="flex-1"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="accentColor">Accent Color</Label>
                    <div className="flex gap-2">
                      <Input
                        type="color"
                        id="accentColor"
                        value={formData.accentColor || '#ec4899'}
                        onChange={(e) => handleChange('accentColor', e.target.value)}
                        className="w-20 h-10"
                      />
                      <Input
                        value={formData.accentColor || '#ec4899'}
                        onChange={(e) => handleChange('accentColor', e.target.value)}
                        placeholder="#ec4899"
                        className="flex-1"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="backgroundColor">Background Color</Label>
                    <div className="flex gap-2">
                      <Input
                        type="color"
                        id="backgroundColor"
                        value={formData.backgroundColor || '#ffffff'}
                        onChange={(e) => handleChange('backgroundColor', e.target.value)}
                        className="w-20 h-10"
                      />
                      <Input
                        value={formData.backgroundColor || '#ffffff'}
                        onChange={(e) => handleChange('backgroundColor', e.target.value)}
                        placeholder="#ffffff"
                        className="flex-1"
                      />
                    </div>
                  </div>
                </div>

                <div className="p-6 rounded-lg border bg-white">
                  <p className="text-sm font-medium mb-4">Color Preview:</p>
                  <div className="flex gap-3">
                    <div className="flex-1 p-4 rounded-lg text-white text-center font-medium" style={{ backgroundColor: formData.primaryColor }}>
                      Primary
                    </div>
                    <div className="flex-1 p-4 rounded-lg text-white text-center font-medium" style={{ backgroundColor: formData.secondaryColor }}>
                      Secondary
                    </div>
                    <div className="flex-1 p-4 rounded-lg text-white text-center font-medium" style={{ backgroundColor: formData.accentColor }}>
                      Accent
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Typography Tab */}
          <TabsContent value="typography">
            <Card>
              <CardHeader>
                <CardTitle>Typography</CardTitle>
                <CardDescription>Customize fonts and text styles</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="fontFamily">Font Family</Label>
                  <select
                    id="fontFamily"
                    value={formData.fontFamily || 'Inter, system-ui, sans-serif'}
                    onChange={(e) => handleChange('fontFamily', e.target.value)}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="Inter, system-ui, sans-serif">Inter (Default)</option>
                    <option value="'Roboto', sans-serif">Roboto</option>
                    <option value="'Open Sans', sans-serif">Open Sans</option>
                    <option value="'Poppins', sans-serif">Poppins</option>
                    <option value="'Montserrat', sans-serif">Montserrat</option>
                    <option value="'Lato', sans-serif">Lato</option>
                    <option value="Georgia, serif">Georgia (Serif)</option>
                    <option value="'Playfair Display', serif">Playfair Display</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fontSize">Font Size</Label>
                  <select
                    id="fontSize"
                    value={formData.fontSize || 'medium'}
                    onChange={(e) => handleChange('fontSize', e.target.value)}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="small">Small</option>
                    <option value="medium">Medium (Default)</option>
                    <option value="large">Large</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="borderRadius">Border Radius</Label>
                  <select
                    id="borderRadius"
                    value={formData.borderRadius || 'medium'}
                    onChange={(e) => handleChange('borderRadius', e.target.value)}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="none">None (Sharp corners)</option>
                    <option value="small">Small</option>
                    <option value="medium">Medium (Default)</option>
                    <option value="large">Large (Rounded)</option>
                  </select>
                </div>

                <div className="p-6 rounded-lg border bg-white">
                  <p className="text-sm font-medium mb-4">Typography Preview:</p>
                  <div style={{ fontFamily: formData.fontFamily }}>
                    <h3 className="text-2xl font-bold mb-2">Heading Example</h3>
                    <p className="text-base text-gray-600">This is how your body text will appear on the site.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Business Info Tab */}
          <TabsContent value="business">
            <Card>
              <CardHeader>
                <CardTitle>Business Information</CardTitle>
                <CardDescription>Contact details and business info</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="contactEmail" className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Contact Email
                  </Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={formData.contactEmail || ''}
                    onChange={(e) => handleChange('contactEmail', e.target.value)}
                    placeholder="contact@yourbusiness.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contactPhone" className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Contact Phone
                  </Label>
                  <Input
                    id="contactPhone"
                    value={formData.contactPhone || ''}
                    onChange={(e) => handleChange('contactPhone', e.target.value)}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="website" className="flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    Website
                  </Label>
                  <Input
                    id="website"
                    value={formData.website || ''}
                    onChange={(e) => handleChange('website', e.target.value)}
                    placeholder="https://www.yourbusiness.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address" className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Address
                  </Label>
                  <Textarea
                    id="address"
                    value={formData.address || ''}
                    onChange={(e) => handleChange('address', e.target.value)}
                    placeholder="123 Business St, City, State 12345"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Social Media Tab */}
          <TabsContent value="social">
            <Card>
              <CardHeader>
                <CardTitle>Social Media Links</CardTitle>
                <CardDescription>Connect your social media profiles</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="facebook" className="flex items-center gap-2">
                    <Facebook className="h-4 w-4" />
                    Facebook
                  </Label>
                  <Input
                    id="facebook"
                    value={formData.facebook || ''}
                    onChange={(e) => handleChange('facebook', e.target.value)}
                    placeholder="https://facebook.com/yourbusiness"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="instagram" className="flex items-center gap-2">
                    <Instagram className="h-4 w-4" />
                    Instagram
                  </Label>
                  <Input
                    id="instagram"
                    value={formData.instagram || ''}
                    onChange={(e) => handleChange('instagram', e.target.value)}
                    placeholder="https://instagram.com/yourbusiness"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="twitter" className="flex items-center gap-2">
                    <Twitter className="h-4 w-4" />
                    Twitter (X)
                  </Label>
                  <Input
                    id="twitter"
                    value={formData.twitter || ''}
                    onChange={(e) => handleChange('twitter', e.target.value)}
                    placeholder="https://twitter.com/yourbusiness"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="linkedin" className="flex items-center gap-2">
                    <Linkedin className="h-4 w-4" />
                    LinkedIn
                  </Label>
                  <Input
                    id="linkedin"
                    value={formData.linkedin || ''}
                    onChange={(e) => handleChange('linkedin', e.target.value)}
                    placeholder="https://linkedin.com/company/yourbusiness"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Save Button - Fixed at bottom */}
        <div className="sticky bottom-0 bg-white border-t py-4 mt-6 -mx-4 px-4 shadow-lg">
          <div className="max-w-6xl mx-auto flex gap-3 justify-end">
            <Button
              variant="outline"
              onClick={fetchSettings}
              disabled={saving}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Reset
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving}
              className="bg-gradient-to-r from-blue-600 to-purple-600"
            >
              {saving ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Settings
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppearanceSettingsPage;
