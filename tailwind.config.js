/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        csc: {
          navy: '#0B3C5D',
          darkBlue: '#1D2731',
          lightBlue: '#328CC1',
          gold: '#D9B310',
          accent: '#0066CC',
          bgLight: '#F4F7FB',
          green: '#10B981'
        }
      },
      fontFamily: {
        sans: ['Inter', 'Noto Sans Bengali', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
