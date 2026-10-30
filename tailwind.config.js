/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      // NOTE: App.tsx has one `hidden xs:flex` element (header Daily/Practice
      // switcher). Tailwind has no built-in `xs` breakpoint and the original
      // AI Studio design (see reference screenshots) never defined one, so
      // that element stays hidden. Do NOT add `screens: {xs: ...}` unless you
      // intentionally want the switcher to appear.
      fontFamily: {
        sans: [
          'Inter',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          'Helvetica',
          'Arial',
          'sans-serif',
        ],
      },
    },
  },
  plugins: [],
};
