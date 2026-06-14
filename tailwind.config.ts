import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        yellow: {
          50: '#fffef2',
          100: '#fffce5',
          200: '#fffacc',
          300: '#fff7ad',
          400: '#fff08a',
          500: '#ffe566',
          600: '#ffd93d',
          700: '#ffc107',
          800: '#e6ad00',
          900: '#b38600',
        },
      },
    },
  },
  plugins: [],
}

export default config
