import { View, Text, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native-gesture-handler';

export default function Login() {
	const navigation = useNavigation();
	return (
		<View className="flex-1 flex items-center justify-center h-screen w-screen bg-white">
			<TouchableOpacity onPress={() => navigation.navigate('ChooseUserType')}>
				<Text>Hello World!</Text>
			</TouchableOpacity>
		</View>
	);
}
