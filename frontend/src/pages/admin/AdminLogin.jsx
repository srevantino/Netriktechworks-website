import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { GlassCard, GlassCardHeader, GlassCardContent, GlassCardTitle } from "../../components/ui/glass-card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Lock, User, Eye, EyeOff } from "lucide-react";

const AdminLogin = ({ onLogin }) => {
  const [credentials, setCredentials] = useState({
    username: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/admin/login`,
        credentials
      );

      if (response.data.access_token) {
        onLogin(response.data.access_token);
      }
    } catch (error) {
      setError(
        error.response?.data?.detail || "Invalid credentials. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <GlassCard className="backdrop-blur-xl bg-white/20 border-white/40 shadow-2xl">
          <GlassCardHeader className="text-center space-y-4">
            <div className="w-20 h-20 bg-gradient-to-br from-indigo-500/30 to-purple-500/30 backdrop-blur-xl border-2 border-indigo-400/50 rounded-full flex items-center justify-center mx-auto">
              <Lock className="h-10 w-10 text-indigo-300" />
            </div>
            <GlassCardTitle className="text-3xl font-bold text-white">
              Admin Login
            </GlassCardTitle>
            <p className="text-white/90 text-lg">
              Enter your credentials to access the admin dashboard
            </p>
          </GlassCardHeader>
          <GlassCardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-4 bg-red-500/30 border-2 border-red-400/50 rounded-lg"
                >
                  <p className="text-red-100 text-center font-medium">{error}</p>
                </motion.div>
              )}

              <div className="space-y-2">
                <Label htmlFor="username" className="text-white font-semibold text-lg">
                  Username
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/70" />
                  <Input
                    id="username"
                    name="username"
                    type="text"
                    value={credentials.username}
                    onChange={handleInputChange}
                    placeholder="Enter your username"
                    required
                    className="pl-12 h-12 text-lg backdrop-blur-xl bg-white/30 border-2 border-white/40 text-white placeholder-white/60 focus:border-indigo-400/70 focus:ring-2 focus:ring-indigo-400/30"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-white font-semibold text-lg">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/70" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={credentials.password}
                    onChange={handleInputChange}
                    placeholder="Enter your password"
                    required
                    className="pl-12 pr-12 h-12 text-lg backdrop-blur-xl bg-white/30 border-2 border-white/40 text-white placeholder-white/60 focus:border-indigo-400/70 focus:ring-2 focus:ring-indigo-400/30"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/70 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-semibold text-lg py-3 px-4 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Signing in...</span>
                  </div>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>
          </GlassCardContent>
        </GlassCard>
      </motion.div>
    </div>
  );
};

export default AdminLogin;