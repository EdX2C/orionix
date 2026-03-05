'use client';
/* eslint-disable react-hooks/set-state-in-effect */
import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'dark' | 'light';

interface ThemeContextType {
          theme: Theme;
          toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({ theme: 'dark', toggleTheme: () => { } });

export function ThemeProvider({ children }: { children: React.ReactNode }) {
          const [theme, setTheme] = useState<Theme>('dark');
          const [mounted, setMounted] = useState(false);

          useEffect(() => {
                    const saved = localStorage.getItem('orionix_theme') as Theme | null;
                    if (saved === 'light' || saved === 'dark') setTheme(saved);
                    setMounted(true);
          }, []);

          useEffect(() => {
                    if (!mounted) return;
                    document.documentElement.setAttribute('data-theme', theme);
                    localStorage.setItem('orionix_theme', theme);
          }, [theme, mounted]);

          const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

          return (
                    <ThemeContext.Provider value={{ theme, toggleTheme }}>
                              {children}
                    </ThemeContext.Provider>
          );
}

export const useTheme = () => useContext(ThemeContext);
