import React, { useState } from "react";
import { LiquidGlassCard, LiquidGlassCardContent, LiquidGlassCardDescription, LiquidGlassCardHeader, LiquidGlassCardTitle } from "../components/ui/liquid-glass";
import { LiquidGlassButton } from "../components/ui/liquid-glass-button";
import { Badge } from "../components/ui/badge";
import { FadeIn, ScaleIn, StaggerContainer, StaggerItem } from "../components/ScrollAnimations";
import { BikeBearText, AppleRevealText } from "../components/BikeBearAnimations";
import { Monitor, HardDrive, MemoryStick, Cpu, Zap, ShoppingCart, Star, CheckCircle } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";

const Products = () => {
  const { colors, isDark } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState("all");

  const products = [
    {
      id: 1,
      name: "Samsung 980 PRO 1TB NVMe SSD",
      category: "storage",
      price: "RM 450",
      originalPrice: "RM 520",
      rating: 4.8,
      reviews: 156,
      image: "/api/placeholder/300/200",
      features: ["PCIe 4.0", "Up to 7,000 MB/s", "5-year warranty", "Gaming optimized"],
      description: "High-performance NVMe SSD perfect for gaming and professional work."
    },
    {
      id: 2,
      name: "Corsair Vengeance 16GB DDR4",
      category: "memory",
      price: "RM 280",
      originalPrice: "RM 320",
      rating: 4.7,
      reviews: 89,
      image: "/api/placeholder/300/200",
      features: ["DDR4-3200", "Low latency", "Heat spreader", "Compatible with most laptops"],
      description: "Reliable RAM upgrade for improved multitasking and performance."
    },
    {
      id: 3,
      name: "Intel Core i7-12700H",
      category: "processor",
      price: "RM 1,200",
      originalPrice: "RM 1,400",
      rating: 4.9,
      reviews: 45,
      image: "/api/placeholder/300/200",
      features: ["12th Gen", "14 cores", "High performance", "Energy efficient"],
      description: "Latest generation processor for maximum computing power."
    },
    {
      id: 4,
      name: "ASUS ROG Strix G15",
      category: "laptop",
      price: "RM 4,500",
      originalPrice: "RM 5,200",
      rating: 4.6,
      reviews: 234,
      image: "/api/placeholder/300/200",
      features: ["RTX 3060", "16GB RAM", "512GB SSD", "144Hz display"],
      description: "Gaming laptop with excellent performance and build quality."
    },
    {
      id: 5,
      name: "Logitech MX Master 3",
      category: "accessories",
      price: "RM 280",
      originalPrice: "RM 320",
      rating: 4.8,
      reviews: 167,
      image: "/api/placeholder/300/200",
      features: ["Wireless", "70-day battery", "Precision tracking", "Multi-device"],
      description: "Premium wireless mouse for productivity and comfort."
    },
    {
      id: 6,
      name: "Dell XPS 13",
      category: "laptop",
      price: "RM 3,800",
      originalPrice: "RM 4,200",
      rating: 4.7,
      reviews: 189,
      image: "/api/placeholder/300/200",
      features: ["13.4\" 4K display", "11th Gen Intel", "16GB RAM", "Ultra-portable"],
      description: "Premium ultrabook with stunning display and performance."
    }
  ];

  const categories = [
    { id: "all", name: "All Products", icon: <Monitor className="h-5 w-5" /> },
    { id: "laptop", name: "Laptops", icon: <Monitor className="h-5 w-5" /> },
    { id: "storage", name: "Storage", icon: <HardDrive className="h-5 w-5" /> },
    { id: "memory", name: "Memory", icon: <MemoryStick className="h-5 w-5" /> },
    { id: "processor", name: "Processors", icon: <Cpu className="h-5 w-5" /> },
    { id: "accessories", name: "Accessories", icon: <Zap className="h-5 w-5" /> }
  ];

  const filteredProducts = selectedCategory === "all" 
    ? products 
    : products.filter(product => product.category === selectedCategory);

  return (
    <div className="min-h-screen py-20 px-4" style={{ backgroundColor: colors.background }}>
      <div className="max-w-7xl mx-auto">
        <FadeIn>
          <div className="text-center mb-16">
            <BikeBearText delay={0.2}>
              <h1 className="text-5xl font-bold mb-6" style={{ color: colors.textPrimary }}>
                Our <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Products</span>
              </h1>
            </BikeBearText>
            <p className="text-xl max-w-3xl mx-auto" style={{ color: colors.textSecondary }}>
              Quality hardware and accessories to upgrade your laptop and enhance your computing experience.
            </p>
          </div>
        </FadeIn>

        {/* Category Filter */}
        <StaggerContainer>
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {categories.map((category) => (
              <StaggerItem key={category.id}>
                <button
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 ${
                    selectedCategory === category.id
                      ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                      : isDark 
                        ? "text-white/70 hover:bg-white/10 hover:text-white" 
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  {category.icon}
                  <span>{category.name}</span>
                </button>
              </StaggerItem>
            ))}
          </div>
        </StaggerContainer>

        {/* Products Grid */}
        <StaggerContainer>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product, index) => (
              <StaggerItem key={product.id}>
                <ScaleIn delay={index * 0.1}>
                  <LiquidGlassCard className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                    <div className="relative overflow-hidden rounded-t-2xl">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <Badge className="absolute top-4 right-4 bg-red-500/80 text-white">
                        {Math.round(((parseFloat(product.originalPrice.replace('RM ', '')) - parseFloat(product.price.replace('RM ', ''))) / parseFloat(product.originalPrice.replace('RM ', ''))) * 100)}% OFF
                      </Badge>
                    </div>
                    
                    <LiquidGlassCardHeader>
                      <LiquidGlassCardTitle className="text-xl mb-2" style={{ color: colors.textPrimary }}>
                        {product.name}
                      </LiquidGlassCardTitle>
                      <LiquidGlassCardDescription className="mb-4" style={{ color: colors.textSecondary }}>
                        {product.description}
                      </LiquidGlassCardDescription>
                      
                      <div className="flex items-center mb-4">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`h-4 w-4 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                            />
                          ))}
                        </div>
                        <span className="ml-2 text-sm" style={{ color: colors.textSecondary }}>
                          {product.rating} ({product.reviews} reviews)
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-2 mb-4">
                        <span className="text-2xl font-bold" style={{ color: colors.textPrimary }}>{product.price}</span>
                        <span className="text-lg line-through" style={{ color: colors.textSecondary }}>{product.originalPrice}</span>
                      </div>
                    </LiquidGlassCardHeader>
                    
                    <LiquidGlassCardContent>
                      <div className="space-y-2 mb-6">
                        <h4 className="font-semibold" style={{ color: colors.textPrimary }}>Key Features:</h4>
                        {product.features.map((feature, featureIndex) => (
                          <div key={featureIndex} className="flex items-center text-sm" style={{ color: colors.textSecondary }}>
                            <CheckCircle className="h-4 w-4 text-green-400 mr-2 flex-shrink-0" />
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>
                      
                      <LiquidGlassButton className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Add to Cart
                      </LiquidGlassButton>
                    </LiquidGlassCardContent>
                  </LiquidGlassCard>
                </ScaleIn>
              </StaggerItem>
            ))}
          </div>
        </StaggerContainer>

        {filteredProducts.length === 0 && (
          <div className="text-center py-16">
            <p className="text-lg" style={{ color: colors.textSecondary }}>No products found for the selected category.</p>
          </div>
        )}

        {/* CTA Section */}
        <section className="py-20 mt-20">
          <div className="max-w-4xl mx-auto text-center">
            <FadeIn>
              <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: colors.textPrimary }}>
                Need Help Choosing?
              </h2>
              <p className="text-xl mb-8" style={{ color: colors.textSecondary }}>
                Our experts can help you find the perfect products for your needs and budget.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <LiquidGlassButton 
                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                  onClick={() => window.location.href = '/contact'}
                >
                  <Zap className="w-5 h-5 mr-2" />
                  Get Consultation
                </LiquidGlassButton>
                <LiquidGlassButton 
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10"
                  onClick={() => window.location.href = '/services'}
                >
                  <Monitor className="w-5 h-5 mr-2" />
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

export default Products;