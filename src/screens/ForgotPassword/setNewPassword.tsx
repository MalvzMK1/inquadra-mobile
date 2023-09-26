import {Text, View} from "react-native";
import {Controller, useForm} from "react-hook-form";
import {TextInput} from "react-native-paper";
import {TouchableOpacity} from "react-native-gesture-handler";
import React, {useState} from "react";
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";

interface IFormData {
	password: string;
	confirmPassword: string;
}

const formSchema = z.object({
	password: z.string()
		.nonempty('Este campo não pode estar vazio')
		.min(6, 'A senha precisa ter no mínimo 6 caracteres'),
	confirmPassword: z.string()
		.nonempty('Este campo não pode estar vazio')
		.min(6, 'A senha precisa ter no mínimo 6 caracteres'),
})

export function SetNewPassword({navigation, route}: NativeStackScreenProps<RootStackParamList, 'SetNewPassword'>) {
	const {
		control,
		handleSubmit,
		formState: {errors},
		watch
	} = useForm<IFormData>({
		resolver: zodResolver(formSchema)
	});

	const [passwordsMatch, setPasswordsMatch] = useState<boolean>(true);

	function handleResetPassword(data: IFormData) {
		const {password, confirmPassword} = data;

		if (password === confirmPassword) {
			alert('Funcionalidade de resetar senha em progresso')
		} else {
			setPasswordsMatch(false)
		}
	}

	return (
		<View className='h-full w-screen bg-white flex justify-center items-center px-3'>
			<Text className='text-2xl font-bold text-black'>Definir nova senha</Text>
			<View className='my-12 w-full h-fit flex'>
				<Controller
					name='password'
					control={control}
					render={({field: {onChange}}) => (
						<TextInput
							className="h-14 text-base"
							keyboardType='numbers-and-punctuation'
							onChangeText={onChange}
							outlineColor='#DCDCDC'
							mode='outlined'
							label={<Text style={{ color: '#DCDCDC' }}>Senha</Text>}
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
				{errors.password && <Text className='text-red-400 text-sm'>{errors.password.message === 'Required' ? 'Este campo não pode estar vazio!' : errors.password.message}</Text>}
				<Controller
					name='confirmPassword'
					control={control}
					render={({field: {onChange}}) => (
						<TextInput
							className="h-14 text-base"
							keyboardType='numbers-and-punctuation'
							onChangeText={onChange}
							outlineColor='#DCDCDC'
							mode='outlined'
							label={<Text style={{ color: '#DCDCDC' }}>Confirme sua senha</Text>}
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
				{errors.confirmPassword && <Text className='text-red-400 text-sm'>{errors.confirmPassword.message === 'Required' ? 'Este campo não pode estar vazio!' : errors.confirmPassword.message}</Text>}
				{!passwordsMatch && <Text className='text-red-400 text-sm'>As senhas não batem</Text>}
				{errors.root?.message}
			</View>
			<View className={'w-full'}>
				<TouchableOpacity
					className='h-14 rounded-md bg-orange-500 flex items-center justify-center'
					onPress={handleSubmit(handleResetPassword)}>
					<Text className='text-gray-50'>Confirmar</Text>
				</TouchableOpacity>
			</View>
		</View >
	)
}