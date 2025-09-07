import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    // Check localStorage first, then default to 'dark'
    const savedTheme = localStorage.getItem('theme');
    return savedTheme || 'dark';
  });

  useEffect(() => {
    // Save theme to localStorage
    localStorage.setItem('theme', theme);
    
    // Apply theme to document and set CSS variables
    const root = document.documentElement;
    
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
      // Set dark theme colors - Russian blue background, light text
      root.style.setProperty('--content-color', '#0C0A3E');
      root.style.setProperty('--bg-color', '#1E3A8A'); // FIXED: Changed to Russian blue
      root.style.setProperty('--text-primary', '#ffffff');
      root.style.setProperty('--text-secondary', '#ffffff80');
      root.style.setProperty('--card-bg', 'rgba(255, 255, 255, 0.1)');
      root.style.setProperty('--border-color', 'rgba(255, 255, 255, 0.2)');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
      // Set light theme colors - light background, dark text with better contrast
      root.style.setProperty('--content-color', '#f6f6f6');
      root.style.setProperty('--bg-color', '#ffffff');
      root.style.setProperty('--text-primary', '#1a1a1a'); // Darker for better contrast
      root.style.setProperty('--text-secondary', '#4a4a4a'); // Darker gray for better readability
      root.style.setProperty('--card-bg', 'rgba(12, 10, 62, 0.12)'); // Better card visibility
      root.style.setProperty('--border-color', 'rgba(12, 10, 62, 0.2)'); // More visible borders
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'dark' ? 'light' : 'dark');
  };

  const value = {
    theme,
    toggleTheme,
    isDark: theme === 'dark',
    isLight: theme === 'light',
    colors: {
      content: theme === 'dark' ? '#0C0A3E' : '#f6f6f6',
      background: theme === 'dark' ? '#1E3A8A' : '#ffffff', // FIXED: Russian blue for dark mode
      textPrimary: theme === 'dark' ? '#ffffff' : '#1a1a1a', // Darker for light mode
      textSecondary: theme === 'dark' ? '#ffffff80' : '#4a4a4a', // Better contrast
      cardBg: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(12, 10, 62, 0.12)', // Better card visibility
      border: theme === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(12, 10, 62, 0.2)' // More visible borders
    }
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};