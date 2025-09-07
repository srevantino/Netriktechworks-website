import React, { useState, useEffect } from "react";
import axios from "axios";
import { LiquidGlassCard, LiquidGlassCardHeader, LiquidGlassCardContent, LiquidGlassButton } from "../components/ui/liquid-glass";
import { FadeIn, ScaleIn, StaggerContainer, StaggerItem } from "../components/ScrollAnimations";
import { BikeBearText, AppleRevealText } from "../components/BikeBearAnimations";
import { Star, Quote, User, Calendar, ThumbsUp } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";

const Testimonials = () => {
  const { colors, isDark } = useTheme();
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/testimonials`);
      setTestimonials(response.data);
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      // Use mock data if API fails
      setTestimonials([
        {
          id: 1,
          name: "Sarah Johnson",
          role: "Business Owner",
          content: "Excellent service! My laptop is running like new. Highly recommend their expertise.",
          rating: 5,
          date: "2024-01-15",
          likes: 12
        },
        {
          id: 2,
          name: "Michael Chen",
          role: "Student",
          content: "Fast and reliable service. Fixed my laptop in just 2 hours. Great value for money.",
          rating: 5,
          date: "2024-01-10",
          likes: 8
        },
        {
          id: 3,
          name: "Emily Rodriguez",
          role: "Professional",
          content: "Professional team with excellent customer service. Will definitely use again.",
          rating: 5,
          date: "2024-01-08",
          likes: 15
        },
        {
          id: 4,
          name: "David Kim",
          role: "Developer",
          content: "Outstanding technical support. They understood my complex requirements perfectly.",
          rating: 5,
          date: "2024-01-05",
          likes: 20
        },
        {
          id: 5,
          name: "Lisa Wang",
          role: "Designer",
          content: "Creative solutions and quick turnaround. My laptop performance improved significantly.",
          rating: 5,
          date: "2024-01-03",
          likes: 11
        },
        {
          id: 6,
          name: "James Wilson",
          role: "Entrepreneur",
          content: "Reliable service with fair pricing. They saved me from losing important data.",
          rating: 5,
          date: "2024-01-01",
          likes: 9
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (testimonialId) => {
    try {
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/testimonials/${testimonialId}/like`);
      setTestimonials(prev => 
        prev.map(testimonial => 
          testimonial.id === testimonialId 
            ? { ...testimonial, likes: testimonial.likes + 1 }
            : testimonial
        )
      );
    } catch (error) {
      console.error('Error liking testimonial:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: colors.background }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4"></div>
          <p style={{ color: colors.textSecondary }}>Loading testimonials...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20 px-4" style={{ backgroundColor: colors.background }}>
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <FadeIn>
          <div className="text-center mb-16">
            <BikeBearText delay={0.2}>
              <h1 className="text-5xl md:text-6xl font-bold mb-6" style={{ color: colors.textPrimary }}>
                What Our <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Clients</span> Say
              </h1>
            </BikeBearText>
            <AppleRevealText delay={0.4}>
              <p className="text-xl md:text-2xl max-w-3xl mx-auto" style={{ color: colors.textSecondary }}>
                Don't just take our word for it. Here's what our satisfied customers have to say about our services.
              </p>
            </AppleRevealText>
          </div>
        </FadeIn>

        {/* Stats Section */}
        <FadeIn delay={0.6}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <LiquidGlassCard className="text-center p-8">
              <LiquidGlassCardContent>
                <div className="text-4xl font-bold mb-2" style={{ color: colors.textPrimary }}>500+</div>
                <p style={{ color: colors.textSecondary }}>Happy Customers</p>
              </LiquidGlassCardContent>
            </LiquidGlassCard>
            <LiquidGlassCard className="text-center p-8">
              <LiquidGlassCardContent>
                <div className="text-4xl font-bold mb-2" style={{ color: colors.textPrimary }}>4.9/5</div>
                <p style={{ color: colors.textSecondary }}>Average Rating</p>
              </LiquidGlassCardContent>
            </LiquidGlassCard>
            <LiquidGlassCard className="text-center p-8">
              <LiquidGlassCardContent>
                <div className="text-4xl font-bold mb-2" style={{ color: colors.textPrimary }}>24/7</div>
                <p style={{ color: colors.textSecondary }}>Support Available</p>
              </LiquidGlassCardContent>
            </LiquidGlassCard>
          </div>
        </FadeIn>

        {/* Testimonials Grid */}
        <StaggerContainer>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <StaggerItem key={testimonial.id}>
                <ScaleIn delay={index * 0.1}>
                  <LiquidGlassCard className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                    <LiquidGlassCardHeader>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full">
                            <User className="h-6 w-6" style={{ color: colors.textPrimary }} />
                          </div>
                          <div>
                            <h3 className="font-semibold" style={{ color: colors.textPrimary }}>{testimonial.name}</h3>
                            <p className="text-sm" style={{ color: colors.textSecondary }}>{testimonial.role}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                          ))}
                        </div>
                      </div>
                    </LiquidGlassCardHeader>
                    <LiquidGlassCardContent>
                      <div className="mb-6">
                        <Quote className="h-8 w-8 text-indigo-400 mb-3" />
                        <p className="italic" style={{ color: colors.textSecondary }}>
                          "{testimonial.content}"
                        </p>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 text-sm" style={{ color: colors.textSecondary }}>
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(testimonial.date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <LiquidGlassButton
                            size="sm"
                            variant="ghost"
                            onClick={() => handleLike(testimonial.id)}
                            className="flex items-center space-x-1"
                          >
                            <ThumbsUp className="h-4 w-4" />
                            <span>{testimonial.likes}</span>
                          </LiquidGlassButton>
                        </div>
                      </div>
                    </LiquidGlassCardContent>
                  </LiquidGlassCard>
                </ScaleIn>
              </StaggerItem>
            ))}
          </div>
        </StaggerContainer>

        {/* CTA Section */}
        <FadeIn delay={0.8}>
          <div className="text-center mt-16">
            <LiquidGlassCard className="max-w-2xl mx-auto p-8">
              <LiquidGlassCardContent>
                <h2 className="text-3xl font-bold mb-4" style={{ color: colors.textPrimary }}>
                  Ready to Share Your Experience?
                </h2>
                <p className="mb-6" style={{ color: colors.textSecondary }}>
                  We'd love to hear about your experience with our services. Your feedback helps us improve and helps others make informed decisions.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <LiquidGlassButton
                    variant="primary"
                    onClick={() => window.location.href = '/contact'}
                  >
                    Leave a Review
                  </LiquidGlassButton>
                  <LiquidGlassButton
                    variant="default"
                    onClick={() => window.location.href = '/services'}
                  >
                    View Our Services
                  </LiquidGlassButton>
                </div>
              </LiquidGlassCardContent>
            </LiquidGlassCard>
          </div>
        </FadeIn>
      </div>
    </div>
  );
};

export default Testimonials;