import React from "react";
import { LiquidGlassCard, LiquidGlassCardHeader, LiquidGlassCardContent, LiquidGlassCardTitle, LiquidGlassCardDescription, LiquidGlassButton } from "../components/ui/liquid-glass";
import { FadeIn, ScaleIn, StaggerContainer, StaggerItem } from "../components/ScrollAnimations";
import { BikeBearText, AppleRevealText } from "../components/BikeBearAnimations";
import { Users, Award, Clock, Target, CheckCircle, ArrowRight, Phone, Star } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";

const About = () => {
  const { colors, isDark } = useTheme();

  const values = [
    {
      icon: <Users className="h-8 w-8" />,
      title: "Customer First",
      description: "We prioritize our customers' needs and satisfaction above all else."
    },
    {
      icon: <Award className="h-8 w-8" />,
      title: "Quality Excellence",
      description: "We maintain the highest standards in all our services and repairs."
    },
    {
      icon: <Clock className="h-8 w-8" />,
      title: "Timely Service",
      description: "We understand the importance of quick turnaround times."
    },
    {
      icon: <Target className="h-8 w-8" />,
      title: "Precision Work",
      description: "Every repair and upgrade is done with meticulous attention to detail."
    }
  ];

  const team = [
    {
      name: "Ahmad Rahman",
      role: "Lead Technician",
      experience: "8+ years",
      specialties: ["Hardware Repair", "Data Recovery", "System Optimization"]
    },
    {
      name: "Sarah Lim",
      role: "Software Specialist",
      experience: "6+ years",
      specialties: ["Software Installation", "Virus Removal", "System Maintenance"]
    },
    {
      name: "David Kumar",
      role: "Hardware Engineer",
      experience: "10+ years",
      specialties: ["Hardware Upgrades", "Screen Replacement", "Battery Services"]
    }
  ];

  const achievements = [
    { number: "500+", label: "Laptops Repaired" },
    { number: "98%", label: "Success Rate" },
    { number: "24/7", label: "Customer Support" },
    { number: "5+", label: "Years Experience" }
  ];

  return (
    <div className="min-h-screen py-20 px-4" style={{ backgroundColor: colors.background }}>
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <FadeIn>
          <div className="text-center mb-20">
            <BikeBearText delay={0.2}>
              <h1 className="text-5xl font-bold mb-6" style={{ color: colors.textPrimary }}>
                About <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Netrik Techworks</span>
              </h1>
            </BikeBearText>
            <p className="text-xl max-w-3xl mx-auto" style={{ color: colors.textSecondary }}>
              Your trusted partner in laptop repair, upgrades, and IT solutions. 
              We've been serving the community with excellence and reliability.
            </p>
          </div>
        </FadeIn>

        {/* Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          <StaggerItem>
            <ScaleIn delay={0.2}>
              <LiquidGlassCard className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                <LiquidGlassCardHeader>
                  <LiquidGlassCardTitle className="text-3xl mb-4" style={{ color: colors.textPrimary }}>
                    Our Story
                  </LiquidGlassCardTitle>
                  <LiquidGlassCardDescription className="text-lg" style={{ color: colors.textSecondary }}>
                    Founded in 2019, Netrik Techworks started as a small repair shop with a big vision: 
                    to provide affordable, reliable laptop repair services to everyone. What began as a 
                    passion project has grown into a trusted name in the IT services industry.
                  </LiquidGlassCardDescription>
                </LiquidGlassCardHeader>
                <LiquidGlassCardContent>
                  <p className="mb-6" style={{ color: colors.textSecondary }}>
                    Over the years, we've expanded our services to include hardware upgrades, 
                    data recovery, and comprehensive IT support. Our commitment to quality and 
                    customer satisfaction has earned us a loyal customer base and numerous 
                    positive reviews.
                  </p>
                  <LiquidGlassButton className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
                    Learn More
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </LiquidGlassButton>
                </LiquidGlassCardContent>
              </LiquidGlassCard>
            </ScaleIn>
          </StaggerItem>

          <StaggerItem>
            <ScaleIn delay={0.4}>
              <LiquidGlassCard className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                <LiquidGlassCardHeader>
                  <LiquidGlassCardTitle className="text-3xl mb-4" style={{ color: colors.textPrimary }}>
                    Our Mission
                  </LiquidGlassCardTitle>
                  <LiquidGlassCardDescription className="text-lg" style={{ color: colors.textSecondary }}>
                    To provide exceptional laptop repair and IT services that help our customers 
                    stay productive and connected in today's digital world.
                  </LiquidGlassCardDescription>
                </LiquidGlassCardHeader>
                <LiquidGlassCardContent>
                  <ul className="space-y-3">
                    {[
                      "Deliver fast, reliable repair services",
                      "Provide honest, transparent pricing",
                      "Use only quality parts and components",
                      "Offer comprehensive warranty coverage",
                      "Maintain the highest service standards"
                    ].map((item, index) => (
                      <li key={index} className="flex items-center" style={{ color: colors.textSecondary }}>
                        <CheckCircle className="h-5 w-5 text-green-400 mr-3 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </LiquidGlassCardContent>
              </LiquidGlassCard>
            </ScaleIn>
          </StaggerItem>
        </div>

        {/* Values Section */}
        <section className="mb-20">
          <FadeIn>
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: colors.textPrimary }}>
                Our <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Values</span>
              </h2>
              <p className="text-xl max-w-3xl mx-auto" style={{ color: colors.textSecondary }}>
                The principles that guide everything we do and every service we provide.
              </p>
            </div>
          </FadeIn>

          <StaggerContainer>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <StaggerItem key={index}>
                  <ScaleIn delay={index * 0.1}>
                    <LiquidGlassCard className="text-center group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                      <LiquidGlassCardContent className="p-8">
                        <div className="p-4 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                          {value.icon}
                        </div>
                        <h3 className="text-xl font-bold mb-4" style={{ color: colors.textPrimary }}>{value.title}</h3>
                        <p style={{ color: colors.textSecondary }}>
                          {value.description}
                        </p>
                      </LiquidGlassCardContent>
                    </LiquidGlassCard>
                  </ScaleIn>
                </StaggerItem>
              ))}
            </div>
          </StaggerContainer>
        </section>

        {/* Team Section */}
        <section className="mb-20">
          <FadeIn>
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: colors.textPrimary }}>
                Meet Our <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Team</span>
              </h2>
              <p className="text-xl max-w-3xl mx-auto" style={{ color: colors.textSecondary }}>
                Experienced professionals dedicated to providing you with the best service possible.
              </p>
            </div>
          </FadeIn>

          <StaggerContainer>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {team.map((member, index) => (
                <StaggerItem key={index}>
                  <ScaleIn delay={index * 0.1}>
                    <LiquidGlassCard className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                      <LiquidGlassCardContent className="p-8 text-center">
                        <div className="w-20 h-20 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full mx-auto mb-6 flex items-center justify-center">
                          <Users className="h-10 w-10" />
                        </div>
                        <h3 className="text-xl font-bold mb-2" style={{ color: colors.textPrimary }}>{member.name}</h3>
                        <p className="text-lg mb-1" style={{ color: colors.textSecondary }}>{member.role}</p>
                        <p className="text-sm mb-4" style={{ color: colors.textSecondary }}>{member.experience}</p>
                        <div className="space-y-1">
                          {member.specialties.map((specialty, specIndex) => (
                            <span key={specIndex} className="inline-block px-3 py-1 text-xs rounded-full mr-2 mb-2" style={{ backgroundColor: colors.content + '20', color: colors.textSecondary }}>
                              {specialty}
                            </span>
                          ))}
                        </div>
                      </LiquidGlassCardContent>
                    </LiquidGlassCard>
                  </ScaleIn>
                </StaggerItem>
              ))}
            </div>
          </StaggerContainer>
        </section>

        {/* Achievements Section */}
        <section className="py-20" style={{ backgroundColor: colors.content + '20' }}>
          <div className="max-w-7xl mx-auto">
            <FadeIn>
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: colors.textPrimary }}>
                  Our <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Achievements</span>
                </h2>
                <p className="text-xl max-w-3xl mx-auto" style={{ color: colors.textSecondary }}>
                  Numbers that reflect our commitment to excellence and customer satisfaction.
                </p>
              </div>
            </FadeIn>

            <StaggerContainer>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {achievements.map((achievement, index) => (
                  <StaggerItem key={index}>
                    <ScaleIn delay={index * 0.1}>
                      <LiquidGlassCard className="text-center group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                        <LiquidGlassCardContent className="p-8">
                          <div className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                            {achievement.number}
                          </div>
                          <p style={{ color: colors.textSecondary }}>{achievement.label}</p>
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
                Ready to Work With Us?
              </h2>
              <p className="text-xl mb-8" style={{ color: colors.textSecondary }}>
                Experience the difference that professional, reliable service can make for your laptop.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <LiquidGlassButton 
                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                  onClick={() => window.location.href = '/contact'}
                >
                  <Phone className="w-5 h-5 mr-2" />
                  Contact Us
                </LiquidGlassButton>
                <LiquidGlassButton 
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10"
                  onClick={() => window.location.href = '/services'}
                >
                  <Star className="w-5 h-5 mr-2" />
                  Our Services
                </LiquidGlassButton>
              </div>
            </FadeIn>
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;