/** @type {import('tailwindcss').Config} */
export default {
  // Content is auto-detected in v4
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        glass: {
          100: 'rgba(255, 255, 255, 0.1)',
          200: 'rgba(255, 255, 255, 0.2)',
          300: 'rgba(255, 255, 255, 0.3)',
          dark: 'rgba(0, 0, 0, 0.3)',
        },
        brand: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          500: '#0ea5e9', // Sky Blue
          600: '#0284c7',
          900: '#0c4a6e',
        },
        slate: {
          850: '#1e293b', // Custom Dark Sidebar
          900: '#0f172a',
        },
        neon: {
          blue: '#4facfe',
          purple: '#a18cd1', // Gradient end
          cyan: '#00f2fe',
        }
      },
      boxShadow: {
        'soft': '0 4px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px -1px rgba(0, 0, 0, 0.02)',
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        'neon': '0 0 10px rgba(79, 172, 254, 0.5), 0 0 20px rgba(79, 172, 254, 0.3)',
      },
      backgroundImage: {
        'main-gradient': 'linear-gradient(to right, #4facfe 0%, #00f2fe 100%)',
        'dark-gradient': 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
      }
    },
  },
  plugins: [],
}
