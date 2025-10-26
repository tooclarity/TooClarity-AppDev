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
          DEFAULT: "#0222D7",
        },
        text: {
          DEFAULT: "#060B13",
        },
        gray: {
          50: "#F9FAFB",
          100: "#F3F4F6",
          200: "#E5E7EB",
          300: "#D1D5DB",
          400: "#9CA3AF",
          500: "#6B7280",
          600: "#4B5563",
          700: "#374151",
          800: "#1F2937",
          900: "#111827",
        },
        neutral: {
          100: "#F5F6F9",
          200: "#EBEEFF",
          300: "#DADADA",
          400: "#A1A1A1",
          500: "#C7C7C7",
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