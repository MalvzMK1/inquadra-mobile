import {NavigationProp, useNavigation} from '@react-navigation/native';
import React from 'react';
import {View, Text, TextInput} from 'react-native';
import { RegisterHeader } from '../../../components/RegisterHeader';
import {Controller, FieldValues, useForm} from "react-hook-form";
import {TouchableOpacity} from "react-native-gesture-handler";



interface IFormInput extends FieldValues {
	name: string
	email: string
	phoneNumber: string
	cpf: string
}


export default function Register() {
	const navigation = useNavigation<NavigationProp<RootStackParamList>>();
	const { control, handleSubmit } = useForm();

	function handleGoToNextRegisterPage(data: IFormInput): void {

		navigation.navigate('RegisterPassword', {
			...data
		})
	}

	return (
		<View className="flex-1 bg-white h-screen">

			<View className='h-screen'>
				<RegisterHeader title='Cadastro' subtitle='Vamos precisar de alguns dados seus...'></RegisterHeader>

				<View className='p-6 gap-2 flex flex-col justify-between'>
					<View>
						<Text className='text-xl'>Qual é o seu nome?</Text>
						<Controller
							name='name'
							control={control}
							render={({field: {onChange}}) => (
								<TextInput
									onChangeText={onChange}
									className='p-4 border border-neutral-400 rounded'
									placeholder='Ex.: João'
								/>
							)}
						/>
					</View>

					<View>
						<Text className='text-xl'>Qual é o seu email?</Text>
						<Controller
							name='email'
							control={control}
							render={({field: {onChange}}) => (
								<TextInput
									onChangeText={onChange}
									className='p-4 border border-neutral-400 rounded'
									placeholder='exemplo@mail.com.br'
								/>
							)}
						/>
					</View>

					<View>
						<Text className='text-xl'>Qual é o número do seu celular?</Text>
						<Controller
							render={({field: {onChange}}) => (
								<TextInput
									onChangeText={onChange}
									className='p-4 border border-neutral-400 rounded'
									placeholder='(00) 00000-0000'
								/>
							)}
							name={'phoneNumber'}
							control={control}
						/>
					</View>

					<View>
						<Text className='text-xl'>Qual é o número do seu CPF?</Text>
						<Controller
							name='cpf'
							control={control}
							render={({field: {onChange}}) => (
								<TextInput
									onChangeText={onChange}
									className='p-4 border border-neutral-400 rounded'
									placeholder='000.000.000-00'
								/>
							)}
						/>
					</View>

				</View>

				<TouchableOpacity
					className='h-14 w-81 rounded-md bg-orange-500 flex items-center justify-center'
					onPress={handleSubmit(handleGoToNextRegisterPage)}>
					<Text className='text-gray-50'>Continuar</Text>
				</TouchableOpacity>

			</View>

		</View>
	);
}

