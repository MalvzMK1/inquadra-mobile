import {NavigationProp, useNavigation} from '@react-navigation/native';
import React from 'react';
import {View, Text, TextInput} from 'react-native';
import { RegisterHeader } from '../../../components/RegisterHeader';
import MaskInput, { Masks } from 'react-native-mask-input';
import {Controller, useForm} from "react-hook-form";
import {TouchableOpacity} from "react-native-gesture-handler";
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod'
import MaskInput, {Masks} from 'react-native-mask-input'

interface IFormDatas {
	name: string
	email: string
	phoneNumber: string
	cpf: string
}

const formSchema = z.object({
	name: z.string()
		.nonempty('O nome não pode estar vazio!'),
	email: z.string()
		.nonempty('O E-mail não pode estar vazio!')
		.includes('@', {
			message: 'O E-mail passado não é válido',
		})
		.max(254, 'O E-mail passado não é válido'),
	phoneNumber: z.string()
		.nonempty('O número de telefone não pode estar vazio!')
		.max(15, 'O número passado não é válido'),
	cpf: z.string()
		.nonempty('O CPF não pode estar vazio!')
		.max(14, 'O CPF passado não é válido')
})

export default function Register() {
	const navigation = useNavigation<NavigationProp<RootStackParamList>>();
	const { control, handleSubmit, formState: {errors}, getValues } = useForm<IFormDatas>({
		resolver: zodResolver(formSchema)
	});

	const [ name, setName ] = useState("")
	const [ email, setEmail ] = useState("")
	const [ phoneNumber, setPhoneNumber ] = useState("")
	const [ cpf, setCpf ] = useState("")

	
	function handleGoToNextRegisterPage(data: IFormDatas): void {
		console.log(data)
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
						{errors.name && <Text className='text-red-400 text-sm'>{errors.name.message}</Text>}
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
									textContentType='emailAddress'
									keyboardType='email-address'
									maxLength={254}
									onChangeText={onChange}
									className={errors.email ? 'p-4 border border-red-400 rounded' : 'p-4 border border-neutral-400 rounded'}
									placeholder='exemplo@mail.com.br'
								/>
							)}
						/>
						{errors.email && <Text className='text-red-400 text-sm'>{errors.email.message}</Text>}
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
								<MaskInput
									mask={Masks.BRL_PHONE}
									maskAutoComplete={true}
									value={getValues('phoneNumber')}
									textContentType='telephoneNumber'
									keyboardType='phone-pad'
									maxLength={15}
									onChangeText={(masked, unmasked, obfuscated) => onChange(unmasked)}
									className={errors.phoneNumber ? 'p-4 border border-red-400 rounded' : 'p-4 border border-neutral-400 rounded'}
									placeholder='(00) 00000-0000'
								/>
							)}
						/>
						{errors.phoneNumber && <Text className='text-red-400 text-sm'>{errors.phoneNumber.message}</Text>}
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
								<MaskInput
									mask={Masks.BRL_CPF}
									maskAutoComplete={true}
									value={getValues('cpf')}
									keyboardType='numeric'
									maxLength={14}
									onChangeText={(masked, unmasked, obfuscated) => onChange(unmasked)}
									className={errors.cpf ? 'p-4 border border-red-400 rounded' : 'p-4 border border-neutral-400 rounded'}
									placeholder='000.000.000-00'
								/>
							)}
						/>
						{errors.cpf && <Text className='text-red-400 text-sm'>{errors.cpf.message}</Text>}
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

