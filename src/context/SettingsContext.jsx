import { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import config from '@/config/config';

const SettingsContext = createContext();

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within SettingsProvider');
  }
  return context;
};

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState({
    businessName: 'MyEvents',
    businessType: 'restaurant',
    businessDescription: 'Event Management & Booking System',
    primaryColor: '#7c3aed',
    secondaryColor: '#3b82f6',
    accentColor: '#ec4899',
    fontFamily: 'Inter, system-ui, sans-serif',
    fontSize: 'medium',
    borderRadius: 'medium',
    logo: '',
    favicon: '',
    contactEmail: '',
    contactPhone: '',
    website: '',
    address: '',
    enablePolls: true,
    enableBookings: true,
    enableEvents: true,
    facebook: '',
    instagram: '',
    twitter: '',
    linkedin: '',
    metaTitle: '',
    metaDescription: '',
    isInitialized: false
  });

  const [loading, setLoading] = useState(true);

  // Fetch settings on mount
  useEffect(() => {
    fetchSettings();
  }, []);

  // Update document title when settings change
  useEffect(() => {
    if (settings.metaTitle || settings.businessName) {
      document.title = settings.metaTitle || settings.businessName || 'MyEvents';
    }
  }, [settings.metaTitle, settings.businessName]);

  // Apply global CSS variables for colors and fonts
  useEffect(() => {
    if (settings.primaryColor) {
      document.documentElement.style.setProperty('--color-primary', settings.primaryColor);
    }
    if (settings.secondaryColor) {
      document.documentElement.style.setProperty('--color-secondary', settings.secondaryColor);
    }
    if (settings.accentColor) {
      document.documentElement.style.setProperty('--color-accent', settings.accentColor);
    }
    if (settings.fontFamily) {
      document.documentElement.style.setProperty('--font-family', settings.fontFamily);
      document.body.style.fontFamily = settings.fontFamily;
    }
    if (settings.fontSize) {
      const fontSizeMap = {
        small: '14px',
        medium: '16px',
        large: '18px'
      };
      document.documentElement.style.setProperty('--font-size-base', fontSizeMap[settings.fontSize] || '16px');
    }
    if (settings.borderRadius) {
      const radiusMap = {
        none: '0px',
        small: '4px',
        medium: '8px',
        large: '16px'
      };
      document.documentElement.style.setProperty('--border-radius', radiusMap[settings.borderRadius] || '8px');
    }
  }, [settings.primaryColor, settings.secondaryColor, settings.accentColor, settings.fontFamily, settings.fontSize, settings.borderRadius]);

  const fetchSettings = async () => {
    try {
      const response = await axios.get(`${config.apiUrl}/settings`);
      setSettings(response.data);
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = async (newSettings) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `${config.apiUrl}/settings`,
        newSettings,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      // Update state with new settings
      const updatedSettings = response.data.settings;
      setSettings(updatedSettings);
      
      // Force immediate CSS variable update
      if (updatedSettings.primaryColor) {
        document.documentElement.style.setProperty('--color-primary', updatedSettings.primaryColor);
      }
      if (updatedSettings.secondaryColor) {
        document.documentElement.style.setProperty('--color-secondary', updatedSettings.secondaryColor);
      }
      if (updatedSettings.accentColor) {
        document.documentElement.style.setProperty('--color-accent', updatedSettings.accentColor);
      }
      
      console.log('✅ Settings updated:', updatedSettings);
      return { success: true, message: 'Settings updated successfully' };
    } catch (error) {
      console.error('❌ Error updating settings:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to update settings' 
      };
    }
  };

  const value = {
    settings,
    loading,
    fetchSettings,
    updateSettings
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};
