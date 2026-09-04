/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'mexican-pink': '#E4007C',
        'cempasuchil': '#FFB703',
        'turquoise': '#00A896',
        'nopal-green': '#2D6A4F',
        'mandarina': '#FB8500',
        'petroleo-teal': '#0B4F6C',
        'rose-primary': '#E11D48',
        'rose-dark': '#BE123C',
        'wax-crimson': '#B91C1C',
      },
      fontFamily: {
        cynthia: ['"Great Vibes"', '"Allura"', 'cursive'],
        script: ['"Allura"', '"Great Vibes"', 'cursive'],
        heading: ['"Cinzel Decorative"', 'Georgia', 'serif'],
        subheading: ['"Pacifico"', 'cursive'],
        badge: ['"Amatic SC"', 'cursive'],
        handwriting: ['"Patrick Hand"', '"Caveat"', 'cursive'],
        fuerte: ['"Shrikhand"', 'cursive', 'sans-serif'],
        bonita: ['"Parisienne"', '"Alex Brush"', '"Allura"', 'cursive'],
        historia: ['"Dancing Script"', '"Caveat"', 'cursive'],
        ratones: ['"Cormorant Garamond"', '"Playfair Display"', 'Georgia', 'serif'],
      },
      boxShadow: {
        'soft': '0 12px 35px rgba(225, 29, 72, 0.08), 0 4px 12px rgba(0, 0, 0, 0.03)',
        'polaroid': '0 14px 28px rgba(0, 0, 0, 0.12), 0 6px 12px rgba(0, 0, 0, 0.06)',
        'wax': '0 6px 16px rgba(185, 28, 28, 0.45), inset 0 2px 4px rgba(255, 255, 255, 0.4), inset 0 -3px 5px rgba(0, 0, 0, 0.35)',
      }
    },
  },
  plugins: [],
}
