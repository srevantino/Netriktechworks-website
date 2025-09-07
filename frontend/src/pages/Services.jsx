import React from "react";
import { LiquidGlassCard, LiquidGlassCardHeader, LiquidGlassCardContent, LiquidGlassCardTitle, LiquidGlassCardDescription, LiquidGlassButton } from "../components/ui/liquid-glass";
import { Badge } from "../components/ui/badge";
import { FadeIn, ScaleIn, StaggerContainer, StaggerItem } from "../components/ScrollAnimations";
import { BikeBearText, AppleRevealText } from "../components/BikeBearAnimations";
import { Monitor, Wrench, Shield, Zap, Users, Award, CheckCircle, ArrowRight, Phone, Clock, Star } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";

const Services = () => {
  const { colors, isDark } = useTheme();

  const services = [
    {
      icon: <Monitor className="h-8 w-8" />,
      title: "Laptop Servicing & Repair",
      description: "Complete laptop care from RM40. Boost speed, fix issues, and full performance upgrades.",
      features: ["Speed Optimization", "Hardware Repair", "Software Installation", "Data Recovery", "Virus Removal", "Screen Replacement"],
      price: "From RM40",
      duration: "1-3 days",
      category: "Repair"
    },
    {
      icon: <Wrench className="h-8 w-8" />,
      title: "Hardware Upgrades",
      description: "Enhance your laptop's performance with RAM, SSD, and other hardware upgrades.",
      features: ["RAM Upgrade", "SSD Installation", "Battery Replacement", "Screen Repair", "Keyboard Replacement", "Cooling System"],
      price: "From RM80",
      duration: "Same day",
      category: "Upgrade"
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "System Maintenance",
      description: "Keep your system running smoothly with regular maintenance and optimization.",
      features: ["Virus Removal", "System Cleanup", "Driver Updates", "Performance Tuning", "Registry Cleanup", "Disk Defragmentation"],
      price: "From RM30",
      duration: "2-4 hours",
      category: "Maintenance"
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: "Data Recovery",
      description: "Professional data recovery services for accidentally deleted or corrupted files.",
      features: ["File Recovery", "Partition Recovery", "Corrupted Data Repair", "Backup Solutions", "Secure Data Transfer", "Data Migration"],
      price: "From RM100",
      duration: "1-5 days",
      category: "Recovery"
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "IT Support",
      description: "Comprehensive IT support for businesses and individuals.",
      features: ["Remote Support", "Network Setup", "Software Installation", "Troubleshooting", "Training", "Consultation"],
      price: "From RM50/hour",
      duration: "As needed",
      category: "Support"
    },
    {
      icon: <Award className="h-8 w-8" />,
      title: "Warranty Services",
      description: "Extended warranty and maintenance plans for your devices.",
      features: ["Extended Warranty", "Regular Maintenance", "Priority Support", "Free Diagnostics", "Discount on Repairs", "Pickup & Delivery"],
      price: "From RM200/year",
      duration: "Ongoing",
      category: "Warranty"
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
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: "24/7 Support",
      description: "Round-the-clock customer support for urgent issues"
    }
  ];

  return (
    <div className="min-h-screen py-20 px-4" style={{ backgroundColor: colors.background }}>
      <div className="max-w-7xl mx-auto">
        <FadeIn>
          <div className="text-center mb-16">
            <BikeBearText delay={0.2}>
              <h1 className="text-5xl font-bold mb-6" style={{ color: colors.textPrimary }}>
                Our <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Services</span>
              </h1>
            </BikeBearText>
            <p className="text-xl max-w-3xl mx-auto" style={{ color: colors.textSecondary }}>
              Comprehensive laptop services designed to keep your device running at peak performance.
            </p>
          </div>
        </FadeIn>

        {/* Services Grid */}
        <StaggerContainer>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
            {services.map((service, index) => (
              <StaggerItem key={index}>
                <ScaleIn delay={index * 0.1}>
                  <LiquidGlassCard className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 h-full">
                    <LiquidGlassCardHeader>
                      <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl">
                          {service.icon}
                        </div>
                        <div className="flex flex-col items-end space-y-1">
                          <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                            {service.price}
                          </Badge>
                          <Badge variant="outline" className="text-xs" style={{ borderColor: colors.border, color: colors.textSecondary }}>
                            {service.duration}
                          </Badge>
                        </div>
                      </div>
                      <LiquidGlassCardTitle className="text-xl mb-2" style={{ color: colors.textPrimary }}>
                        {service.title}
                      </LiquidGlassCardTitle>
                      <LiquidGlassCardDescription className="mb-4" style={{ color: colors.textSecondary }}>
                        {service.description}
                      </LiquidGlassCardDescription>
                    </LiquidGlassCardHeader>
                    <LiquidGlassCardContent>
                      <ul className="space-y-2 mb-6">
                        {service.features.map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-center text-sm" style={{ color: colors.textSecondary }}>
                            <CheckCircle className="h-4 w-4 text-green-400 mr-2 flex-shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                      <LiquidGlassButton className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
                        Learn More
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </LiquidGlassButton>
                    </LiquidGlassCardContent>
                  </LiquidGlassCard>
                </ScaleIn>
              </StaggerItem>
            ))}
          </div>
        </StaggerContainer>

        {/* Features Section */}
        <section className="py-20" style={{ backgroundColor: colors.content + '20' }}>
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {features.map((feature, index) => (
                  <StaggerItem key={index}>
                    <ScaleIn delay={index * 0.1}>
                      <LiquidGlassCard className="text-center group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                        <LiquidGlassCardContent className="p-8">
                          <div className="p-4 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                            {feature.icon}
                          </div>
                          <h3 className="text-xl font-bold mb-4" style={{ color: colors.textPrimary }}>{feature.title}</h3>
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

        {/* CTA Section */}
        <section className="py-20">
          <div className="max-w-4xl mx-auto text-center">
            <FadeIn>
              <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: colors.textPrimary }}>
                Ready to Get Started?
              </h2>
              <p className="text-xl mb-8" style={{ color: colors.textSecondary }}>
                Contact us today for a free consultation and let us help you get the most out of your laptop.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <LiquidGlassButton 
                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                  onClick={() => window.location.href = '/contact'}
                >
                  <Phone className="w-5 h-5 mr-2" />
                  Get Quote
                </LiquidGlassButton>
                <LiquidGlassButton 
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10"
                  onClick={() => window.location.href = '/projects'}
                >
                  <Star className="w-5 h-5 mr-2" />
                  View Our Work
                </LiquidGlassButton>
              </div>
            </FadeIn>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Services;