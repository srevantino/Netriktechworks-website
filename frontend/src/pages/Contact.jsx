import React, { useState } from "react";
import { LiquidGlassCard, LiquidGlassCardContent, LiquidGlassCardDescription, LiquidGlassCardHeader, LiquidGlassCardTitle } from "../components/ui/liquid-glass";
import { LiquidGlassButton } from "../components/ui/liquid-glass-button";
import { AppleRevealText, BikeBearText } from "../components/BikeBearAnimations";
import { FadeIn, ScaleIn, StaggerContainer, StaggerItem } from "../components/ScrollAnimations";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Phone, Mail, MapPin, Clock, Send } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";

const Contact = () => {
  const { colors, isDark } = useTheme();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    message: ""
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        console.log('Form submitted successfully');
        setFormData({ name: "", email: "", phone: "", service: "", message: "" });
      } else {
        console.error('Form submission failed');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitted(false);
    }
  };

  const contactMethods = [
    {
      icon: <Phone className="h-6 w-6" />,
      title: "Phone",
      description: "Call us for immediate assistance",
      contact: "+60 12-345 6789"
    },
    {
      icon: <Mail className="h-6 w-6" />,
      title: "Email",
      description: "Send us an email anytime",
      contact: "info@netriktechworks.com"
    },
    {
      icon: <MapPin className="h-6 w-6" />,
      title: "Location",
      description: "Visit our service center",
      contact: "Kuala Lumpur, Malaysia"
    }
  ];

  return (
    <div className="min-h-screen py-20 px-4" style={{ backgroundColor: colors.background }}>
      <div className="max-w-7xl mx-auto">
        <FadeIn>
          <div className="text-center mb-16">
            <BikeBearText delay={0.2}>
              <h1 className="text-5xl font-bold mb-6" style={{ color: colors.textPrimary }}>
                Get in <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Touch</span>
              </h1>
            </BikeBearText>
            <p className="text-xl max-w-3xl mx-auto" style={{ color: colors.textSecondary }}>
              Ready to get your laptop serviced? Contact us today for a free consultation and quote.
            </p>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <StaggerContainer>
            <StaggerItem>
              <ScaleIn delay={0.2}>
                <LiquidGlassCard className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                  <LiquidGlassCardHeader>
                    <LiquidGlassCardTitle className="text-2xl mb-2" style={{ color: colors.textPrimary }}>
                      Send us a Message
                    </LiquidGlassCardTitle>
                    <LiquidGlassCardDescription style={{ color: colors.textSecondary }}>
                      Fill out the form below and we'll get back to you within 24 hours.
                    </LiquidGlassCardDescription>
                  </LiquidGlassCardHeader>
                  <LiquidGlassCardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="name" style={{ color: colors.textPrimary }}>Name *</Label>
                          <Input
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                            className="mt-1"
                            style={{ 
                              backgroundColor: colors.cardBg,
                              borderColor: colors.border,
                              color: colors.textPrimary
                            }}
                          />
                        </div>
                        <div>
                          <Label htmlFor="email" style={{ color: colors.textPrimary }}>Email *</Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                            className="mt-1"
                            style={{ 
                              backgroundColor: colors.cardBg,
                              borderColor: colors.border,
                              color: colors.textPrimary
                            }}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="phone" style={{ color: colors.textPrimary }}>Phone</Label>
                          <Input
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            className="mt-1"
                            style={{ 
                              backgroundColor: colors.cardBg,
                              borderColor: colors.border,
                              color: colors.textPrimary
                            }}
                          />
                        </div>
                        <div>
                          <Label htmlFor="service" style={{ color: colors.textPrimary }}>Service Needed</Label>
                          <Select value={formData.service} onValueChange={(value) => setFormData(prev => ({ ...prev, service: value }))}>
                            <SelectTrigger className="mt-1" style={{ 
                              backgroundColor: colors.cardBg,
                              borderColor: colors.border,
                              color: colors.textPrimary
                            }}>
                              <SelectValue placeholder="Select a service" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="laptop-repair">Laptop Repair</SelectItem>
                              <SelectItem value="hardware-upgrade">Hardware Upgrade</SelectItem>
                              <SelectItem value="software-installation">Software Installation</SelectItem>
                              <SelectItem value="data-recovery">Data Recovery</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="message" style={{ color: colors.textPrimary }}>Message *</Label>
                        <Textarea
                          id="message"
                          name="message"
                          value={formData.message}
                          onChange={handleInputChange}
                          required
                          rows={5}
                          className="mt-1"
                          style={{ 
                            backgroundColor: colors.cardBg,
                            borderColor: colors.border,
                            color: colors.textPrimary
                          }}
                        />
                      </div>

                      <LiquidGlassButton
                        type="submit"
                        disabled={isSubmitted}
                        className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                      >
                        {isSubmitted ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Sending...
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4 mr-2" />
                            Send Message
                          </>
                        )}
                      </LiquidGlassButton>
                    </form>
                  </LiquidGlassCardContent>
                </LiquidGlassCard>
              </ScaleIn>
            </StaggerItem>
          </StaggerContainer>

          {/* Contact Information */}
          <div className="space-y-8">
            <AppleRevealText delay={0.2}>
              <div className="space-y-6">
                <h2 className="text-2xl font-bold" style={{ color: colors.textPrimary }}>Get in Touch</h2>
                <div className="space-y-4">
                  {contactMethods.map((method, index) => (
                    <StaggerItem key={index}>
                      <ScaleIn delay={index * 0.1}>
                        <LiquidGlassCard className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                          <div className="p-6">
                            <div className="flex items-start space-x-4">
                              <div className="p-3 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl">
                                {method.icon}
                              </div>
                              <div>
                                <h3 className="text-lg font-semibold mb-1" style={{ color: colors.textPrimary }}>
                                  {method.title}
                                </h3>
                                <p className="mb-2" style={{ color: colors.textSecondary }}>
                                  {method.description}
                                </p>
                                <p className="font-medium" style={{ color: colors.textPrimary }}>
                                  {method.contact}
                                </p>
                              </div>
                            </div>
                          </div>
                        </LiquidGlassCard>
                      </ScaleIn>
                    </StaggerItem>
                  ))}
                </div>
              </div>
            </AppleRevealText>

            {/* Business Hours */}
            <StaggerItem>
              <ScaleIn delay={0.4}>
                <LiquidGlassCard className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                  <div className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="p-3 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl">
                        <Clock className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold mb-3" style={{ color: colors.textPrimary }}>
                          Business Hours
                        </h3>
                        <div className="space-y-1">
                          <div className="flex justify-between">
                            <span style={{ color: colors.textSecondary }}>Monday - Friday:</span>
                            <span style={{ color: colors.textPrimary }}>9:00 AM - 6:00 PM</span>
                          </div>
                          <div className="flex justify-between">
                            <span style={{ color: colors.textSecondary }}>Saturday:</span>
                            <span style={{ color: colors.textPrimary }}>10:00 AM - 4:00 PM</span>
                          </div>
                          <div className="flex justify-between">
                            <span style={{ color: colors.textSecondary }}>Sunday:</span>
                            <span style={{ color: colors.textPrimary }}>Closed</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </LiquidGlassCard>
              </ScaleIn>
            </StaggerItem>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;