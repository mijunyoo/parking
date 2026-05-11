/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        kakao: '#FEE500',
        ink: {
          900: '#222222',
          800: '#333333',
          600: '#666666',
          400: '#999999',
          200: '#E5E5E5',
        },
        bg: {
          page: '#FAFAFB',
          fill: '#F0F0F0',
        },
        zone: {
          blue: '#CFE3F0',
          blueDeep: '#4E86B6',
          green: '#C9E6C9',
          peach: '#F8D4AB',
          pink: '#F3D6E7',
          pinkDeep: '#C79AB7',
          gray: '#888888',
          sign: '#F5C4C9',
        },
        brand: {
          mercedes: '#16409C',
          jaguar: '#E54E9B',
          audi: '#C11010',
        },
      },
      fontFamily: {
        sans: ['"Noto Sans KR"', '-apple-system', 'BlinkMacSystemFont', '"Apple SD Gothic Neo"', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '12px',
      },
    },
  },
  plugins: [],
};
