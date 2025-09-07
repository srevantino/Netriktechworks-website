import React from "react";
import { Link } from "react-router-dom";
import { LiquidGlassCard, LiquidGlassCardHeader, LiquidGlassCardContent, LiquidGlassButton } from "../components/ui/liquid-glass";
import { Badge } from "../components/ui/badge";
import { FadeIn, ScaleIn, StaggerContainer, StaggerItem } from "../components/ScrollAnimations";
import { BikeBearText, AppleRevealText } from "../components/BikeBearAnimations";
import { Monitor, Wrench, Shield, Zap, Users, Award, CheckCircle, ArrowRight, Phone, MessageCircle, Star, Clock, Headphones } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";

const Home = () => {
  const { colors, isDark } = useTheme();

  const services = [
    {
      icon: <Monitor className="h-8 w-8" />,
      title: "Laptop Servicing",
      description: "Complete laptop care from RM40. Boost speed, fix issues, and full performance upgrades.",
      features: ["Speed Optimization", "Hardware Repair", "Software Installation", "Data Recovery"],
      price: "From RM40"
    },
    {
      icon: <Wrench className="h-8 w-8" />,
      title: "Hardware Upgrades",
      description: "Enhance your laptop's performance with RAM, SSD, and other hardware upgrades.",
      features: ["RAM Upgrade", "SSD Installation", "Battery Replacement", "Screen Repair"],
      price: "From RM80"
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "System Maintenance",
      description: "Keep your system running smoothly with regular maintenance and optimization.",
      features: ["Virus Removal", "System Cleanup", "Driver Updates", "Performance Tuning"],
      price: "From RM30"
    }
  ];

  const features = [
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Fast Service",
      description: "Quick turnaround times without compromising quality"
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Expert Team",
      description: "Experienced technicians with years of expertise"
    },
    {
      icon: <Award className="h-6 w-6" />,
      title: "Quality Guarantee",
      description: "All work comes with warranty and satisfaction guarantee"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Business Owner",
      content: "Excellent service! My laptop is running like new. Highly recommend their expertise.",
      rating: 5
    },
    {
      name: "Michael Chen",
      role: "Student",
      content: "Fast and reliable service. Fixed my laptop in just 2 hours. Great value for money.",
      rating: 5
    },
    {
      name: "Emily Rodriguez",
      role: "Professional",
      content: "Professional team with excellent customer service. Will definitely use again.",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'transparent' }}>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4">
        <div className="max-w-7xl mx-auto text-center">
          <FadeIn>
            <BikeBearText delay={0.2}>
              <h1 className="text-6xl md:text-7xl font-bold mb-6">
                <span style={{ color: colors.textPrimary }}>Expert</span>{" "}
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Laptop
                </span>{" "}
                <span style={{ color: colors.textPrimary }}>Services</span>
              </h1>
            </BikeBearText>
          </FadeIn>
          
          <FadeIn delay={0.4}>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto" style={{ color: colors.textSecondary }}>
              Professional laptop repair, upgrades, and maintenance services. 
              Fast, reliable, and affordable solutions for all your laptop needs.
            </p>
          </FadeIn>
          
          <FadeIn delay={0.6}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                className="px-8 py-3 rounded-lg font-medium transition-all duration-300 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg hover:shadow-xl"
                onClick={() => window.location.href = '/contact'}
              >
                <Phone className="w-5 h-5 mr-2 inline" />
                Get Started
              </button>
              <button 
                className={`px-8 py-3 rounded-lg font-medium transition-all duration-300 border-2 ${
                  isDark 
                    ? 'border-white/30 text-white hover:bg-white/10' 
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
                onClick={() => window.location.href = '/services'}
              >
                <MessageCircle className="w-5 h-5 mr-2 inline" />
                Learn More
              </button>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <FadeIn>
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: colors.textPrimary }}>
                Our <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Services</span>
              </h2>
              <p className="text-xl max-w-3xl mx-auto" style={{ color: colors.textSecondary }}>
                Comprehensive laptop services designed to keep your device running at peak performance.
              </p>
            </div>
          </FadeIn>

          <StaggerContainer>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {services.map((service, index) => (
                <StaggerItem key={index}>
                  <ScaleIn delay={index * 0.1}>
                    <LiquidGlassCard className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                      <LiquidGlassCardHeader>
                        <div className="flex items-center justify-between mb-4">
                          <div className="p-3 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl">
                            {service.icon}
                          </div>
                          <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                            {service.price}
                          </Badge>
                        </div>
                        <h3 className="text-2xl font-bold mb-3" style={{ color: colors.textPrimary }}>{service.title}</h3>
                        <p className="mb-6" style={{ color: colors.textSecondary }}>
                          {service.description}
                        </p>
                      </LiquidGlassCardHeader>
                      <LiquidGlassCardContent>
                        <ul className="space-y-3 mb-6">
                          {service.features.map((feature, featureIndex) => (
                            <li key={featureIndex} className="flex items-center" style={{ color: colors.textSecondary }}>
                              <CheckCircle className="h-5 w-5 text-green-400 mr-3 flex-shrink-0" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                        <button className="w-full px-6 py-3 rounded-lg font-medium transition-all duration-300 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg hover:shadow-xl">
                          Learn More
                          <ArrowRight className="w-4 h-4 ml-2 inline" />
                        </button>
                      </LiquidGlassCardContent>
                    </LiquidGlassCard>
                  </ScaleIn>
                </StaggerItem>
              ))}
            </div>
          </StaggerContainer>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4" style={{ backgroundColor: colors.content + '20' }}>
        <div className="max-w-7xl mx-auto">
          <FadeIn>
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: colors.textPrimary }}>
                Why Choose <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Us</span>
              </h2>
              <p className="text-xl max-w-3xl mx-auto" style={{ color: colors.textSecondary }}>
                We deliver exceptional service with a focus on quality, speed, and customer satisfaction.
              </p>
            </div>
          </FadeIn>

          <StaggerContainer>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <StaggerItem key={index}>
                  <ScaleIn delay={index * 0.1}>
                    <LiquidGlassCard className="text-center group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                      <LiquidGlassCardContent className="p-8">
                        <div className="p-4 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                          {feature.icon}
                        </div>
                        <h3 className="text-2xl font-bold mb-4" style={{ color: colors.textPrimary }}>{feature.title}</h3>
                        <p style={{ color: colors.textSecondary }}>
                          {feature.description}
                        </p>
                      </LiquidGlassCardContent>
                    </LiquidGlassCard>
                  </ScaleIn>
                </StaggerItem>
              ))}
            </div>
          </StaggerContainer>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <FadeIn>
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: colors.textPrimary }}>
                What Our <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Clients</span> Say
              </h2>
              <p className="text-xl max-w-3xl mx-auto" style={{ color: colors.textSecondary }}>
                Don't just take our word for it. Here's what our satisfied customers have to say.
              </p>
            </div>
          </FadeIn>

          <StaggerContainer>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <StaggerItem key={index}>
                  <ScaleIn delay={index * 0.1}>
                    <LiquidGlassCard className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                      <LiquidGlassCardContent className="p-8">
                        <div className="flex items-center mb-4">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                          ))}
                        </div>
                        <p className="mb-6 italic" style={{ color: colors.textSecondary }}>
                          "{testimonial.content}"
                        </p>
                        <div>
                          <h4 className="font-semibold" style={{ color: colors.textPrimary }}>{testimonial.name}</h4>
                          <p className="text-sm" style={{ color: colors.textSecondary }}>{testimonial.role}</p>
                        </div>
                      </LiquidGlassCardContent>
                    </LiquidGlassCard>
                  </ScaleIn>
                </StaggerItem>
              ))}
            </div>
          </StaggerContainer>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10">
        <div className="max-w-4xl mx-auto text-center">
          <FadeIn>
            <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: colors.textPrimary }}>
              Ready to Get Started?
            </h2>
            <p className="text-xl mb-8" style={{ color: colors.textSecondary }}>
              Contact us today for a free consultation and let us help you get the most out of your laptop.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                className="px-8 py-3 rounded-lg font-medium transition-all duration-300 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg hover:shadow-xl"
                onClick={() => window.location.href = '/contact'}
              >
                <Phone className="w-5 h-5 mr-2 inline" />
                Contact Us
              </button>
              <button 
                className={`px-8 py-3 rounded-lg font-medium transition-all duration-300 border-2 ${
                  isDark 
                    ? 'border-white/30 text-white hover:bg-white/10' 
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
                onClick={() => window.location.href = '/projects'}
              >
                <Monitor className="w-5 h-5 mr-2 inline" />
                View Our Work
              </button>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
};

export default Home;