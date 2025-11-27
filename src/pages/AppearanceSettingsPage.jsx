import { useState, useEffect } from 'react';
import { useSettings } from '@/context/SettingsContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Palette, Type, Image, Globe, Mail, Phone, MapPin, Facebook, Instagram, Twitter, Linkedin, Save, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

const AppearanceSettingsPage = () => {
  const { settings, updateSettings, fetchSettings } = useSettings();
  const [formData, setFormData] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setFormData(settings);
  }, [settings]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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
                  <Label htmlFor="logo">Logo URL</Label>
                  <Input
                    id="logo"
                    value={formData.logo || ''}
                    onChange={(e) => handleChange('logo', e.target.value)}
                    placeholder="https://example.com/logo.png"
                  />
                  <p className="text-sm text-gray-500">Enter the URL of your logo image</p>
                  {formData.logo && (
                    <div className="mt-4 p-4 border rounded-lg bg-white">
                      <p className="text-sm font-medium mb-2">Logo Preview:</p>
                      <img src={formData.logo} alt="Logo preview" className="h-16 w-auto object-contain" />
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="favicon">Favicon URL</Label>
                  <Input
                    id="favicon"
                    value={formData.favicon || ''}
                    onChange={(e) => handleChange('favicon', e.target.value)}
                    placeholder="https://example.com/favicon.ico"
                  />
                  <p className="text-sm text-gray-500">Browser tab icon (32x32px recommended)</p>
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
