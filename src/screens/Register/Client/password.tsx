import { View, Text, TextInput, Image } from "react-native"
import { useState } from "react"
import { RegisterHeader } from "../../../components/RegisterHeader"
import { TouchableOpacity } from "react-native"
import { CheckBox } from 'react-native-elements'
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {Controller, useForm, get} from "react-hook-form";
// import getFieldValue from "react-hook-form/dist/logic/getFieldValue";

type RegisterPasswordProps = NativeStackScreenProps<RootStackParamList, 'RegisterPassword'>

interface IFormData {
	password: string
	confirmPassword: string
}

export default function Password({route, navigation}: RegisterPasswordProps) {
	const {control, handleSubmit, getValues, formState: {errors}} = useForm<IFormData>()

	const [showPassword, setShowPassword] = useState(false)
	const [showConfirmedPassword, setShowConfirmedPassword] = useState(false)

	const handleShowPassword = () => {
		setShowPassword(!showPassword);
	}
	const handleConfirmShowPassword = () => {
		setShowConfirmedPassword(!showConfirmedPassword)
	}
	const checked: string = "checked"

	const [isChecked, setIsChecked] = useState(false)
	const [captchaChecked, setCaptchaChecked] = useState(false)
	const [isCheckedError, setIsCheckedError] = useState<boolean>(false)
	const [isCaptchaCheckedError, setIsCaptchaCheckedError] = useState<boolean>(false)

	function handleSignup(data: IFormData): void {
		if (isCheckedError) {
			if (isCaptchaCheckedError) {
				const userDatas = {
					...route.params,
					...data
				}
				alert('Sucesso')
			} setIsCaptchaCheckedError(true)
		} setIsCheckedError(true)
	}

	return (
		<View className=" flex flex-col bg-white h-screen items-center p-5">

			<View>
				<RegisterHeader title="Senha" subtitle="Antes de concluir escolha uma senha de acesso"></RegisterHeader>
			</View>

			<View className='gap-2 flex flex-col justify-between items-center w-full'>
				<View className="w-full">
					<Text className='text-xl'>Escolha uma senha</Text>
					<View className="flex flex-row border border-neutral-400 rounded items-center justify-between">
						<Controller
							name='password'
							control={control}
							rules={{
								required: true,
								minLength: 6
							}}
							render={({field: {onChange}}) => (
								<TextInput
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
				</View>

				<View className="w-full">
					<Text className='text-xl'>Repita a senha escolhida</Text>
					<View className="flex flex-row border border-neutral-400 rounded items-center justify-between">
						<Controller
							name='confirmPassword'
							control={control}
							rules={{
								required: true,
								minLength: 6
							}}
							render={({field: {onChange}}) => (
								<TextInput
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
				</View>

				<View className="flex flex-row justify-start items-center w-full">
					<CheckBox
						checked={isChecked}
						onPress={() => setIsChecked(!isChecked)}
					/>
					<Text className="text-base flex-wrap flex-1">Li e estou de acordo com o <Text className="text-[#3D58DB] flex-wrap">Termo de Uso e Política de Privacidade</Text> </Text>
				</View>

				<View className="flex flex-row justify-between items-center w-5/6 border rounded-md border-[#CACACA] bg-[#F2F2F2] font-normal p-2">
					<View className="flex flex-row items-center">
						<CheckBox
							checked={captchaChecked}
							onPress={() => setCaptchaChecked(!captchaChecked)}
							className={isCaptchaCheckedError ? 'bg-red-300' : undefined}
						/>
						<Text className="text-[#959595] text-base">Não sou um robô</Text>
					</View>

					<Image source={require('../../../assets/captcha.png')}></Image>
				</View>
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