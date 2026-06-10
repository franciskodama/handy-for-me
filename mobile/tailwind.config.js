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
        primary: {
          DEFAULT: '#0F1739', // Deep navy
          foreground: '#FFFFFF',
        },
        accent: {
          DEFAULT: '#DDF906', // Neon yellow
          foreground: '#0F1739',
        },
        background: '#F8FAFC', // Slate background gray
        card: {
          DEFAULT: '#FFFFFF',
          foreground: '#0F1739',
        },
        border: '#0F1739', // Navy border
        muted: {
          DEFAULT: '#64748B', // Slate-500
          foreground: '#94A3B8', // Slate-400
        },
      },
      fontFamily: {
        kumbh: ["KumbhSans-Regular"],
      }
    },
  },
  plugins: [],
}
