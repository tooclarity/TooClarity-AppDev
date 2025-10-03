/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        montserrat: ["Montserrat-Regular", "sans-serif"],
        "montserrat-medium": ["Montserrat-Medium", "sans-serif"],
        "montserrat-semibold": ["Montserrat-SemiBold", "sans-serif"],
        "montserrat-bold": ["Montserrat-Bold", "sans-serif"],
      },
      colors: {
        primary: {
          DEFAULT: "#0222D7", // Main blue for buttons, progress, selections
        },
        text: {
          DEFAULT: "#060B13", // Primary text color
        },
        gray: {
          50: "#F9FAFB", // Light backgrounds
          100: "#F3F4F6", // Subtle backgrounds
          200: "#E5E7EB", // Inactive buttons, light borders
          300: "#D1D5DB", // Borders, dividers
          400: "#9CA3AF", // Secondary text, placeholders
          500: "#6B7280", // Muted text
          600: "#4B5563", // Description text
          700: "#374151", // Subtle text
          800: "#1F2937", // Dark text variants
          900: "#111827", // Almost black
        },
        neutral: {
          100: "#F5F6F9", // Dropdown option backgrounds
          200: "#EBEEFF", // Progress bar background
          300: "#DADADA", // Main borders
          400: "#A1A1A1", // Placeholders, muted
          500: "#C7C7C7", // Inactive button text
        },
        white: "#FFFFFF",
        black: "#000000",
      },
      borderRadius: {
        '12': '12px',
        '8': '8px',
        '20': '20px',
      },
      boxShadow: {
        'radio': '0 0 0 1.5px #000000',
      },
    },
  },
  plugins: [],
};