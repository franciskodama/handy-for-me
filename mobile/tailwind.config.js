/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: [
    "./src/app/**/*.{js,jsx,ts,tsx}",
    "./src/components/**/*.{js,jsx,ts,tsx}",
    "./src/screens/**/*.{js,jsx,ts,tsx}"
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: '#0F1739',     // Deep navy
        accent: '#DDF906',      // Neon yellow
        background: '#F8FAFC',  // Slate background gray
        card: '#FFFFFF',        // White card background
        border: '#0F1739',      // Navy border
        muted: '#64748B',       // Slate gray
      },
      fontFamily: {
        kumbh: ["KumbhSans-Regular"],
      }
    },
  },
  plugins: [],
}
