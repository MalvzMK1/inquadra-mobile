/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./App.tsx', './src/**/*.{js,jsx,ts,tsx}'],
	theme: {
		extend: {
			backgroundImage: {
				'football-field': "url('/src/assets/football_field.jpg')",
			},
		}
	},
	plugins: [],
};
