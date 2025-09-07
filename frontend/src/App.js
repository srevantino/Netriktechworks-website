import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Services from "./pages/Services";
import Products from "./pages/Products";
import Contact from "./pages/Contact";
import Projects from "./pages/Projects";
import Testimonials from "./pages/Testimonials";
import AdminDashboard from "./pages/admin/AdminDashboard";
import Header from "./components/Header";
import { Footer } from "./components/Footer";
import CursorReactiveBackground from "./components/CursorReactiveBackground";
import { ThemeProvider } from "./contexts/ThemeContext";

function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/a7k-9m2-x4n-8p1-q5r');

  return (
    <div className="App relative min-h-screen">
      <CursorReactiveBackground />
      <div className="relative" style={{ zIndex: 10 }}>
        {!isAdminRoute && <Header />}
        <main className="min-h-screen">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/products" element={<Products />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/testimonials" element={<Testimonials />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/a7k-9m2-x4n-8p1-q5r/*" element={<AdminDashboard />} />
          </Routes>
        </main>
        {!isAdminRoute && <Footer />}
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;