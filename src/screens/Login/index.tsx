import { View, Text, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { TextInput } from 'react-native-paper';
import { transparent } from 'react-native-paper/lib/typescript/src/styles/themes/v2/colors';
import { Colors } from 'react-native/Libraries/NewAppScreen';

export default function Login() {
	const navigation = useNavigation();
	return (
		<View className="flex-1 flex items-center justify-center h-max w-max bg-white px-7">
			<TouchableOpacity onPress={() => navigation.navigate('ChooseUserType')}>
				<Text>Seja bem vindo</Text>
			</TouchableOpacity>			

			<View className="w-full">
			
			<TextInput
				mode='outlined'
				label="Email"
				theme={{
					colors: {
						placeholder: 'gray',
						primary: 'gray',
					}
				}}
			/>


			
			<TextInput
				mode='outlined'
				label="******"
				theme={{
					colors: {
						placeholder: 'gray',
						primary: 'gray',
					}
				}}
			/>

			<View className='flex items-end'>
				<Text>esqueceu a senha?</Text>
			</View>

			</View>
		</View>
			
	);
}
