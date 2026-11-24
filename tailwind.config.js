/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg)', card: 'var(--card)', bar: 'var(--bar)', sep: 'var(--sep)',
        label: 'var(--label)', label2: 'var(--label2)', label3: 'var(--label3)',
        fill: 'var(--fill)', fill3: 'var(--fill3)', seg: 'var(--seg)',
        tint: 'var(--tint)', danger: 'var(--danger)', ok: 'var(--ok)',
      },
    },
  },
  plugins: [],
}
