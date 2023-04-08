/** @type {import('tailwindcss').Config} */
const config = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
			colors: {
				'bom': '#F1635C'
			},
		},
  },
  plugins: [],
};

module.exports = config;
