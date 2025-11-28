import { Link } from 'react-router-dom';
import { useSettings } from '@/context/SettingsContext';
import { Facebook, Instagram, Twitter, Linkedin, Mail, Phone, MapPin, ExternalLink } from 'lucide-react';

const Footer = () => {
  const { settings } = useSettings();

  const socialIcons = {
    facebook: Facebook,
    instagram: Instagram,
    twitter: Twitter,
    linkedin: Linkedin
  };

  const getSocialLink = (platform) => {
    const handle = settings[platform];
    if (!handle) return null;
    
    const baseUrls = {
      facebook: 'https://facebook.com/',
      instagram: 'https://instagram.com/',
      twitter: 'https://twitter.com/',
      linkedin: 'https://linkedin.com/company/'
    };
    
    return handle.startsWith('http') ? handle : `${baseUrls[platform]}${handle}`;
  };

  // Get initials from business name
  const getInitials = (name) => {
    if (!name) return 'EP'; // EventPro default
    const words = name.trim().split(' ');
    if (words.length === 1) {
      return words[0].charAt(0).toUpperCase();
    }
    return words.map(word => word.charAt(0).toUpperCase()).slice(0, 2).join('');
  };

  // Check if any social media is configured
  const hasSocialMedia = settings.facebook || settings.instagram || settings.twitter || settings.linkedin;

  // Quick links menu
  const quickLinks = [
    { title: 'Home', path: '/' },
    { title: 'Events', path: '/events' },
    { title: 'Book Table', path: '/bookings' },
  ];

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-300 border-t border-gray-700">
      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-6 sm:mb-8">
          
          {/* Company Info & Branding */}
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center gap-3 mb-3 sm:mb-4">
              {settings.logo ? (
                <img 
                  src={settings.logo} 
                  alt={settings.businessName} 
                  className="h-8 sm:h-10 w-auto object-contain"
                />
              ) : (
                <>
                  <div 
                    className="h-8 sm:h-10 w-8 sm:w-10 rounded-lg flex items-center justify-center font-bold text-white text-sm sm:text-base shadow-lg"
                    style={{ 
                      background: 'linear-gradient(to right, var(--color-primary), var(--color-secondary))' 
                    }}
                  >
                    {getInitials(settings.businessName)}
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    {settings.businessName || 'EventPro'}
                  </h3>
                </>
              )}
            </div>
            <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
              {settings.businessDescription || 'Your premier event management and booking platform. Creating memorable experiences for every occasion.'}
            </p>
            
            {/* Social Media Links */}
            {hasSocialMedia && (
              <div className="pt-3 sm:pt-4">
                <h4 className="text-white font-semibold mb-2 sm:mb-3 text-xs sm:text-sm">Follow Us</h4>
                <div className="flex gap-2 sm:gap-3 flex-wrap">
                  {['facebook', 'instagram', 'twitter', 'linkedin'].map((platform) => {
                    const handle = settings[platform];
                    if (!handle) return null;
                    
                    const Icon = socialIcons[platform];
                    const link = getSocialLink(platform);
                    
                    return (
                      <a
                        key={platform}
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 sm:p-2 bg-gray-800 hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 rounded-lg transition-all transform hover:scale-110 hover:shadow-lg"
                        aria-label={platform}
                      >
                        <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                      </a>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-3 sm:mb-4 text-base sm:text-lg">Quick Links</h4>
            <ul className="space-y-1.5 sm:space-y-2">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 group text-sm sm:text-base"
                  >
                    <span className="w-0 group-hover:w-2 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 transition-all"></span>
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white font-semibold mb-3 sm:mb-4 text-base sm:text-lg">Our Services</h4>
            <ul className="space-y-1.5 sm:space-y-2">
              <li>
                <Link to="/events" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 group text-sm sm:text-base">
                  <span className="w-0 group-hover:w-2 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 transition-all"></span>
                  Event Polls & Voting
                </Link>
              </li>
              <li>
                <Link to="/bookings" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 group text-sm sm:text-base">
                  <span className="w-0 group-hover:w-2 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 transition-all"></span>
                  Venue Booking
                </Link>
              </li>
              <li>
                <span className="text-gray-400 flex items-center gap-2 text-sm sm:text-base">
                  <span className="w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400"></span>
                  Event Management
                </span>
              </li>
              <li>
                <span className="text-gray-400 flex items-center gap-2 text-sm sm:text-base">
                  <span className="w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400"></span>
                  Custom Solutions
                </span>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h4 className="text-white font-semibold mb-3 sm:mb-4 text-base sm:text-lg">Contact Us</h4>
            <ul className="space-y-2 sm:space-y-3">
              {settings.contactEmail && (
                <li>
                  <a 
                    href={`mailto:${settings.contactEmail}`}
                    className="text-gray-400 hover:text-white transition-colors flex items-start gap-2 sm:gap-3 group"
                  >
                    <Mail className="h-4 w-4 sm:h-5 sm:w-5 mt-0.5 text-blue-400 group-hover:text-blue-300 flex-shrink-0" />
                    <span className="text-xs sm:text-sm break-all">{settings.contactEmail}</span>
                  </a>
                </li>
              )}
              {settings.contactPhone && (
                <li>
                  <a 
                    href={`tel:${settings.contactPhone}`}
                    className="text-gray-400 hover:text-white transition-colors flex items-start gap-2 sm:gap-3 group"
                  >
                    <Phone className="h-4 w-4 sm:h-5 sm:w-5 mt-0.5 text-green-400 group-hover:text-green-300 flex-shrink-0" />
                    <span className="text-xs sm:text-sm">{settings.contactPhone}</span>
                  </a>
                </li>
              )}
              {settings.businessAddress && (
                <li className="text-gray-400 flex items-start gap-2 sm:gap-3">
                  <MapPin className="h-4 w-4 sm:h-5 sm:w-5 mt-0.5 text-purple-400 flex-shrink-0" />
                  <span className="text-xs sm:text-sm">{settings.businessAddress}</span>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 sm:pt-8 border-t border-gray-700">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4">
            <p className="text-gray-400 text-xs sm:text-sm text-center sm:text-left">
              © {new Date().getFullYear()} {settings.businessName || 'EventPro'}. All rights reserved.
            </p>
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6 text-xs sm:text-sm">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Terms of Service
              </a>
              <Link to="/login" className="text-gray-400 hover:text-white transition-colors flex items-center gap-1">
                Admin
                <ExternalLink className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
