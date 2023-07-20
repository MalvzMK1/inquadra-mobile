import React, {useState} from 'react'
import { View, Text, Image } from 'react-native';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { TextInput } from 'react-native-paper';
import useUpdateCourt from '../../hooks/useUpdateCourt';
import {Controller, useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import useLoginUser from "../../hooks/useLoginUser";
import storage from "../../utils/storage";

interface IFormData {
	identifier: string
	password: string
}

const formSchema = z.object({
	identifier: z.string()
		.nonempty('O campo não pode estar vazio'),
	password: z.string()
		.nonempty('O campo não pode estar vazio')
})

export default function Login() {
	const [authUser, {data, loading, error}] = useLoginUser()
	const navigation = useNavigation<NavigationProp<RootStackParamList>>();
	const { control, handleSubmit, formState: {errors} } = useForm<IFormData>({
		resolver: zodResolver(formSchema)
	})

	const [showPassword, setShowPassword] = useState<boolean>(false)

	const [teste, { data: updateCourtData, loading: updateCourtLoading, error: updateCourtError }] = useUpdateCourt()

	const handleTeste = async () => {
		try {
		  // Perform the mutation
		  const response = await teste({
			variables: {
				court_id: 3,
				court_name: "Quadra do RAPAZ",
				courtType: 1,
				fantasyName: "Quadra",
				photos: ['3'],
				court_availabilities: ['1'],
				minimum_value: 20.00

			},
		  });		  
		  console.log("Mutation Response:", response);
		} catch (error) {
		  console.error("Error while registering establishment:", error);
		}
	  };

	const handleShowPassword = () => {
		setShowPassword(!showPassword);
	}

	function handleLogin(data: IFormData): void {
		authUser({
			variables: {
				identifier: data.identifier.trim(),
				password: data.password.trim()
			}
		}).then(data => {
			console.log(data.data?.login.jwt)
			if (data.data) storage.save({
				key: 'userJWTToken',
				data: {
					token: data.data.login.jwt
				},
				expires: 1000 * 3600
			})
			storage.load({
				key: 'userJWTToken',
			}).then(value => console.log({value}))
		}).catch(err => console.error(err))
	}

	return (
		<ScrollView className='flex-1 h-max w-max bg-white'>
			<View className='h-16 W-max'></View>
			<TouchableOpacity className='h-14 w-81 rounded-md bg-orange-500 flex items-center justify-center' onPress={handleTeste} disabled={updateCourtLoading}>
				<Text className='text-gray-50'>DEUS ABENÇOE</Text>
			</TouchableOpacity>

			<View className="flex-1 flex items-center justify-center px-7 bg-violet-500">
				<TouchableOpacity onPress={() => navigation.navigate('Home')}>
					<Text className='text-base text-gray-400 pb-5'>Seja bem vindo</Text>
				</TouchableOpacity>

				<View className="w-full">
					<Controller
						name='identifier'
						control={control}
						render={({ field: {onChange} }) => (
							<TextInput
								className= "h-14 text-base"
								onChangeText={onChange}
								outlineColor='#DCDCDC'
								mode='outlined'
								label={<Text style={{ color: '#DCDCDC' }}>Email</Text>}
								left = {
								<TextInput.Icon
									icon={'account-outline'}
									color="#DCDCDC"
									style={{marginTop: 15}}
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
					{errors.identifier && <Text className='text-red-400 text-sm'>{errors.identifier.message}</Text>}
					<Controller
						name='password'
						control={control}
						render={({ field: { onChange }}) => (
							<TextInput
								className="h-14 text-base"
								secureTextEntry = {!showPassword}
								onChangeText={onChange}
								mode='outlined'
								outlineColor='#DCDCDC'
								label={<Text style={{ color: '#DCDCDC' }}>******</Text>}
								left = {
								<TextInput.Icon
									icon={'lock-outline'}
									color="#DCDCDC"
									style={{marginTop: 15}}
								/>}
								right = {
								<TextInput.Icon
									icon={!showPassword ? 'eye-off-outline' : 'eye-outline'}
									color="#DCDCDC"
									style={{marginTop: 15}}
									onPress={handleShowPassword}
								/>
							}
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
					{errors.password && <Text className='text-red-400 text-sm'>{errors.password.message}</Text>}
				<View className='flex items-end pt-8'>
					<TouchableOpacity>
						<Text className='text-gray-400 text-base'>esqueceu a senha?</Text>
					</TouchableOpacity>
				</View>
				<View className='h-11 pt-4'>

					<TouchableOpacity
						className='h-14 w-81 rounded-md bg-orange-500 flex items-center justify-center'
						onPress={handleSubmit(handleLogin)}>
						<Text className='text-gray-50'>Entrar</Text>
					</TouchableOpacity>
				</View>

				<View className='flex items-center justify-center pt-12'>
					<TouchableOpacity className=''>
						<Image source={require('../../assets/google.png')} className=''></Image>
					</TouchableOpacity>
				</View>
				<View className='flex-row  items-center justify-center pt-11'>
					<Text className='text-base text-gray-400'>Ainda não tem uma conta?</Text>
					<TouchableOpacity onPress={() => navigation.navigate('Register')}>
						<Text className='text-orange-500 text-base'> Clique aqui</Text>
					</TouchableOpacity>
				</View>
				</View>
			</View>
		</ScrollView>
	);
}
