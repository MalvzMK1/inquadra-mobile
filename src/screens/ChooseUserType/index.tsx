import { View, ImageBackground } from 'react-native';

export default function ChooseUserType() {
	return (
		<ImageBackground
			source={require('../../assets/football_field.jpg')}
			className="flex-1 bg-football-field flex flex-col items-center justify-center gap-4"
		>
			<View className="w-2/3 h-40 bg-white"></View>
			<View className="w-2/3 h-40 bg-white"></View>
		</ImageBackground>
	);
}
