/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./App.tsx', './src/**/*.{js,jsx,ts,tsx}'],
	theme: {
		extend: {
			width: {
				'1/96': '1.041666667%', // 1/96
				'2/96': '2.083333333%', // 2/96
				// Adicione os valores que deseja aqui
				// ...
				'50': '50%', // 50% (se você deseja uma largura de 50% do contêiner)
			  },
			backgroundImage: {
				'football-field': "url('/src/assets/football_field.jpg')",
			},
		}
	},
	plugins: [],
};
