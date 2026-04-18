/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#F5F1E8',
        'cream-dark': '#EDE7D6',
        ink: '#1A1A1A',
        'ink-soft': '#2C2C2C',
        blood: '#8B2E1F',
        'blood-dark': '#6B1F14',
        gold: '#B8895C',
        'gold-light': '#D4A87E',
        mute: '#6B6359',
      },
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        body: ['Newsreader', 'Georgia', 'serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      letterSpacing: {
        tightest: '-0.04em',
      },
    },
  },
  plugins: [],
};
