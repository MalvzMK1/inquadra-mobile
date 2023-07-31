import {NavigationProp, useNavigation} from '@react-navigation/native';
import React from 'react';
import {View, Text, TextInput, ScrollView} from 'react-native';
import { RegisterHeader } from '../../../components/RegisterHeader';
import {Controller, useForm} from "react-hook-form";
import {TouchableOpacity} from "react-native-gesture-handler";
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod'
import MaskInput, {Masks} from 'react-native-mask-input'

interface IFormSchema {
	name: string
	// IMPLEMENTAR OS OUTROS CAMPOS
}

const formSchema = z.object({
	name: z.string()
		.nonempty('O campo não pode estar vazio')
	// IMPLEMENTAR OS OUTROS CAMPOS
})

export default function EstablishmentRegister() {
	const {control, formState: errors, handleSubmit} = useForm<IFormSchema>({
		resolver: zodResolver(formSchema)
	})

	function handleContinue(data: IFormSchema) {
		console.log(data)
	}

	return (
		<ScrollView className="flex-1 bg-white">

			<View className='h-screen'>
				<RegisterHeader title='Cadastro' subtitle='Vamos precisar de alguns dados seus...'></RegisterHeader>

				{/*<View className='p-6 gap-2 flex flex-col justify-between'>*/}
				{/*	<View>*/}
				{/*		<Text className='text-xl'>Qual é o seu nome?</Text>*/}
				{/*		<Controller*/}
				{/*			name='name'*/}
				{/*			control={control}*/}
				{/*			rules={{*/}
				{/*				required: true*/}
				{/*			}}*/}
				{/*			render={({field: {onChange}}) => (*/}
				{/*				<TextInput*/}
				{/*					onChangeText={onChange}*/}
				{/*					className={errors.name ? 'p-4 border border-red-400 rounded' : 'p-4 border border-neutral-400 rounded'}*/}
				{/*					placeholder='Ex.: João'*/}
				{/*				/>*/}
				{/*			)}*/}
				{/*		/>*/}
				{/*		{errors.name && <Text className='text-red-400 text-sm'>{errors.name.message}</Text>}*/}
				{/*	</View>*/}
				{/*</View>*/}

				<TouchableOpacity
					className='h-14 w-81 rounded-md bg-orange-500 flex items-center justify-center m-6'
					onPress={handleSubmit(handleContinue)}>
					<Text className='text-gray-50'>Continuar</Text>
				</TouchableOpacity>

			</View>

		</ScrollView>
	);
}

