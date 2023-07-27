import React, { useState, useEffect } from 'react';
import {
	View,
	Text,
	ScrollView,
	TextInput,
	TouchableOpacity,
	Image,
	Modal,
	StyleSheet,
	ActivityIndicator
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import { SelectList } from 'react-native-dropdown-select-list'
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import MaskInput, { Masks } from 'react-native-mask-input';
import { TextInputMask } from 'react-native-masked-text';
import {Controller, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";
import useGetUserById from "../../hooks/useUserById";
import useUpdateUser from "../../hooks/useUpdateUser";
import useUpdatePaymentCardInformations from "../../hooks/useUpdatePaymentCardInformations";
import DateTimePicker from "@react-native-community/datetimepicker";

interface IFormData {
	name: string
	email: string
	phoneNumber: string
	cpf: string
	paymentCardInfos?: {
		dueDate: string
		cvv: string
		country: {
			key: string
			name: string
			image: string
		}
	}
}

const formSchema = z.object({
	name: z.string(),
	email: z.string(),
	phoneNumber: z.string(),
	cpf: z.string(),
	paymentCardInfos: z.optional(z.object({
		dueDate: z.string(),
		cvv: z.string(),
		country: z.string()
	}).nullable())
})

const countriesData = [
	{ key: '1', value: 'Brasil', img: 'https://s3.static.brasilescola.uol.com.br/be/2021/11/bandeira-do-brasil.jpg' },
	{ key: '2', value: 'França', img: 'https://static.todamateria.com.br/upload/58/4f/584f1a8561a5c-franca.jpg' },
	{ key: '3', value: 'Portugal', img: 'https://s3.static.brasilescola.uol.com.br/be/2021/11/bandeira-do-brasil.jpg' },
	{ key: '4', value: 'Estados Unidos', img: 'https://s3.static.brasilescola.uol.com.br/be/2021/11/bandeira-do-brasil.jpg' },
	{ key: '5', value: 'Canadá', img: 'https://s3.static.brasilescola.uol.com.br/be/2021/11/bandeira-do-brasil.jpg' },
	{ key: '6', value: 'Itália', img: 'https://s3.static.brasilescola.uol.com.br/be/2021/11/bandeira-do-brasil.jpg' },
	{ key: '7', value: 'Reino Unido', img: 'https://s3.static.brasilescola.uol.com.br/be/2021/11/bandeira-do-brasil.jpg' },
]

type UserConfigurationProps = Omit<User, 'cep' | 'latitude' | 'longitude' | 'streetName'> & {paymentCardInfos: {dueDate: string, cvv: string}}

export default function ProfileSettings() {
	const [userInfos, setUserInfos] = useState<UserConfigurationProps>()

	const { loading, error, data } = useGetUserById("2");
	const [updateUser, {data: updatedUserData, loading: isUpdateLoading, error: updateUserError}] = useUpdateUser();
	const [updatePaymentCardInformations, {data: updatedPaymentCardInformations, loading: isUpdatePaymentCardLoading}] = useUpdatePaymentCardInformations()

	const {
		control,
		handleSubmit,
		formState: {errors},
		getValues,
		setValue
	} = useForm<IFormData>({
		resolver: zodResolver(formSchema),
	})

	const handleCardClick = () => {
		setShowCard(!showCard);
		setShowCameraIcon(false);
	};

	const updateCardInfos = (data: IFormData) => {
		const { paymentCardInfos } = data

		if (userInfos && paymentCardInfos)
			updatePaymentCardInformations({
				variables: {
					user_id: userInfos.id,
					card_cvv: Number(paymentCardInfos.cvv),
					card_due_date: paymentCardInfos.dueDate,
					country_flag_id: '1'
				}
			}).then(data => {
				console.log(data.data)
				setShowCard(false)
			}).catch(error => console.error(error))
		// setShowCard(false);
	};

	const handleDeleteAccount = () => {
		setShowDeleteConfirmation(true);
	};

	const handleConfirmDelete = () => {
		setShowDeleteConfirmation(false);
	};

	const handleCancelDelete = () => {
		setShowDeleteConfirmation(false);
	};

	const handleExitApp = () => {
		setShowExitConfirmation(true);
	};

	const handleConfirmExit = () => {
		// sair do app
		setShowExitConfirmation(false);
	};

	const handleCancelExit = () => {
		setShowExitConfirmation(false);

	};

	const [profilePicture, setProfilePicture] = useState(null);

	const handleProfilePictureUpload = async () => {
		try {
			const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

			if (status !== 'granted') {
				alert('Desculpe, precisamos da permissão para acessar a galeria!');
				return;
			}

			const result = await ImagePicker.launchImageLibraryAsync({
				mediaTypes: ImagePicker.MediaTypeOptions.Images,
				allowsEditing: true,
				aspect: [1, 1],
				quality: 1,
			});

			if (!result.canceled) {
				setProfilePicture(result.uri);
			}
		} catch (error) {
			console.log('Erro ao carregar a imagem: ', error);
		}
	};

	const navigation = useNavigation<NavigationProp<RootStackParamList>>();
	const [showCard, setShowCard] = useState(false);
	const [cardData, setCardData] = useState({
		cardNumber: '',
		expirationDate: '',
		cvv: '',
		country: ''
	});
	const [showCameraIcon, setShowCameraIcon] = useState(false);
	const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
	const [showExitConfirmation, setShowExitConfirmation] = useState(false);

	function updateUserInfos(data: IFormData): void {
		console.log({data})
	}


	async function loadInformations() {
		let newUserInfos = userInfos;

		if (!loading) {
			newUserInfos = {
				username: data.usersPermissionsUser.data.attributes.username,
				cpf: data.usersPermissionsUser.data.attributes.cpf,
				email: data.usersPermissionsUser.data.attributes.email,
				phoneNumber: data.usersPermissionsUser.data.attributes.phoneNumber,
				paymentCardInfos: {
					dueDate: "11/11",
					cvv: "1234",
				},
			};

			setUserInfos(newUserInfos);
		}

		return newUserInfos;
	}

	function defineDefaultFieldValues(userData: Omit<User, 'id' | 'cep' | 'latitude' | 'longitude' | 'streetName'> & {paymentCardInfos: {dueDate: string, cvv: string}} | undefined): void {
		console.log(userData)

		if(userData) {
			setValue('name', userData!.username)
			setValue('email', userData!.email)
			setValue('phoneNumber', userData!.phoneNumber)
			setValue('cpf', userData!.cpf)
			setValue('paymentCardInfos.cvv', userData!.paymentCardInfos.cvv)
			setValue('paymentCardInfos.dueDate', userData!.paymentCardInfos.dueDate)
		}
	}

	useEffect(() => {
		console.log({FUNCAO: loadInformations(), DADOS: data})
		loadInformations().then(defineDefaultFieldValues);
	}, [loading])

	return (
				<View className="flex-1 bg-white h-full">
					{errors && <Text>ERRO: {JSON.stringify(errors)}</Text>}
					{
						loading ?
							<View className='flex-1'>
								<ActivityIndicator size='large' color='#F5620F' />
							</View> :
							<ScrollView className="flex-grow p-1">
								{/*{(console.log({data}))}*/}
								<TouchableOpacity className="items-center mt-8">
									<View style={styles.container}>
										{profilePicture ? (
											<Image source={{ uri: profilePicture }} style={styles.profilePicture} />
										) : (
											<Ionicons name="person-circle-outline" size={100} color="#bbb" />
										)}
										<TouchableOpacity onPress={handleProfilePictureUpload} style={styles.uploadButton}>
											{profilePicture ? (
												<Ionicons name="pencil-outline" size={30} color="#fff" />
											) : (
												<Ionicons name="camera-outline" size={30} color="#fff" />
											)}
										</TouchableOpacity>
									</View>
								</TouchableOpacity>

								<View className="p-6 space-y-10">
									<Text className="text-base">Nome</Text>
									<Controller
										name='name'
										control={control}
										render={({field: {onChange}}) => (
											<TextInput
												value={getValues('name')}
												onChangeText={onChange}
												className={errors.name ? 'p-4 border border-red-400 rounded' : 'p-4 border border-neutral-400 rounded'}
												placeholder='Ex.: João'
											/>
										)}
									/>
									<Text className="text-base">E-mail</Text>
									<Controller
										name='email'
										control={control}
										render={({field: {onChange}}) => (
											<TextInput
												value={getValues('email')}
												onChangeText={onChange}
												className={errors.email ? 'p-4 border border-red-400 rounded' : 'p-4 border border-neutral-400 rounded'}
												placeholder='email@email.com'
												maxLength={256}
											/>
										)}
									/>
									<Text className="text-base">Telefone</Text>
									<Controller
										name='phoneNumber'
										control={control}
										render={({field: {onChange}}) => (
											<MaskInput
												className='p-4 border border-gray-500 rounded-md h-45'
												placeholder='Ex: 000.000.000-00'
												value={getValues('phoneNumber')}
												onChangeText={onChange}
												mask={Masks.BRL_PHONE}
												maxLength={15}
											/>
										)}
									/>
									<Text className="text-base">CPF</Text>
									<Controller
										name='cpf'
										control={control}
										render={({field: {onChange}}) => (
											<MaskInput
												className='p-4 border border-gray-500 rounded-md h-45'
												placeholder='Ex: 000.000.000-00'
												value={getValues('cpf')}
												onChangeText={onChange}
												mask={Masks.BRL_CPF}
												maxLength={14}
											/>
										)}
									/>

									<TouchableOpacity onPress={handleCardClick}>
										<Text className="text-base">Dados Cartão</Text>
										<View className="h-30 border border-gray-500 rounded-md">
											<View className="flex-row justify-center items-center m-2">
												<FontAwesome name="credit-card-alt" size={24} color="#FF6112" />
												<Text className="flex-1 text-base text-right mb-0">
													{showCard ? <FontAwesome name="camera" size={24} color="#FF6112" /> : 'Adicionar Cartão'}
												</Text>
												<Icon name={showCard ? 'chevron-up' : 'chevron-down'} size={25} color="#FF4715" />
											</View>
										</View>
									</TouchableOpacity>

									{showCard && (
										<View className="border border-gray-500 p-4 mt-10">
											<View className="flex-row justify-between">
												<View className="flex-1 mr-5">
													<Text className="text-base text-[#FF6112]">Data venc.</Text>
													<Controller
														name='paymentCardInfos.dueDate'
														control={control}
														render={({field: {onChange}}) => (
															// <DateTimePicker
															// 	value={new Date(getValues('paymentCardInfos.dueDate'))}
															// 	minimumDate={new Date()}
															// 	placeholderText='MM/YY'
															// 	className='p-3 border border-gray-500 rounded-md h-18'
															// />
															<TextInputMask
																value={getValues('paymentCardInfos.dueDate')}
																className='p-3 border border-gray-500 rounded-md h-18'
																type={'datetime'}
																options={{
																	format: 'MM/YY',
																}}
																onChangeText={onChange}
																placeholder="MM/YY"
																keyboardType="numeric"
															/>
														)}
													/>
												</View>
												<View className="flex-1 ml-5">
													<Text className="text-base text-[#FF6112]">CVV</Text>
													<Controller
														name='paymentCardInfos.cvv'
														control={control}
														render={({ field: {onChange}}) => (
															<TextInput
																value={getValues('paymentCardInfos.cvv')}
																className='p-3 border border-gray-500 rounded-md h-18'
																onChangeText={onChange}
																placeholder="CVV"
																keyboardType="numeric"
																maxLength={4}
																secureTextEntry
															/>
														)}
													/>
												</View>
											</View>
											<View>
												<Text className='text-base text-[#FF6112]'>País</Text>
												<View className='flex flex-row items-center' >

													<View style={{ width: '100%' }}>
														<Controller
															name='paymentCardInfos.country'
															control={control}
															render={({field: {onChange}}) => (
																<SelectList
																	setSelected={(val: string) => {
																		onChange(val)
																	}}
																	data={countriesData}
																	save='value'
																	placeholder='Selecione um país...'
																	searchPlaceholder='Pesquisar...'
																/>
															)}
														/>
													</View>
												</View>
											</View>

											<View className="p-2 justify-center items-center">
												<TouchableOpacity onPress={handleSubmit(updateCardInfos)} className="h-10 w-40 rounded-md bg-red-500 flex items-center justify-center">
													<Text className="text-white">Salvar</Text>
												</TouchableOpacity>
											</View>
										</View>
									)}
									<View>
										<View className='p-2'>
											<TouchableOpacity onPress={handleSubmit(updateUserInfos)} className='h-14 w-81 rounded-md bg-orange-500 flex items-center justify-center' >
												<Text className='text-gray-50'>Salvar</Text>
											</TouchableOpacity>
										</View>

										<View className='p-2'>
											<TouchableOpacity onPress={handleDeleteAccount} className='h-14 w-81 rounded-md bg-red-500 flex items-center justify-center'>
												<Text className='text-gray-50'>Excluir essa conta</Text>
											</TouchableOpacity>
										</View>

										<View className='p-2'>
											<TouchableOpacity onPress={handleExitApp} className='h-14 w-81 rounded-md bg-orange-500 flex items-center justify-center' >
												<Text className='text-gray-50'>Sair do App</Text>
											</TouchableOpacity>
										</View>
									</View>
								</View>

								<Modal visible={showDeleteConfirmation} animationType="fade" transparent={true}>
									<View className="flex-1 justify-center items-center bg-black bg-opacity-10">
										<View className="bg-white rounded-md p-20 items-center">
											<Text className=" font-bold text-lg mb-8">Confirmar exclusão da conta?</Text>
											<TouchableOpacity className="h-10 w-40 mb-4 rounded-md bg-orange-500 flex items-center justify-center" onPress={handleCancelDelete}>
												<Text className="text-white">Cancelar</Text>
											</TouchableOpacity>
											<TouchableOpacity className="h-10 w-40 rounded-md bg-red-500 flex items-center justify-center" onPress={handleConfirmDelete}  onPressIn={() => navigation.navigate('DeleteAccountSuccess')}>
												<Text className="text-white">Confirmar</Text>
											</TouchableOpacity>
										</View>
									</View>
								</Modal>

								<Modal visible={showExitConfirmation} animationType="fade" transparent={true}>
									<View className="flex-1 justify-center items-center bg-black bg-opacity-10">
										<View className="bg-white rounded-md p-20 items-center">
											<Text className=" font-bold text-lg mb-8">Sair do App?</Text>
											<TouchableOpacity className="h-10 w-40 mb-4 rounded-md bg-orange-500 flex items-center justify-center" onPress={handleCancelExit}>
												<Text className="text-white">Cancelar</Text>
											</TouchableOpacity>
											<TouchableOpacity className="h-10 w-40 rounded-md bg-red-500 flex items-center justify-center" onPress={handleConfirmExit} onPressIn={() => navigation.navigate('Login')}>
												<Text className="text-white">Confirmar</Text>
											</TouchableOpacity>
										</View>
									</View>
								</Modal>
							</ScrollView>
					}
				</View>
	);
}

const styles = StyleSheet.create({
	container: {
		alignItems: 'center',
	},
	profilePicture: {
		width: 100,
		height: 100,
		borderRadius: 50,
	},
	uploadButton: {
		position: 'absolute',
		bottom: 0,
		right: 0,
		backgroundColor: '#FF6112',
		borderRadius: 15,
		padding: 8,
	},
	wrapper: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'white'
	},
	label: {
		color: 'black',
		paddingBottom: 20,
		fontSize: 20
	},
	maskedInput: {
		borderWidth: 2,
		borderRadius: 6,
		width: '80%',
		padding: 12,
		color: 'black',
		fontSize: 20
	}
});
//
// const handleCVVChange = (input: any) => {
// 	const numericInput = input.replace(/\D/g, '');
//
// 	const truncatedCVV = numericInput.slice(0, 3);
//
// 	setCVV(truncatedCVV);
// };
//
// const [ phoneNumber, setPhoneNumber ] = useState("")
// const [ cpf, setCpf ] = useState("")
//
// const getCountryImage = (countryName: string) => {
// 	const countryImg = countriesData.find(item => item.value === countryName)?.img
// 	return countryImg
// }
