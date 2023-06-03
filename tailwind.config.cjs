/** @type {import('tailwindcss').Config} */
const config = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
			colors: {
				'bom': '#F1635C',
				'primary': {
          'light': '#92b3fd',
          DEFAULT: '#296cff',
          'dark': '#0954f9'
        }
        
			},
		},
  },
  plugins: [],
};

module.exports = config;
