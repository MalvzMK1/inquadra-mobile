import React, {useState} from 'react'
import {View, Text, Image, ActivityIndicator} from 'react-native';
import {ScrollView, TouchableOpacity} from "react-native-gesture-handler";
import storage from "../../utils/storage";
import {Controller, useForm} from "react-hook-form";
import {TextInput} from "react-native-paper";
import {NativeStackScreenProps} from "@react-navigation/native-stack";

export default function ForgotPassword({navigation, route}: NativeStackScreenProps<RootStackParamList, 'ForgotPassword'>) {
	const [showPassword, setShowPassword] = useState(false);

	const {
		control,
		handleSubmit,
		formState: {errors}
	} = useForm();

	function handleShowPassword() {
		setShowPassword(!showPassword)
	}

	function handleLogin(data: any) {
		console.log(data)
		navigation.navigate('InsertResetCode')
	}

	return (
		<View className='h-full w-screen bg-white flex justify-center items-center px-3'>
			<Text className='text-2xl font-bold text-black'>Esqueceu a senha?</Text>
			<Text className='text-base text-black text-center'>Insira o e-mail para receber o código para mudar a senha</Text>
			<View className='my-12 w-full h-fit flex'>

				<Controller
					name='email'
					control={control}
					render={({field: {onChange}}) => (
						<TextInput
							className="h-14 text-base"
							keyboardType='email-address'
							onChangeText={onChange}
							outlineColor='#DCDCDC'
							mode='outlined'
							label={<Text style={{ color: '#DCDCDC' }}>E-mail</Text>}
							left={
								<TextInput.Icon
									icon={'lock-outline'}
									color="#DCDCDC"
									style={{ marginTop: 15 }}
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
					)}
				/>
			</View>
			<View className={'w-full'}>
				<TouchableOpacity
					className='h-14 rounded-md bg-orange-500 flex items-center justify-center'
					onPress={handleSubmit(handleLogin)}>
					<Text className='text-gray-50'>Confirmar</Text>
				</TouchableOpacity>
			</View>
		</View >
	)
}