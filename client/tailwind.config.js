/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#E85D3A',
          hover: '#D14A2A',
          light: '#FFF0EC',
        },
        surface: {
          white: '#FFFFFF',
          page: '#F8F9FB',
          card: '#FFFFFF',
          hover: '#F0F2F5',
          border: '#E2E6ED',
        },
        text: {
          primary: '#1A1D23',
          secondary: '#5F6B7A',
          tertiary: '#8B95A5',
          inverse: '#FFFFFF',
        },
        status: {
          success: '#2D8A56',
          warning: '#D4950B',
          error: '#DC3545',
          info: '#3B82F6',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      borderRadius: {
        none: '0',
      },
      boxShadow: {
        'sm': '0 1px 2px rgba(0,0,0,0.06)',
        'md': '0 4px 6px rgba(0,0,0,0.07)',
        'lg': '0 10px 25px rgba(0,0,0,0.10)',
        'xl': '0 20px 40px rgba(0,0,0,0.12)',
      },
    },
  },
  plugins: [],
}
