import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#6C63FF',
          light: '#8B85FF',
          dark: '#4F46E5',
        },
        accent: '#FF6B9D',
        emotion: {
          happy: '#FFD93D',
          sad: '#6B9BD2',
          angry: '#FF6B6B',
          surprised: '#FF9800',
          fearful: '#9C27B0',
          disgusted: '#66BB6A',
          neutral: '#90A4AE',
        },
      },
      fontFamily: {
        sans: ['Inter', 'PingFang SC', 'Microsoft YaHei', 'sans-serif'],
        mono: ['JetBrains Mono', 'SF Mono', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 2s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
