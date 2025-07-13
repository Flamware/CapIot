/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",

  ],
  theme: {
    extend: {
      colors: {
        green: { // This will extend the default Tailwind 'green' palette
          '50': 'oklch(97% 0.03 178)',
          '100': 'oklch(94% 0.06 178)',
          '200': 'oklch(90% 0.09 178)',
          '300': 'oklch(80% 0.08 178)',
          '400': 'oklch(70% 0.10 178)',
          '500': 'oklch(72% 0.11 178)', // Note: Your 500 and 600 were very close, adjusted 500 slightly
          '600': 'oklch(60% 0.10 178)',
          // You can add more shades like 700, 800, 900 if needed
          '700': 'oklch(50% 0.09 178)',
          '800': 'oklch(40% 0.08 178)',
          '900': 'oklch(30% 0.07 178)',
        },
    },
  },
  plugins: [],
  // Add purge options for production builds (recommended)
  purge: {
    enabled: process.env.NODE_ENV === 'production',
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
      // Add more specific paths if necessary
      // Example: "./src/components/**/*.{js,ts,jsx,tsx}",
      // Example: "./src/pages/**/*.{js,ts,jsx,tsx}",
    ],
    safelist: [
      // Add classes that should not be purged, even if not explicitly used
      // Example: 'bg-red-500', 'text-center',
    ],
  },
    },
    variants: {
        extend: {
            backgroundColor: ['active'],
            textColor: ['visited'],
            borderColor: ['focus-visible'],
        },
        },
    }