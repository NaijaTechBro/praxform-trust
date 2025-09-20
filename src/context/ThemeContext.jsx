import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'system');

    useEffect(() => {
        
        const root = window.document.documentElement;
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

        const applySystemTheme = () => {
            root.classList.remove('light', 'dark');
            root.classList.add(mediaQuery.matches ? 'dark' : 'light');
        };

        if (theme === 'light' || theme === 'dark') {
            root.classList.remove('light', 'dark');
            root.classList.add(theme);
        } else {
            applySystemTheme();
            mediaQuery.addEventListener('change', applySystemTheme);
        }
        
        localStorage.setItem('theme', theme);

        return () => {
            mediaQuery.removeEventListener('change', applySystemTheme);
        };
    }, [theme]);

    useEffect(() => {
        const handleStorageChange = (e) => {
            if (e.key === 'theme' && e.newValue) {
                setTheme(e.newValue);
            }
        };
        window.addEventListener('storage', handleStorageChange);
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    const value = useMemo(() => ({ theme, setTheme }), [theme]);

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};