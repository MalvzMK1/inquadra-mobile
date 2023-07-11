import { useNavigation } from '@react-navigation/native';
import { View, ImageBackground, Button } from 'react-native';

export default function ChooseUserType() {
	const navigation = useNavigation();
	return (
		<ImageBackground
			source={require('../../assets/football_field.jpg')}
			className="flex-1 bg-football-field flex flex-col items-center justify-center gap-4"
		>
			<View className="w-2/3 h-40 bg-white">
				<Button
					title="Go to next page"
					onPress={() => navigation.navigate('Register', { name: 'Teste' })} // Problema com tipagem?
				/>
			</View>
			<View className="w-2/3 h-40 bg-white"></View>
		</ImageBackground>
	);
}
