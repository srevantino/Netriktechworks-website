import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { GlassCard, GlassCardHeader, GlassCardContent, GlassCardTitle } from "../../components/ui/glass-card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { 
  MessageSquare, 
  Search, 
  Filter, 
  Calendar,
  Mail,
  Phone,
  User,
  Trash2,
  Eye,
  EyeOff
} from "lucide-react";

const ContactSubmissions = ({ adminToken }) => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    fetchSubmissions();
  }, [adminToken]);

  const fetchSubmissions = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/admin/contact-submissions`,
        { headers: { Authorization: `Bearer ${adminToken}` } }
      );
      setSubmissions(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching contact submissions:', error);
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this submission?')) {
      try {
        await axios.delete(
          `${process.env.REACT_APP_BACKEND_URL}/api/admin/contact-submissions/${id}`,
          { headers: { Authorization: `Bearer ${adminToken}` } }
        );
        setSubmissions(submissions.filter(sub => sub.id !== id));
      } catch (error) {
        console.error('Error deleting submission:', error);
      }
    }
  };

  const filteredSubmissions = submissions.filter(submission => {
    const matchesSearch = submission.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         submission.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         submission.message.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === "all" || submission.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  const toggleExpanded = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Contact Submissions</h1>
        <p className="text-white/70">Manage and review customer contact submissions.</p>
      </div>

      {/* Filters */}
      <GlassCard className="backdrop-blur-xl bg-white/10 border-white/20">
        <GlassCardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
                <Input
                  type="text"
                  placeholder="Search submissions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 backdrop-blur-xl bg-white/20 border-white/30 text-white placeholder-white/50"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 rounded-lg backdrop-blur-xl bg-white/20 border-white/30 text-white"
              >
                <option value="all" className="bg-slate-800 text-white">All Status</option>
                <option value="new" className="bg-slate-800 text-white">New</option>
                <option value="read" className="bg-slate-800 text-white">Read</option>
                <option value="replied" className="bg-slate-800 text-white">Replied</option>
              </select>
            </div>
          </div>
        </GlassCardContent>
      </GlassCard>

      {/* Submissions List */}
      <div className="space-y-4">
        {filteredSubmissions.length > 0 ? (
          filteredSubmissions.map((submission, index) => (
            <motion.div
              key={submission.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <GlassCard className="backdrop-blur-xl bg-white/10 border-white/20 hover:bg-white/15 transition-all duration-300">
                <GlassCardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 backdrop-blur-xl border border-indigo-400/30 rounded-full flex items-center justify-center">
                          <User className="h-5 w-5 text-indigo-400" />
                        </div>
                        <div>
                          <h3 className="text-white font-semibold">{submission.name}</h3>
                          <p className="text-white/70 text-sm">{submission.email}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        submission.status === 'new' ? 'bg-blue-500/20 text-blue-300 border border-blue-400/30' :
                        submission.status === 'read' ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-400/30' :
                        'bg-green-500/20 text-green-300 border border-green-400/30'
                      }`}>
                        {submission.status}
                      </span>
                      <span className="text-white/50 text-sm">
                        {new Date(submission.created_at).toLocaleDateString()}
                      </span>
                      <button
                        onClick={() => toggleExpanded(submission.id)}
                        className="p-2 rounded-lg text-white/70 hover:bg-white/10 transition-colors"
                      >
                        {expandedId === submission.id ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                      <button
                        onClick={() => handleDelete(submission.id)}
                        className="p-2 rounded-lg text-red-400 hover:bg-red-500/20 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  
                  {expandedId === submission.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-4 pt-4 border-t border-white/20"
                    >
                      <div className="space-y-4">
                        <div>
                          <h4 className="text-white font-medium mb-2">Message</h4>
                          <p className="text-white/70 bg-white/5 p-3 rounded-lg">{submission.message}</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="text-white font-medium mb-2">Contact Information</h4>
                            <div className="space-y-2">
                              <div className="flex items-center space-x-2 text-white/70">
                                <Mail className="h-4 w-4" />
                                <span>{submission.email}</span>
                              </div>
                              {submission.phone && (
                                <div className="flex items-center space-x-2 text-white/70">
                                  <Phone className="h-4 w-4" />
                                  <span>{submission.phone}</span>
                                </div>
                              )}
                            </div>
                          </div>
                          <div>
                            <h4 className="text-white font-medium mb-2">Service Interest</h4>
                            <p className="text-white/70">{submission.service || 'Not specified'}</p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </GlassCardContent>
              </GlassCard>
            </motion.div>
          ))
        ) : (
          <GlassCard className="backdrop-blur-xl bg-white/10 border-white/20">
            <GlassCardContent className="p-12 text-center">
              <MessageSquare className="h-12 w-12 text-white/40 mx-auto mb-4" />
              <h3 className="text-white font-semibold mb-2">No submissions found</h3>
              <p className="text-white/70">No contact submissions match your current filters.</p>
            </GlassCardContent>
          </GlassCard>
        )}
      </div>
    </div>
  );
};

export default ContactSubmissions;