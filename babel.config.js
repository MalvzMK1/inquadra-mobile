module.exports = function (api) {
	api.cache(true);
	return {
		presets: ['babel-preset-expo'],
		plugins: ['nativewind/babel', 'import-graphql'],
		env: {
			production: {
				plugins: ['react-native-paper/babel'],
			},
		},
	};
};
