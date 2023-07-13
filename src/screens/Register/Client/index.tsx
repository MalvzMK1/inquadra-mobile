import { useNavigation } from '@react-navigation/native';
import { View, Text } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

export default function Register() {
	const navigation = useNavigation();
	return (
		<View className="flex-1 bg-white">
			<View className="h-[150px] w-full flex items-center justify-center flex-col">
				<Text className="text-4xl font-bold text-[#4e4e4e] mb-6">Cadastro</Text>
				<Text className="text-xl text-[#959595]">Vamos precisar de alguns dados seus...</Text>
			</View>
			<View className="flex-1 bg-orange-200 flex flex-col justify-start p-20">
				<TouchableOpacity
					onPress={() =>
						navigation.navigate('HomeVariant', {
							photo: 'https://avatars.githubusercontent.com/u/92887081?v=4',
							name: 'Screen Name',
						})
					}
				>
					<Text>Go to next page</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
}

