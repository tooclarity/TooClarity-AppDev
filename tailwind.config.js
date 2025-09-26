/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        "rubik-bold": ["Rubik-Bold", "sans-serif"],
        "rubik-semibold": ["Rubik-SemiBold", "sans-serif"],
        "rubik-extrabold": ["Rubik-ExtraBold", "sans-serif"],
        "rubik-light": ["Rubik-Light", "sans-serif"],
        "rubik": ["Rubik-Regular", "sans-serif"],
        "rubik-medium": ["Rubik-Medium", "sans-serif"],
      },
      colors: {
        white: "#FFFFFF",
        gray: {
          300: "#D1D5DB", // borders / divider
          500: "#6B7280", // "or" text
          600: "#4B5563", // description text
          800: "#1F2937", // main text
        },
        primary: {
          DEFAULT: "#0222D7", // primary button color
        },
      },
    },
  },
  plugins: [],
};
