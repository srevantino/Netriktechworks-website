import React, { useState, useEffect } from "react"; 
import axios from "axios"; 
import { LiquidGlassCard, LiquidGlassCardHeader, LiquidGlassCardContent, LiquidGlassCardTitle, LiquidGlassCardDescription, LiquidGlassButton } from "../components/ui/liquid-glass"; 
import { Badge } from "../components/ui/badge";
import { FadeIn, ScaleIn, StaggerContainer, StaggerItem } from "../components/ScrollAnimations";
import { Calendar, ExternalLink, Filter } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";

const Projects = () => {
  const { colors, isDark } = useTheme();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/projects`);
      setProjects(response.data);
      
      // Extract unique categories
      const uniqueCategories = [...new Set(response.data.map(project => project.category))];
      setCategories(uniqueCategories);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching projects:', error);
      setLoading(false);
    }
  };

  const filteredProjects = selectedCategory === "all" 
    ? projects 
    : projects.filter(project => project.category === selectedCategory);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: colors.background }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4"></div>
          <p style={{ color: colors.textSecondary }}>Loading projects...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20 px-4" style={{ backgroundColor: colors.background }}>
      <div className="max-w-7xl mx-auto">
        <FadeIn>
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold mb-6" style={{ color: colors.textPrimary }}>
              Our <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Projects</span>
            </h1>
            <p className="text-xl max-w-3xl mx-auto" style={{ color: colors.textSecondary }}>
              Explore our portfolio of successful projects and see how we've helped businesses transform their digital presence.
            </p>
          </div>
        </FadeIn>

        {/* Category Filter */}
        <StaggerContainer>
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <StaggerItem>
              <Badge variant="secondary" className={`px-4 py-2 text-sm backdrop-blur-xl ${
                isDark 
                  ? 'bg-white/30 border-white/40 text-white' 
                  : 'bg-gray-100 border-gray-300 text-gray-700'
              }`}>
                <Filter className="w-4 h-4 mr-2" />
                Filter by Category
              </Badge>
            </StaggerItem>
            
            <StaggerItem>
              <button
                onClick={() => setSelectedCategory("all")}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  selectedCategory === "all"
                    ? isDark 
                      ? "bg-white/20 text-white border border-white/30"
                      : "bg-gray-200 text-gray-900 border border-gray-300"
                    : isDark
                      ? "text-white/70 hover:bg-white/10 hover:text-white"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                All Projects
              </button>
            </StaggerItem>
            
            {categories.map((category, index) => (
              <StaggerItem key={category}>
                <button
                  onClick={() => setSelectedCategory(category)}
                  className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    selectedCategory === category
                      ? isDark 
                        ? "bg-white/20 text-white border border-white/30"
                        : "bg-gray-200 text-gray-900 border border-gray-300"
                      : isDark
                        ? "text-white/70 hover:bg-white/10 hover:text-white"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  {category}
                </button>
              </StaggerItem>
            ))}
          </div>
        </StaggerContainer>

        {/* Projects Grid */}
        <StaggerContainer>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project, index) => (
              <StaggerItem key={project.id}>
                <ScaleIn delay={index * 0.1}>
                  <LiquidGlassCard className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                    <div className="relative overflow-hidden rounded-t-2xl">
                      <img
                        src={project.image_url || '/api/placeholder/400/300'}
                        alt={project.title}
                        className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <Badge className="absolute top-4 right-4 bg-blue-600/80 text-white">
                        {project.category}
                      </Badge>
                    </div>
                    
                    <LiquidGlassCardHeader>
                      <LiquidGlassCardTitle className="text-xl mb-2" style={{ color: colors.textPrimary }}>
                        {project.title}
                      </LiquidGlassCardTitle>
                      <LiquidGlassCardDescription className="mb-4" style={{ color: colors.textSecondary }}>
                        {project.description}
                      </LiquidGlassCardDescription>
                      
                      <div className="flex items-center text-sm mb-4" style={{ color: colors.textSecondary }}>
                        <Calendar className="w-4 h-4 mr-2" />
                        {new Date(project.created_at).toLocaleDateString()}
                      </div>
                      
                      <Badge variant="outline" className={`w-fit ${
                        isDark 
                          ? 'text-white/80 border-white/30' 
                          : 'text-gray-700 border-gray-300'
                      }`}>
                        {project.status}
                      </Badge>
                    </LiquidGlassCardHeader>
                    
                    <LiquidGlassCardContent>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.technologies?.map((tech, tagIndex) => (
                          <Badge key={tagIndex} variant="secondary" className={`text-xs ${
                            isDark 
                              ? 'text-white/80 bg-white/10 border-white/20' 
                              : 'text-gray-700 bg-gray-100 border-gray-300'
                          }`}>
                            {tech}
                          </Badge>
                        ))}
                      </div>
                      
                      <div className="flex gap-3">
                        <LiquidGlassButton 
                          className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                          onClick={() => window.open(project.demo_url, '_blank')}
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          View Demo
                        </LiquidGlassButton>
                      </div>
                    </LiquidGlassCardContent>
                  </LiquidGlassCard>
                </ScaleIn>
              </StaggerItem>
            ))}
          </div>
        </StaggerContainer>

        {filteredProjects.length === 0 && (
          <div className="text-center py-16">
            <p className="text-lg" style={{ color: colors.textSecondary }}>No projects found for the selected category.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Projects;