import React, { useState } from 'react'
import { View, Text, Button, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { TextInput } from 'react-native-paper';
import { orange300, transparent } from 'react-native-paper/lib/typescript/src/styles/themes/v2/colors';
import { Colors } from 'react-native/Libraries/NewAppScreen';



export default function Login() {
	const [userEmail, setUserEmail] = useState<string>("");
	const [userPassWord, setUserPassword] = useState<string>("")


	const navigation = useNavigation();
	return (
		<View className="flex-1 flex items-center justify-center h-max w-max bg-white px-7">
			<TouchableOpacity onPress={() => navigation.navigate('ChooseUserType')}>
				<Text className='text-base text-gray-400 pb-5'>Seja bem vindo</Text>
			</TouchableOpacity>			

			<View className="w-full">
			
			<View className="h-14">
				<TextInput className= "h-14"
					value={userEmail}
					onChangeText={setUserEmail}
					mode='outlined'
					label="Email"
					theme={{
						colors: {
							placeholder: 'gray',
							primary: 'gray',
						}
					}}
				/>
			</View>


			<View className='h-14 pt-4'>
				<TextInput className="h-14"
					secureTextEntry
					value={userPassWord}
					onChangeText={setUserPassword}
					mode='outlined'
					label="******"
					theme={{
						colors: {
							placeholder: 'gray',
							primary: 'gray',
						}
					}}
				/>
			</View>

			
			<View className='flex items-end pt-8'>
				<TouchableOpacity>
					<Text className='text-gray-400 text-base'>esqueceu a senha?</Text>
				</TouchableOpacity>
			</View>

			<View className='h-11 pt-4'>
				<TouchableOpacity className='h-14 w-81 rounded-md bg-orange-500 flex items-center justify-center'>
					<Text className='text-gray-50'>Entrar</Text>
				</TouchableOpacity>
			</View>

			<View className='flex items-center justify-center pt-12'>
				<TouchableOpacity className=''>
					<Image source={require('../../assets/google.png')} className=''></Image>
				</TouchableOpacity>
			</View>

			<View className='flex-row  items-center justify-center pt-11'>
				<Text className='text-base text-gray-400'>Ainda não tem uma conta?</Text>
				<TouchableOpacity>
					<Text className='text-orange-500 text-base'> Clique aqui</Text>
				</TouchableOpacity>
			</View>

			</View>
		</View>
			
	);
}
