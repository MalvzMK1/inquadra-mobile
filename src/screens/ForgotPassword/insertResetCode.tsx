import React, {useEffect, useState} from 'react'
import {View, Text, Image, ActivityIndicator} from 'react-native';
import {ScrollView, TouchableOpacity} from "react-native-gesture-handler";
import storage from "../../utils/storage";
import {Controller, useForm} from "react-hook-form";
import {TextInput} from "react-native-paper";
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import useForgotPassword from "../../hooks/useForgotPassword";

interface IFormData {
	code: string;
}

const formSchema = z.object({
	code: z.string()
		.nonempty({message: 'Este campo não pode estar vazio'})
})

export function InsertResetCode({navigation, route}: NativeStackScreenProps<RootStackParamList, 'InsertResetCode'>) {
	const [forgotPassword, {data, loading, error}] = useForgotPassword();
	const [sentEmail, setSentEmail] = useState<boolean>(false);

	const {
		control,
		handleSubmit,
		formState: {errors}
	} = useForm<IFormData>({
		resolver: zodResolver(formSchema)
	});

	function handleValidateCode(data: IFormData) {
		console.log(data.code)
	}

	useEffect(() => {
		forgotPassword({
			variables: {
				email: route.params.email
			}
		}).then(response => {
			if (response.data && response.data.forgotPassword.ok)
				setSentEmail(true)
		})
	}, []);

	return (
		<View className='h-full w-screen bg-white flex justify-center items-center px-3'>
			<Text className='text-2xl font-bold text-black'>Código de verificação</Text>
			<Text className='text-base text-black text-center'>{
				sentEmail ?
					`Enviamos um código de recuperação para o e-mail ${route.params.email}`
					: `Olá ${route.params.username}, enviaremos um e-mail para a recuperação de sua conta.`
			}</Text>
			<View className='my-12 w-full h-fit flex'>
				<Controller
					name='code'
					control={control}
					render={({field: {onChange}}) => (
						<TextInput
							className="h-14 text-base"
							keyboardType='email-address'
							onChangeText={onChange}
							outlineColor='#DCDCDC'
							mode='outlined'
							label={<Text style={{ color: '#DCDCDC' }}>Código</Text>}
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
				{errors.code && <Text className='text-red-400 text-sm'>{errors.code.message === 'Required' ? 'Este campo não pode estar vazio!' : errors.code.message}</Text>}
			</View>
			<View className={'w-full'}>
				<TouchableOpacity
					className='h-14 rounded-md bg-orange-500 flex items-center justify-center'
					onPress={handleSubmit(handleValidateCode)}>
					<Text className='text-gray-50'>Confirmar</Text>
				</TouchableOpacity>
			</View>
		</View >
	)
}