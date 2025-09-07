import React from "react";
import { Link } from "react-router-dom";
import { LiquidGlassCard } from "./ui/liquid-glass";
import { Monitor, Phone, Mail, MapPin, Clock, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";

export const Footer = () => {
  const { isDark, colors } = useTheme();
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Linkedin, href: "#", label: "LinkedIn" }
  ];

  return (
    <footer className={`py-16 px-4 ${isDark ? 'bg-gray-900' : 'bg-gray-100'}`}>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <img 
                src={isDark ? "/logo-black.png" : "/logo-white.png"}
                alt="Netrik Techworks" 
                className="h-8 w-auto"
              />
              <div>
                <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Netrik Techworks
                </h3>
                <p className={`text-sm ${isDark ? 'text-white/70' : 'text-gray-600'}`}>
                  IT Solutions & Services
                </p>
              </div>
            </div>
            <p className={`text-sm ${isDark ? 'text-white/70' : 'text-gray-600'}`}>
              Professional laptop repair, upgrades, and maintenance services. 
              Fast, reliable, and affordable solutions for all your laptop needs.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    className={`p-2 rounded-lg transition-colors ${
                      isDark 
                        ? 'text-white/70 hover:text-white hover:bg-white/10' 
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
                    }`}
                    aria-label={social.label}
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Quick Links
            </h4>
            <ul className="space-y-2">
              {[
                { name: "Home", path: "/" },
                { name: "About", path: "/about" },
                { name: "Services", path: "/services" },
                { name: "Products", path: "/products" },
                { name: "Projects", path: "/projects" },
                { name: "Testimonials", path: "/testimonials" },
                { name: "Contact", path: "/contact" }
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className={`text-sm transition-colors ${
                      isDark 
                        ? 'text-white/70 hover:text-white' 
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Our Services */}
          <div>
            <h4 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Our Services
            </h4>
            <ul className="space-y-2">
              {[
                "Laptop Servicing & Repair",
                "Hardware Upgrades",
                "System Maintenance",
                "Data Recovery",
                "IT Support",
                "Warranty Services"
              ].map((service) => (
                <li key={service}>
                  <span className={`text-sm transition-colors cursor-pointer ${
                    isDark 
                      ? 'text-white/70 hover:text-white' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}>
                    {service}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Contact Info
            </h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone className={`h-5 w-5 ${isDark ? 'text-white/70' : 'text-gray-600'}`} />
                <span className={`text-sm ${isDark ? 'text-white/70' : 'text-gray-600'}`}>
                  +60 12-345 6789
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className={`h-5 w-5 ${isDark ? 'text-white/70' : 'text-gray-600'}`} />
                <span className={`text-sm ${isDark ? 'text-white/70' : 'text-gray-600'}`}>
                  info@netriktechworks.com
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className={`h-5 w-5 ${isDark ? 'text-white/70' : 'text-gray-600'}`} />
                <span className={`text-sm ${isDark ? 'text-white/70' : 'text-gray-600'}`}>
                  Kuala Lumpur, Malaysia
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className={`h-5 w-5 ${isDark ? 'text-white/70' : 'text-gray-600'}`} />
                <span className={`text-sm ${isDark ? 'text-white/70' : 'text-gray-600'}`}>
                  Mon-Fri: 9AM-6PM
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className={`border-t mt-12 pt-8 ${isDark ? 'border-white/20' : 'border-gray-200'}`}>
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className={`text-sm ${isDark ? 'text-white/70' : 'text-gray-600'}`}>
              © {currentYear} Netrik Techworks. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link
                to="/privacy"
                className={`text-sm transition-colors ${
                  isDark 
                    ? 'text-white/70 hover:text-white' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Privacy Policy
              </Link>
              <Link
                to="/terms"
                className={`text-sm transition-colors ${
                  isDark 
                    ? 'text-white/70 hover:text-white' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};