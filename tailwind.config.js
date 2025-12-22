/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,css}", "./public/**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        'custom-violet': {
          200: '#DEBCFE',
          300: '#5617D4',
          400: '#AF85F1', // The lighter shade
          900: '#4C1C96', // The darker shade
          1000: '#1C027D'
        },
      },
      boxShadow: {
        // Define your custom shadow utility here
        // The key 'custom-dark' becomes the utility class 'shadow-custom-dark'
        'custom-outline': '0 3px 5px -3px rgba(0, 0, 0, 0.5), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',

        'custom-dark': '10px 10px 5px -3px rgba(0, 0, 0, 0.5), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',

        'custom-dark-sm': '8px 8px 3px -3px rgba(0, 0, 0, 0.5), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        
        // Example with a different style
        'soft-glow': '0 8px 30px 0 rgba(100, 100, 100, 0.4)',
      },
      textShadow: {
        // Define your custom shadow utilities here
        'sm': '1px 1px 2px var(--tw-shadow-color, rgba(0, 0, 0, 0.4))',
        'md': '2px 2px 4px var(--tw-shadow-color, rgba(0, 0, 0, 0.6))',
        'lg': '3px 3px 6px var(--tw-shadow-color, rgba(0, 0, 0, 0.8))',
        'none': 'none',
      },
    },
  },
  plugins: [
    function ({ addUtilities, theme, e }) {
      const newUtilities = {}
      const textShadows = theme('textShadow', {})
      
      for (const [key, value] of Object.entries(textShadows)) {
        newUtilities[`.text-shadow-${key}`] = {
          'text-shadow': value,
        }
      }

      addUtilities(newUtilities, ['responsive', 'hover'])
    },
    require('tailwind-scrollbar-hide')
  ],
}

