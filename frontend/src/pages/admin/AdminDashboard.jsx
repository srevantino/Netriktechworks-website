import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate, Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  LayoutDashboard, 
  MessageSquare, 
  FileText, 
  FolderOpen, 
  Star, 
  LogOut,
  User,
  Home,
  Eye,
  ArrowLeft
} from "lucide-react";

// Import admin components
import AdminLogin from "./AdminLogin";
import AdminOverview from "./AdminOverview";
import ContactSubmissions from "./ContactSubmissions";
import QuotationManager from "./QuotationManager";
import ProjectManager from "./ProjectManager";
import TestimonialManager from "./TestimonialManager";

const AdminDashboard = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminToken, setAdminToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showPreview, setShowPreview] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Clear any existing token and force login
    localStorage.removeItem('adminToken');
    setIsAuthenticated(false);
    setAdminToken(null);
    setIsLoading(false);
  }, []);

  const handleLogin = (token) => {
    localStorage.setItem('adminToken', token);
    setAdminToken(token);
    setIsAuthenticated(true);
    navigate('/a7k-9m2-x4n-8p1-q5r/overview');
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setAdminToken(null);
    setIsAuthenticated(false);
    navigate('/a7k-9m2-x4n-8p1-q5r');
  };

  const handlePreview = () => {
    setShowPreview(true);
  };

  const handleGoBack = () => {
    window.open('/', '_blank');
  };

  const handleClosePreview = () => {
    setShowPreview(false);
  };

  const navigationItems = [
    { name: "Overview", path: "/a7k-9m2-x4n-8p1-q5r/overview", icon: LayoutDashboard },
    { name: "Contact Submissions", path: "/a7k-9m2-x4n-8p1-q5r/contact-submissions", icon: MessageSquare },
    { name: "Quotations", path: "/a7k-9m2-x4n-8p1-q5r/quotations", icon: FileText },
    { name: "Projects", path: "/a7k-9m2-x4n-8p1-q5r/projects", icon: FolderOpen },
    { name: "Testimonials", path: "/a7k-9m2-x4n-8p1-q5r/testimonials", icon: Star },
  ];

  const isActive = (path) => location.pathname === path;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  if (showPreview) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        {/* Preview Header */}
        <div className="bg-white/10 backdrop-blur-xl border-b border-white/20 px-6 py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleClosePreview}
                className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white/70 hover:text-white transition-all duration-200"
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="text-sm font-medium">Back to Admin</span>
              </button>
              <div className="flex items-center space-x-2">
                <Eye className="h-5 w-5 text-white" />
                <span className="text-lg font-bold text-white">Website Preview</span>
              </div>
            </div>
            <button
              onClick={handleGoBack}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg text-blue-300 hover:text-blue-200 transition-all duration-200"
            >
              <Home className="h-4 w-4" />
              <span className="text-sm font-medium">Open in New Tab</span>
            </button>
          </div>
        </div>
        
        {/* Preview Content */}
        <div className="h-[calc(100vh-80px)]">
          <iframe
            src="/"
            className="w-full h-full border-0"
            title="Website Preview"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Admin Top Navigation Bar */}
      <header className="bg-white/10 backdrop-blur-xl border-b border-white/20 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Left side - Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
              <User className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">Admin Panel</span>
          </div>

          {/* Center - Navigation Items */}
          <nav className="hidden md:flex items-center space-x-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 min-w-[120px] justify-center ${
                    isActive(item.path)
                      ? "bg-white/20 text-white border border-white/30"
                      : "text-white/70 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right side - Actions */}
          <div className="flex items-center space-x-3">
            <button
              onClick={handlePreview}
              className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white/70 hover:text-white transition-all duration-200"
            >
              <Eye className="h-4 w-4" />
              <span className="text-sm font-medium">Preview</span>
            </button>
            
            <button
              onClick={handleGoBack}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg text-blue-300 hover:text-blue-200 transition-all duration-200"
            >
              <Home className="h-4 w-4" />
              <span className="text-sm font-medium">Go Back</span>
            </button>
            
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg text-red-300 hover:text-red-200 transition-all duration-200"
            >
              <LogOut className="h-4 w-4" />
              <span className="text-sm font-medium">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      <div className="md:hidden bg-white/5 border-b border-white/10">
        <div className="px-4 py-2">
          <div className="flex space-x-1 overflow-x-auto">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all duration-200 ${
                    isActive(item.path)
                      ? "bg-white/20 text-white"
                      : "text-white/70 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <Icon className="h-3 w-3" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="p-6">
        <div className="max-w-7xl mx-auto">
          <Routes>
            <Route path="/" element={<Navigate to="/a7k-9m2-x4n-8p1-q5r/overview" replace />} />
            <Route path="/overview" element={<AdminOverview />} />
            <Route path="/contact-submissions" element={<ContactSubmissions />} />
            <Route path="/quotations" element={<QuotationManager />} />
            <Route path="/projects" element={<ProjectManager />} />
            <Route path="/testimonials" element={<TestimonialManager />} />
          </Routes>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;