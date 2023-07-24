import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { RegisterHeader } from '../../../components/RegisterHeader';
import MaskInput, { Masks } from 'react-native-mask-input';

export default function Register() {
	const navigation = useNavigation();

	const [ name, setName ] = useState("")
	const [ email, setEmail ] = useState("")
	const [ phoneNumber, setPhoneNumber ] = useState("")
	const [ cpf, setCpf ] = useState("")

	return (
		<View className="flex-1 bg-white h-screen">

			<View className='h-screen'>
				<RegisterHeader title='Cadastro' subtitle='Vamos precisar de alguns dados seus...'></RegisterHeader>

				<View className='p-6 gap-2 flex flex-col justify-between'>
					<View>
						<Text className='text-xl'>Qual é o seu nome?</Text>
						<TextInput 
							className='p-4 border border-neutral-400 rounded' 
							placeholder='Ex.: João'
							value={name}
							onChangeText={setName}>
						</TextInput>
					</View>

					<View>
						<Text className='text-xl'>Qual é o seu email?</Text>
						<TextInput 
							className='p-4 border border-neutral-400 rounded' 
							placeholder='Ex.: João'
							value={email}
							onChangeText={setEmail}
							keyboardType='email-address'>
						</TextInput>
					</View>

					<View>
						<Text className='text-xl'>Qual é o número do seu celular?</Text>
						<MaskInput 
							className='p-4 border border-neutral-400 rounded' 
							placeholder='(00) 00000-0000'
							value={phoneNumber}
							onChangeText={setPhoneNumber}
							mask={Masks.BRL_PHONE}>
						</MaskInput>
					</View>

					<View>
						<Text className='text-xl'>Qual é o número do seu CPF?</Text>
						<MaskInput 
							className='p-4 border border-neutral-400 rounded' 
							placeholder='000-000-000-00'
							value={cpf}
							onChangeText={setCpf}
							mask={Masks.BRL_CPF}>
						</MaskInput>
					</View>

				</View>

				<View className='p-6'>
					<TouchableOpacity className='h-14 w-81 rounded-md bg-orange-500 flex items-center justify-center' onPress={() => navigation.navigate('RegisterPassword')}>
                    	<Text className='text-gray-50'>Continuar</Text>
                	</TouchableOpacity>
				</View>

			</View>

		</View>
	);
}

