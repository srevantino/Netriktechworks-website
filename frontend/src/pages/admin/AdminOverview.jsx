import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { GlassCard, GlassCardHeader, GlassCardContent, GlassCardTitle } from "../../components/ui/glass-card";
import { 
  MessageSquare, 
  FileText, 
  FolderOpen, 
  Star,
  TrendingUp,
  Users,
  Calendar,
  Activity
} from "lucide-react";

const AdminOverview = ({ adminToken }) => {
  const [stats, setStats] = useState({
    contacts: 0,
    quotations: 0,
    projects: 0,
    testimonials: 0,
    recentContacts: [],
    recentQuotations: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOverviewData();
  }, [adminToken]);

  const fetchOverviewData = async () => {
    try {
      const headers = { Authorization: `Bearer ${adminToken}` };
      
      const [contactsRes, quotationsRes, projectsRes, testimonialsRes] = await Promise.all([
        axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/admin/contact-submissions`, { headers }),
        axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/admin/quotations`, { headers }),
        axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/admin/projects`, { headers }),
        axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/admin/testimonials`, { headers })
      ]);

      setStats({
        contacts: contactsRes.data.length,
        quotations: quotationsRes.data.length,
        projects: projectsRes.data.length,
        testimonials: testimonialsRes.data.length,
        recentContacts: contactsRes.data.slice(0, 5),
        recentQuotations: quotationsRes.data.slice(0, 5)
      });
      setLoading(false);
    } catch (error) {
      console.error('Error fetching overview data:', error);
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: "Contact Submissions",
      value: stats.contacts,
      icon: MessageSquare,
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-500/20",
      borderColor: "border-blue-400/30"
    },
    {
      title: "Quotations",
      value: stats.quotations,
      icon: FileText,
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-green-500/20",
      borderColor: "border-green-400/30"
    },
    {
      title: "Projects",
      value: stats.projects,
      icon: FolderOpen,
      color: "from-purple-500 to-violet-500",
      bgColor: "bg-purple-500/20",
      borderColor: "border-purple-400/30"
    },
    {
      title: "Testimonials",
      value: stats.testimonials,
      icon: Star,
      color: "from-yellow-500 to-orange-500",
      bgColor: "bg-yellow-500/20",
      borderColor: "border-yellow-400/30"
    }
  ];

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
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard Overview</h1>
        <p className="text-white/70">Welcome to your admin dashboard. Here's what's happening.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <GlassCard className="backdrop-blur-xl bg-white/10 border-white/20 hover:bg-white/15 transition-all duration-300">
                <GlassCardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white/70 text-sm font-medium">{card.title}</p>
                      <p className="text-3xl font-bold text-white mt-2">{card.value}</p>
                    </div>
                    <div className={`w-12 h-12 ${card.bgColor} backdrop-blur-xl border ${card.borderColor} rounded-full flex items-center justify-center`}>
                      <Icon className={`h-6 w-6 text-white`} />
                    </div>
                  </div>
                </GlassCardContent>
              </GlassCard>
            </motion.div>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Contacts */}
        <GlassCard className="backdrop-blur-xl bg-white/10 border-white/20">
          <GlassCardHeader>
            <GlassCardTitle className="text-white flex items-center space-x-2">
              <MessageSquare className="h-5 w-5" />
              <span>Recent Contact Submissions</span>
            </GlassCardTitle>
          </GlassCardHeader>
          <GlassCardContent>
            {stats.recentContacts.length > 0 ? (
              <div className="space-y-4">
                {stats.recentContacts.map((contact, index) => (
                  <motion.div
                    key={contact.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10"
                  >
                    <div>
                      <p className="text-white font-medium">{contact.name}</p>
                      <p className="text-white/70 text-sm">{contact.email}</p>
                    </div>
                    <div className="text-white/50 text-xs">
                      {new Date(contact.created_at).toLocaleDateString()}
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <p className="text-white/70 text-center py-8">No recent contact submissions</p>
            )}
          </GlassCardContent>
        </GlassCard>

        {/* Recent Quotations */}
        <GlassCard className="backdrop-blur-xl bg-white/10 border-white/20">
          <GlassCardHeader>
            <GlassCardTitle className="text-white flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <span>Recent Quotations</span>
            </GlassCardTitle>
          </GlassCardHeader>
          <GlassCardContent>
            {stats.recentQuotations.length > 0 ? (
              <div className="space-y-4">
                {stats.recentQuotations.map((quotation, index) => (
                  <motion.div
                    key={quotation.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10"
                  >
                    <div>
                      <p className="text-white font-medium">{quotation.client_name}</p>
                      <p className="text-white/70 text-sm">{quotation.service_type}</p>
                    </div>
                    <div className="text-white/50 text-xs">
                      {new Date(quotation.created_at).toLocaleDateString()}
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <p className="text-white/70 text-center py-8">No recent quotations</p>
            )}
          </GlassCardContent>
        </GlassCard>
      </div>

      {/* Quick Actions */}
      <GlassCard className="backdrop-blur-xl bg-white/10 border-white/20">
        <GlassCardHeader>
          <GlassCardTitle className="text-white flex items-center space-x-2">
            <Activity className="h-5 w-5" />
            <span>Quick Actions</span>
          </GlassCardTitle>
        </GlassCardHeader>
        <GlassCardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="p-4 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-400/30 rounded-lg text-left hover:from-blue-500/30 hover:to-cyan-500/30 transition-all duration-300"
            >
              <MessageSquare className="h-6 w-6 text-blue-400 mb-2" />
              <h3 className="text-white font-medium">View Contacts</h3>
              <p className="text-white/70 text-sm">Manage contact submissions</p>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="p-4 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-400/30 rounded-lg text-left hover:from-green-500/30 hover:to-emerald-500/30 transition-all duration-300"
            >
              <FileText className="h-6 w-6 text-green-400 mb-2" />
              <h3 className="text-white font-medium">Manage Quotations</h3>
              <p className="text-white/70 text-sm">Create and track quotations</p>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="p-4 bg-gradient-to-r from-purple-500/20 to-violet-500/20 border border-purple-400/30 rounded-lg text-left hover:from-purple-500/30 hover:to-violet-500/30 transition-all duration-300"
            >
              <FolderOpen className="h-6 w-6 text-purple-400 mb-2" />
              <h3 className="text-white font-medium">Manage Projects</h3>
              <p className="text-white/70 text-sm">Track project progress</p>
            </motion.button>
          </div>
        </GlassCardContent>
      </GlassCard>
    </div>
  );
};

export default AdminOverview;