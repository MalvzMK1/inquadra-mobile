import React, {useEffect, useState} from 'react'
import {View, Text, Image, ActivityIndicator} from 'react-native';
import {ScrollView, TouchableOpacity} from "react-native-gesture-handler";
import storage from "../../utils/storage";
import {Controller, useForm} from "react-hook-form";
import {TextInput} from "react-native-paper";
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {useUserByEmail} from "../../hooks/useUserByEmail";

interface IFormData {
	email: string;
}

const formSchema = z.object({
	email: z.string()
		.nonempty({message: 'Este campo não pode estar vazio'})
		.max(256, 'Insira um E-mail válido')
		.email({message: 'Insira um E-mail válido'})
})

export default function ForgotPassword({navigation, route}: NativeStackScreenProps<RootStackParamList, 'ForgotPassword'>) {
	const [email, setEmail] = useState<string>();
	const {data: userData, loading, error} = useUserByEmail(email ?? '')

	const {
		control,
		handleSubmit,
		formState: {errors}
	} = useForm<IFormData>({
		resolver: zodResolver(formSchema)
	});

	function handleLogin(data: IFormData) {
		setEmail(data.email)
	}

	useEffect(() => {
		if (userData && userData.usersPermissionsUsers.data.length > 0) {
			const userInfos = userData.usersPermissionsUsers.data[0];
			navigation.navigate('InsertResetCode', {
				id: userInfos.id,
				username: userInfos.attributes.username,
				email: userInfos.attributes.email,
			})
		}
	}, [userData])

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
				{errors.email && <Text className='text-red-400 text-sm'>{errors.email.message}</Text>}
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