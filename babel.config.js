module.exports = function (api) {
	api.cache(true);
	return {
		presets: [
			'babel-preset-expo',
		],
		plugins: [
			'nativewind/babel',
			'react-native-reanimated/plugin',
			'import-graphql',
			['module:react-native-dotenv',
			{
				envName: "APP_ENV",
				moduleName: "@env",
				path: ".env"
			}]
			],
		env: {
			production: {
				plugins: ['react-native-paper/babel'],
			},
		},
	};
};
