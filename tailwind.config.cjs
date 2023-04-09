/** @type {import('tailwindcss').Config} */
const config = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
			colors: {
				'bom': '#F1635C',
				'primary': '#28d5e6',
			},
		},
  },
  plugins: [],
};

module.exports = config;
