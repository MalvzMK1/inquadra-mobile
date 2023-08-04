/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./App.tsx', './src/**/*.{js,jsx,ts,tsx}'],
	theme: {
		extend: {
			backgroundImage: {
				'football-field': "url('/src/assets/football_field.jpg')",
			},
			colors: {
				'dull-gray-color': 'rgba(182, 182, 182, 0.2)',
				'button-dull-gray-color': 'rgba(41, 41, 41, 0.5)'
			}
		}
	},
	plugins: [],
};
