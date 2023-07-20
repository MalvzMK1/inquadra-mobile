import React, {useEffect, useState} from 'react'
import { View, Text, Image, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { TextInput } from 'react-native-paper';
import useRegisterUser from '../../hooks/useRegisterUser';
import useUpdateUser from '../../hooks/useUpdateUser';
import useDeleteUser from '../../hooks/useDeleteUser';
import useRegisterEstablishment from '../../hooks/useRegisterEstablishment';
import useUpdateEstablishment from '../../hooks/useUpdateEstablishment';
import useDeleteEstablishment from '../../hooks/useDeleteEstablishment';
import useRegisterCourt from '../../hooks/useRegisterCourt';
import useUpdateCourt from '../../hooks/useUpdateCourt';

export default function Login() {
	const [userEmail, setUserEmail] = useState<string>("");
	const [userPassWord, setUserPassword] = useState<string>("")
	const [showPassword, setShowPassword] = useState<boolean>(false)

	const [teste, { data, loading, error }] = useUpdateCourt()

	const handleTeste = async () => {
		try {
		  // Perform the mutation
		  const response = await teste({
			variables: {
				court_id: 3,
				court_name: "Quadra do RAPAZ",
				courtType: 1,
				fantasyName: "Quadra",
				photos: ['3'],
				court_availabilities: ['1'],
				minimum_value: 20.00

			},
		  });		  
		  console.log("Mutation Response:", response);
		} catch (error) {
		  console.error("Error while registering establishment:", error);
		}
	  };

	

	const handleShowPassword = () => {
		setShowPassword(!showPassword);
	}

	const navigation = useNavigation();

	return (
		
			<ScrollView className='flex-1 h-max w-max bg-white'>
			<View className='h-16 W-max'></View>
			<TouchableOpacity className='h-14 w-81 rounded-md bg-orange-500 flex items-center justify-center' onPress={handleTeste} disabled={loading}>
				<Text className='text-gray-50'>DEUS ABENÇOE</Text>
			</TouchableOpacity>

			<View className="flex-1 flex items-center justify-center h-max w-max bg-white px-7 ">
				<TouchableOpacity onPress={() => navigation.navigate('Home')}>
					<Text className='text-base text-gray-400 pb-5'>Seja bem vindo</Text>
				</TouchableOpacity>

				<View className="w-full">

				<View className="h-14">
					<TextInput className= "h-14 text-base"
						value={userEmail}
						onChangeText={setUserEmail}
						outlineColor='#DCDCDC'
						mode='outlined'
						label={<Text style={{ color: '#DCDCDC' }}>Email</Text>}
						left = {
						<TextInput.Icon
							icon={'account-outline'}
							color="#DCDCDC"
							style={{marginTop: 15}}
						/>}
						theme={{
							colors: {
								placeholder: '#DCDCDC',
								primary: '#DCDCDC',
								text: '#DCDCDC',
								background: 'white'
							}
						}}
					/>
				</View>
				<View className='h-14 pt-4'>
					<TextInput className="h-14 text-base"
						secureTextEntry = {!showPassword}
						value={userPassWord}
						onChangeText={setUserPassword}
						mode='outlined'
						outlineColor='#DCDCDC'
						label={<Text style={{ color: '#DCDCDC' }}>******</Text>}
						left = {
							<TextInput.Icon
								icon={'lock-outline'}
								color="#DCDCDC"
								style={{marginTop: 15}}
							/>}
						right = {
							<TextInput.Icon
								icon={!showPassword ? 'eye-off-outline' : 'eye-outline'}
								color="#DCDCDC"
								style={{marginTop: 15}}
								onPress={handleShowPassword}
							/>}


						theme={{
							colors: {
								placeholder: '#DCDCDC',
								primary: '#DCDCDC',
								text: '#DCDCDC',
								background: 'white'
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
					<TouchableOpacity onPress={() => navigation.navigate('Register')}>
						<Text className='text-orange-500 text-base'> Clique aqui</Text>
					</TouchableOpacity>
				</View>
				</View>
			</View>
		</ScrollView>
	);
}
