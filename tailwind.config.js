/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#F8F4EC',
        paper: '#FFFCF7',
        teal: '#164E52',
        mint: '#DDF4ED',
        coral: '#E86D5C',
        gold: '#DDAA4B',
        slateText: '#18262B',
      },
      boxShadow: {
        card: '0 12px 30px rgba(22, 78, 82, 0.08)',
      },
      fontFamily: {
        sans: [
          'Inter',
          'Noto Sans Thai',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'sans-serif',
        ],
      },
    },
  },
  plugins: [],
};
