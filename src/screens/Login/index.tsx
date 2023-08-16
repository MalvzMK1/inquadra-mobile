import React, { useEffect, useState } from 'react'
import { View, Text, Image, ActivityIndicator } from 'react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { TextInput } from 'react-native-paper';
import useUpdateCourt from '../../hooks/useUpdateCourt';
import { Controller, useForm } from "react-hook-form";
import { string, z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import useLoginUser from "../../hooks/useLoginUser";
import storage from "../../utils/storage";
import { RootStackParamList } from '../../types/RootStack';
import { useGetUserById } from '../../hooks/useUserById';
import { QueryResult } from '@apollo/client';
import { IUserByIdResponse, IUserByIdVariables } from '../../graphql/queries/userById';

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
	const [userGeolocation, setUserGeolocation] = useState<{ latitude: number, longitude: number }>()
	const [authUser, { data, loading, error }] = useLoginUser()
	const [userId, setUserId] = useState<string>()
	const [roleUser, setRoleUser] = useState<string>()
	const { data: userData, loading: userLoading, error: userError } = useGetUserById(userId);
	const navigation = useNavigation<NavigationProp<RootStackParamList>>();
	const { control, handleSubmit, formState: { errors } } = useForm<IFormData>({
		resolver: zodResolver(formSchema)
	})

	async function getTypeUser(id: string) {
		setUserId(id);
	}

	useEffect(() => {
		if (userId && userData) {
			setRoleUser(userData?.usersPermissionsUser.data.attributes.role.data.id);
		}
	}, [userId, userData]);

	useEffect(() => {
		if (userId) {
			if (roleUser === "3") {
				navigation.navigate('Home', {
					userGeolocation: userGeolocation ? userGeolocation : { latitude: 78.23570781291714, longitude: 15.491400000982967 },
					userID: userId,
					userPhoto: undefined
				});
			} else if (roleUser === "4") {
				navigation.navigate('HomeEstablishment', {
					userID: userId,
					userPhoto: undefined
				});
			}
		}
	}, [roleUser]);

	storage.load<{ latitude: number, longitude: number }>({
		key: 'userGeolocation'
	}).then(data => setUserGeolocation(data))

	const [showPassword, setShowPassword] = useState<boolean>(false)
	const [isLoading, setIsLoading] = useState<boolean>(false)

	const [teste, { data: updateCourtData, loading: updateCourtLoading, error: updateCourtError }] = useUpdateCourt()

	const handleShowPassword = () => {
		setShowPassword(!showPassword);
	}

	const handleLogin = (data: IFormData): void => {
		setIsLoading(true);
		authUser({
			variables: {
				identifier: data.identifier.trim(),
				password: data.password.trim(),
			},
		}).then(authData => {
			if (authData.data) {
				storage.save({
					key: 'userInfos',
					data: {
						token: authData.data.login.jwt,
						userId: authData.data.login.user.id,
					},
					expires: 1000 * 3600,
				});

				getTypeUser(authData.data.login.user.id);

				storage.load<UserInfos>({
					key: 'userInfos',
				})
			}
		}).catch(err => console.error(err))
			.finally(() => setIsLoading(false));
	}

	return (
		<ScrollView className='flex-1 h-max w-max bg-white'>
			<View className='h-16 W-max'></View>
			{/* <TouchableOpacity className='h-14 w-81 rounded-md bg-orange-500 flex items-center justify-center' onPress={handleTeste} disabled={updateCourtLoading}>
				<Text className='text-gray-50'>DEUS ABENÇOE</Text>
			</TouchableOpacity> */}

			<View className="flex-1 flex items-center justify-center px-7">
				<TouchableOpacity onPress={() => navigation.navigate('Home', {
					userGeolocation: userGeolocation ? userGeolocation : { latitude: 78.23570781291714, longitude: 15.491400000982967 },
					userID: '1',
					userPhoto: undefined
				})}>
					<Text className='text-base text-gray-400 pb-5'>Seja bem vindo</Text>
				</TouchableOpacity>

				<View className="w-full">
					<Controller
						name='identifier'
						control={control}
						render={({ field: { onChange } }) => (
							<TextInput
								className="h-14 text-base"
								keyboardType='email-address'
								onChangeText={onChange}
								outlineColor='#DCDCDC'
								mode='outlined'
								label={<Text style={{ color: '#DCDCDC' }}>Email</Text>}
								left={
									<TextInput.Icon
										icon={'account-outline'}
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
					{errors.identifier && <Text className='text-red-400 text-sm'>{errors.identifier.message}</Text>}
					<Controller
						name='password'
						control={control}
						render={({ field: { onChange } }) => (
							<TextInput
								className="h-14 text-base"
								secureTextEntry={!showPassword}
								onChangeText={onChange}
								mode='outlined'
								outlineColor='#DCDCDC'
								label={<Text style={{ color: '#DCDCDC' }}>******</Text>}
								left={
									<TextInput.Icon
										icon={'lock-outline'}
										color="#DCDCDC"
										style={{ marginTop: 15 }}
									/>}
								right={
									<TextInput.Icon
										icon={!showPassword ? 'eye-off-outline' : 'eye-outline'}
										color="#DCDCDC"
										style={{ marginTop: 15 }}
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
							<Text className='text-gray-50'>{isLoading ? <ActivityIndicator size='small' color='#F5620F' /> : 'Entrar'}</Text>
						</TouchableOpacity>
					</View>

					<View className='flex items-center justify-center pt-12'>
						<TouchableOpacity className=''>
							<Image source={require('../../assets/google.png')} className=''></Image>
						</TouchableOpacity>
					</View>
					<View className='flex-row  items-center justify-center pt-11'>
						<Text className='text-base text-gray-400'>Ainda não tem uma conta?</Text>
						<TouchableOpacity onPress={() => navigation.navigate('ChooseUserType')}>
							<Text className='text-orange-500 text-base'>Clique aqui</Text>
						</TouchableOpacity>
					</View>
				</View>
			</View>
		</ScrollView>
	);
}