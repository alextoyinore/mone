/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        500: '#009616', // Main brand color
        600: '#008A14',
        700: '#007A12',
        800: '#006A10',
        900: '#005A0E',
      },
      
      background: {
        light: '#FFFFFF',
        dark: '#121212' // Spotify dark theme
      },
      text: {
        primary: {
          light: '#191414', // Spotify black
          dark: '#FFFFFF'
        },
        secondary: {
          light: '#535353',
          dark: '#B3B3B3'
        }
      },
      brand: {
        primary: '#3b82f6',
        secondary: '#10b981',
        accent: '#6366f1'
      },

      accent: {
        default: '#22d3ee', // Cyan
        50: '#ecfeff',
        100: '#cffafe',
        200: '#a5f3fc',
        300: '#67e8f9',
        400: '#22d3ee',
        500: '#06b6d4',
        600: '#0891b2',
        700: '#0e7490',
        800: '#155e75',
        900: '#164e63',
      },
      neutral: {
        50: '#fafafa',
        100: '#f4f4f5',
        200: '#e4e4e7',
        300: '#d4d4d8',
        400: '#a1a1aa',
        500: '#71717a',
        600: '#52525b',
        700: '#3f3f46',
        800: '#27272a',
        900: '#18181b',
      }
    },
    
    fontFamily: {
      sans: ['Inter', 'system-ui', 'sans-serif'],
      display: ['Clash Display', 'system-ui', 'sans-serif']
    },
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    boxShadow: {
      'soft': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
      'medium': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      'large': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      'hover': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      'inner': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
    },
    borderRadius: {
      'xl': '1rem',
      '2xl': '1.5rem',
      '3xl': '2rem'
    },
    keyframes: {
      'fade-in': {
        '0%': { opacity: '0' },
        '100%': { opacity: '1' },
      },
      'slide-in': {
        '0%': { transform: 'translateY(100%)' },
        '100%': { transform: 'translateY(0)' },
      },
      'dropdown': {
        '0%': { opacity: '0', transform: 'scale(0.95) translateY(-10px)' },
        '100%': { opacity: '1', transform: 'scale(1) translateY(0)' },
      }
    },
    animation: {
      'fade-in': 'fade-in 0.5s ease-out',
      'slide-in': 'slide-in 0.5s ease-out',
      'dropdown': 'dropdown 0.2s ease-out',
    },
    backdropBlur: {
      xs: '2px',
    },
  },
};
export const darkMode = 'class';
export const plugins = [];
