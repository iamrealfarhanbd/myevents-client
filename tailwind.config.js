/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Map Tailwind's purple and blue to our CSS variables
        'primary': 'var(--color-primary)',
        'secondary': 'var(--color-secondary)',
        'accent': 'var(--color-accent)',
        // Override blue-600 and purple-600 with our variables
        blue: {
          500: 'var(--color-secondary)',
          600: 'var(--color-secondary)',
          700: 'var(--color-secondary)',
        },
        purple: {
          600: 'var(--color-primary)',
          700: 'var(--color-primary)',
        },
      },
      fontFamily: {
        sans: ['var(--font-family)', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: 'var(--border-radius)',
        'lg': 'var(--border-radius)',
        'md': 'var(--border-radius)',
      },
    },
  },
  plugins: [],
}
