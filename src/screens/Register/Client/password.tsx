import { View, Text, TextInput, Image } from "react-native"
import React, { useState } from "react"
import { RegisterHeader } from "../../../components/RegisterHeader"
import { TouchableOpacity } from "react-native"
import { CheckBox } from 'react-native-elements'
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {Controller, useForm} from "react-hook-form";
import {z} from "zod";
import { zodResolver } from '@hookform/resolvers/zod'

type RegisterPasswordProps = NativeStackScreenProps<RootStackParamList, 'RegisterPassword'>

interface IFormData {
	password: string
	confirmPassword: string
}

const formSchema = z.object({
	password: z.string()
		.nonempty('O campo não pode estar vazio'),
	confirmPassword: z.string()
		.nonempty('O campo não pode estar vazio'),
})

export default function Password({route, navigation}: RegisterPasswordProps) {
	const {control, handleSubmit, formState: {errors}} = useForm<IFormData>({
		resolver: zodResolver(formSchema)
	})

	const [showPassword, setShowPassword] = useState(false)
	const [showConfirmedPassword, setShowConfirmedPassword] = useState(false)

	const handleShowPassword = () => {
		setShowPassword(!showPassword);
	}
	const handleConfirmShowPassword = () => {
		setShowConfirmedPassword(!showConfirmedPassword)
	}
	const checked: string = "checked"

	const [isTermChecked, setIsTermChecked] = useState(false)
	const [isCaptchaChecked, setIsCaptchaChecked] = useState(false)
	const [isTermCheckedError, setIsTermCheckedError] = useState<boolean>(false)
	const [isCaptchaCheckedError, setIsCaptchaCheckedError] = useState<boolean>(false)

	function handleSignup(data: IFormData): void {
		if (isTermChecked) {
			if (isCaptchaChecked) {
				console.log(data)
				if (data.password === data.confirmPassword) {
					const userDatas = {
						...route.params,
						...data,
					}
					alert('Sucesso')
					navigation.navigate('RegisterSuccess')
				}
			} setIsCaptchaCheckedError(true)
		} setIsTermCheckedError(true)
	}

	return (
		<View className=" flex flex-col bg-white h-screen items-center p-5">

			<View>
				<RegisterHeader title="Senha" subtitle="Antes de concluir escolha uma senha de acesso"></RegisterHeader>
			</View>

			<View className='gap-2 flex flex-col justify-between items-center w-full'>
				<View className="w-full">
					<Text className='text-xl'>Escolha uma senha</Text>
					<View className={errors.password ? 'flex flex-row items-center justify-between border border-red-400 rounded' : 'flex flex-row items-center justify-between border border-neutral-400 rounded'}>
						<Controller
							name='password'
							control={control}
							rules={{
								required: true,
								minLength: 6
							}}
							render={({field: {onChange}}) => (
								<TextInput
									textContentType='password'
									secureTextEntry={!showPassword}
									onChangeText={onChange}
									className='p-4 flex-1'
									placeholder='**********'
								/>
							)}
						/>
						<TouchableOpacity onPress={handleShowPassword}>
							<Image className="h-4 w-4 m-4" source={!showPassword ? require('../../../assets/eye.png') : require('../../../assets/eye-slash.png')}></Image>
						</TouchableOpacity>
					</View>
					{errors.password && <Text className='text-red-400 text-sm'>{errors.password.message}</Text>}
				</View>

				<View className="w-full">
					<Text className='text-xl'>Repita a senha escolhida</Text>
					<View className={errors.confirmPassword ? 'flex flex-row items-center justify-between border border-red-400 rounded' : 'flex flex-row items-center justify-between border border-neutral-400 rounded'}>
						<Controller
							name='confirmPassword'
							control={control}
							rules={{
								required: true,
								minLength: 6
							}}
							render={({field: {onChange}}) => (
								<TextInput
									textContentType='password'
									secureTextEntry={!showConfirmedPassword}
									onChangeText={onChange}
									className='p-4 flex-1'
									placeholder='**********'
								/>
							)}
						/>
						<TouchableOpacity onPress={handleConfirmShowPassword}>
							<Image className="h-4 w-4 m-4" source={!showConfirmedPassword ? require('../../../assets/eye.png') : require('../../../assets/eye-slash.png')}></Image>
						</TouchableOpacity>
					</View>
					{errors.confirmPassword && <Text className='text-red-400 text-sm'>{errors.confirmPassword.message}</Text>}
				</View>

				<View className="flex flex-row justify-start items-center w-full">
					<CheckBox
						checked={isTermChecked}
						onPress={() => setIsTermChecked(!isTermChecked)}
					/>
					<Text className="text-base flex-wrap flex-1">Li e estou de acordo com o <Text className="text-[#3D58DB] flex-wrap">Termo de Uso e Política de Privacidade</Text> </Text>
				</View>
				{isTermCheckedError && <Text className='text-red-400 text-sm'>Leia os termos</Text>}

				<View className="flex flex-row justify-between items-center w-5/6 border rounded-md border-[#CACACA] bg-[#F2F2F2] font-normal p-2">
					<View className="flex flex-row items-center">
						<CheckBox
							checked={isCaptchaChecked}
							onPress={() => setIsCaptchaChecked(!isCaptchaChecked)}
							containerStyle={{
								borderColor: isCaptchaCheckedError ? 'rgb(248 113 113)' : undefined
							}}
						/>
						<Text className="text-[#959595] text-base">Não sou um robô</Text>
					</View>
					<Image source={require('../../../assets/captcha.png')}></Image>
				</View>
				{isCaptchaCheckedError && <Text className='text-red-400 text-sm'>Verifique se você é um humano</Text>}
			</View>
			<View className='flex-1 flex w-full items-center justify-center'>
				<TouchableOpacity
					className='h-14 w-full rounded-md bg-orange-500 flex items-center justify-center'
					onPress={handleSubmit(handleSignup)}>
					<Text className='text-gray-50'>Continuar</Text>
				</TouchableOpacity>
			</View>
		</View>
	)
}