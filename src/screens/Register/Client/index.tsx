import {NavigationProp, useNavigation} from '@react-navigation/native';
import React from 'react';
import {View, Text, TextInput} from 'react-native';
import { RegisterHeader } from '../../../components/RegisterHeader';
import {Controller, useForm} from "react-hook-form";
import {TouchableOpacity} from "react-native-gesture-handler";



interface IFormDatas {
	name: string
	email: string
	phoneNumber: string
	cpf: string
}


export default function Register() {
	const navigation = useNavigation<NavigationProp<RootStackParamList>>();
	const { control, handleSubmit, formState: {errors}, getValues } = useForm<IFormDatas>();

	function handleGoToNextRegisterPage(data: IFormDatas): void {

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
							rules={{
								required: true
							}}
							render={({field: {onChange}}) => (
								<TextInput
									onChangeText={onChange}
									className={errors.name ? 'p-4 border border-red-400 rounded' : 'p-4 border border-neutral-400 rounded'}
									placeholder='Ex.: João'
								/>
							)}
						/>
						{errors.name?.type === 'required' ? <Text className='text-red-400 text-sm'>O nome é obrigatório!</Text> : undefined}
					</View>

					<View>
						<Text className='text-xl'>Qual é o seu email?</Text>
						<Controller
							name='email'
							control={control}
							rules={{
								required: true,
								maxLength: 254
							}}
							render={({field: {onChange}}) => (
								<TextInput
									onChangeText={onChange}
									className={errors.email ? 'p-4 border border-red-400 rounded' : 'p-4 border border-neutral-400 rounded'}
									placeholder='exemplo@mail.com.br'
								/>
							)}
						/>
						{errors.email?.type === 'required' ? <Text className='text-red-400 text-sm'>O e-mail é obrigatório!</Text> : undefined}
					</View>

					<View>
						<Text className='text-xl'>Qual é o número do seu celular?</Text>
						<Controller
							name={'phoneNumber'}
							control={control}
							rules={{
								required: true,
								minLength: 11,
								maxLength: 11
							}}
							render={({field: {onChange}}) => (
								<TextInput
									onChangeText={onChange}
									className={errors.email ? 'p-4 border border-red-400 rounded' : 'p-4 border border-neutral-400 rounded'}
									placeholder='(00) 00000-0000'
								/>
							)}
						/>
						{errors.phoneNumber?.type === 'required' ? <Text className='text-red-400 text-sm'>O número de telefone é obrigatório!</Text> : undefined}
					</View>

					<View>
						<Text className='text-xl'>Qual é o número do seu CPF?</Text>
						<Controller
							name='cpf'
							control={control}
							rules={{
								required: true,
								minLength: 11,
								maxLength: 11
							}}
							render={({field: {onChange}}) => (
								<TextInput
									onChangeText={onChange}
									className={errors.email ? 'p-4 border border-red-400 rounded' : 'p-4 border border-neutral-400 rounded'}
									placeholder='000.000.000-00'
								/>
							)}
						/>
						{errors.cpf?.type === 'required' ? <Text className='text-red-400 text-sm'>O CPF é obrigatório!</Text> : undefined}
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

