import {View, Image, Text, TouchableOpacity, TextInput, Modal, ActivityIndicator} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { useEffect, useState } from "react";
import { FontAwesome } from '@expo/vector-icons';
import { TextInputMask } from 'react-native-masked-text';
import React from "react";
import Icon from 'react-native-vector-icons/Ionicons';
import { SelectList } from 'react-native-dropdown-select-list'
import { useReserveInfo } from "../../hooks/useInfoReserve";
import SvgUri from 'react-native-svg-uri';
import storage from "../../utils/storage";
import { calculateDistance } from "../../components/calculateDistance/calculateDistance";
import { useUserPaymentCard } from '../../hooks/useUserPaymentCard';
import { z } from "zod";
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { isValidCPF } from "../../utils/isValidCpf";
import MaskInput, { Masks } from 'react-native-mask-input';
import useCountries from '../../hooks/useCountries'
import useUpdateCourtAvailabilityStatus from "../../hooks/useUpdateCourtAvailabilityStatus";
import { useRegisterSchedule } from "../../hooks/useRegisterSchedule";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { generateRandomKey } from "../../utils/activationKeyGenerate";
import { generatePix } from "../../services/pixCielo";
import { useUserPaymentPix } from "../../hooks/useUserPaymentPix";
import { StackActions, useFocusEffect } from '@react-navigation/native';
import { useGetUserById } from "../../hooks/useUserById";
import getAddress from "../../utils/getAddressByCep";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CieloRequestManager } from "../../services/cieloRequestManager";
import { transformCardExpirationDate } from "../../utils/transformCardExpirationDate";
import { convertToAmericanDate } from "../../utils/formatDate";

export 	interface iFormCardPayment {
	name: string
	cpf: string
	cvv: string
	date: string
	cep: string
	number: string
	street: string
	district: string
	complement: string
	city: string
	state: string
	cardNumber: string
}

export default function ReservationPaymentSign({ navigation, route }: NativeStackScreenProps<RootStackParamList, 'ReservationPaymentSign'>) {
	const [showCameraIcon, setShowCameraIcon] = useState(false);
	const [isLoading, setIsLoading] = useState<boolean>(false)
	const [showCard, setShowCard] = useState(false);
	const [expiryDate, setExpiryDate] = useState('');
	const [cvv, setCVV] = useState('');
	const [userGeolocation, setUserGeolocation] = useState<{ latitude: number, longitude: number }>()
	const [reserveValue, setReserveValue] = useState<number>();
	const [serviceValue, setServiceValue] = useState<number>();
	const [userName, setUserName] = useState<string>();
	const [userCPF, setUserCPF] = useState<string>();
	const [selected, setSelected] = React.useState("");
	const [totalValue, setTotalValue] = useState<number>();
	const [cardData, setCardData] = useState({
		cardNumber: '',
		expirationDate: '',
		cvv: '',
		country: ''
	});

	const { courtId, courtImage, courtName, userId, amountToPay, courtAvailabilityDate, courtAvailabilities } = route.params
	const { data: dataReserve, error: errorReserve, loading: loadingReserve } = useReserveInfo(courtAvailabilities)
	const [userPaymentCard, { data: userCardData, error: userCardError, loading: userCardLoading }] = useUserPaymentCard()
	const { data: dataCountry, error: errorCountry, loading: loadingCountry } = useCountries()
	const { data: userData, loading: isUserDataLoading, error: userDataError } = useGetUserById(userId);
	const [updateStatusCourtAvailability, { data: dataStatusAvailability, error: errorStatusAvailability, loading: loadingStatusAvailability }] = useUpdateCourtAvailabilityStatus()
	const [createSchedule, { data: dataCreateSchedule, error: errorCreateSchedule, loading: loadingCreateSchedule }] = useRegisterSchedule()
	const { data: dataUser, error: errorUser, loading: loadingUser } = useGetUserById(userId)
	const [addPaymentPix, { data: dataPaymentPix, loading: loadingPaymentPix, error: errorPaymentPix }] = useUserPaymentPix()

	useFocusEffect(() => {
		setUserName(dataUser?.usersPermissionsUser.data?.attributes.username!)
		setUserCPF(dataUser?.usersPermissionsUser.data?.attributes.cpf!)
	})



	const handleCardClick = () => {
		setShowCard(!showCard);
		setShowCameraIcon(false);
	};

	const handleSaveCard = () => {
		setShowCard(false);
	};

	const handleExpiryDateChange = (formatted: string) => {
		setExpiryDate(formatted);
	};

	const handleCVVChange = (input: any) => {
		const numericInput = input.replace(/\D/g, '');

		const truncatedCVV = numericInput.slice(0, 3);
		setCVV(truncatedCVV);
	};

	const [showPaymentInformation, setShowPaymentInformation] = useState(false);
	const [showRateInformation, setShowRateInformation] = useState(false);

	const handleRateInformation = () => {
		setShowRateInformation(true)
	};

	const handlePaymentInformation = () => {
		setShowPaymentInformation(true);
	}

	const handleCancelExit = () => {
		setShowPaymentInformation(false);
		setShowRateInformation(false);
	};

	storage.load<{ latitude: number, longitude: number }>({
		key: 'userGeolocation'
	}).then(data => setUserGeolocation(data));


	const courtLatitude = parseFloat(dataReserve?.courtAvailability?.data?.attributes?.court?.data?.attributes?.establishment?.data?.attributes?.address?.latitude ?? '0');
	const courtLongitude = parseFloat(dataReserve?.courtAvailability?.data?.attributes?.court?.data?.attributes?.establishment?.data?.attributes?.address?.longitude ?? '0');
	const userLatitude = parseFloat(userGeolocation?.latitude.toString() ?? "0");
	const userLongitude = parseFloat(userGeolocation?.longitude.toString() ?? "0");

	let distanceInMeters = calculateDistance(userLatitude, userLongitude, courtLatitude, courtLongitude)
	const distanceText = distanceInMeters >= 1000 ? `${(distanceInMeters / 1000).toFixed(1)} Km` : `${distanceInMeters.toFixed(0)} metros`;

	// const distanceText = '123'


	const formSchema = z.object({
		name: z.string({ required_error: "É necessário inserir o nome" }).max(29, { message: "Só é possivel digitar até 30 caracteres" }),
		cpf: z.string({ required_error: "É necessário inserir o CPF" }).max(15, { message: "CPF invalido" }).refine(isValidCPF, { message: "CPF inválido" }),
		cvv: z.string({ required_error: "É necessário inserir um CVV" }).max(3, { message: "Só é possivel digitar até 3 caracteres" }).min(3, { message: "O minimo são 3 caracteres" }),
		date: z.string().refine((value) => {
			const [month, year] = value.split('/');
			const numericMonth = parseInt(month, 10);
			const numericYear = parseInt(year, 10);
			if (isNaN(numericMonth) || isNaN(numericYear)) {
				return false;
			}
			if (numericMonth < 1 || numericMonth > 12) {
				return false;
			}
			const currentDate = new Date();
			const inputDate = new Date(`20${year}-${month}-01`);
			if (isNaN(inputDate.getTime())) {
				return false;
			}
			return inputDate > currentDate;

		}, { message: "A data de vencimento é inválida" }),
		cep: z.string().nonempty("É necessário inserir o CEP").min(8, "CEP inválido").max(9, "CEP inválido"),
		number: z.string().nonempty("É necessário inserir o numero da residência"),
		street: z.string().nonempty("É necessário inserir o nome da rua"),
		district: z.string().nonempty("É necessário inserir o bairro"),
		city: z.string().nonempty("É necessário inserir o nome da cidade"),
		state: z.string().nonempty("É necessário inserir o estado").min(2, "Inválido").max(2, "Inválido"),
		cardNumber: z.string().nonempty('É necessário inserir o número do cartão'),
	})

	const {
		control,
		handleSubmit,
		formState: { errors },
		getValues,
		setValue
	} = useForm<iFormCardPayment>({
		resolver: zodResolver(formSchema)
	})

	const getCountryImage = (countryName: string | null): string | undefined => {
		if (countryName && dataCountry) {
			const selectedCountry = dataCountry.countries.data.find(country => country.attributes.name === countryName);

			if (selectedCountry) {
				return selectedCountry.attributes.flag.data.attributes.url;
			}
		}
		return undefined;
	};


	const getCountryIdByName = (countryName: string | null): string => {
		if (countryName && dataCountry) {
			const selectedCountry = dataCountry.countries.data.find(name => name.attributes.name === countryName);

			if (selectedCountry) {
				return selectedCountry.id;
			}
		}
		return "";
	};

	const pay = async (data: iFormCardPayment) => {
		setIsLoading(true)
		try {
			if (userData && serviceValue && amountToPay) {
				const cieloRequestManager = new CieloRequestManager();
				const totalValue = (Number(amountToPay.toFixed(2)) + Number(serviceValue.toFixed(2))) * 100;

				console.log({ totalValue })

				const body: AuthorizeCreditCardPaymentResponse = {
					MerchantOrderId: "2014111701",
					Customer: {
						Name: data.name,
						Identity: data.cpf,
						IdentityType: "cpf",
						Email: userData.usersPermissionsUser.data.attributes.email,
						Birthdate: "1991-01-02",
						Address: {
							Street: data.street,
							Number: data.number,
							Complement: data.complement ? data.complement : '',
							ZipCode: data.cep,
							City: data.city,
							State: data.state,
							Country: "BRA",
						},
						DeliveryAddress: {
							Street: data.street,
							Number: data.number,
							Complement: data.complement ? data.complement : '',
							ZipCode: data.cep,
							City: data.city,
							State: data.state,
							Country: "BRA",
						},
					},
					Payment: {
						Type: "CreditCard",
						Amount: totalValue,
						Currency: "BRL",
						Country: "BRA",
						Provider: "Simulado",
						ServiceTaxAmount: 0,
						Installments: 1,
						Interest: "ByMerchant",
						Capture: 'true',
						Authenticate: 'false',
						Recurrent: 'false',
						CreditCard: {
							CardNumber: data.cardNumber.split(' ').join(''),
							Holder: data.name,
							ExpirationDate: transformCardExpirationDate(data.date),
							SecurityCode: data.cvv,
							SaveCard: "false",
							Brand: "Visa",
						},
					},
				};

				cieloRequestManager.authorizePayment(body).then(async (response) => {
					console.log(response)
					const newScheduleId = await createNewSchedule();
					const countryId = getCountryIdByName(selected);
					if (newScheduleId) {
						userPaymentCard({
							variables: {
								value: Number(response.Payment.Amount / 100),
								schedulingId: newScheduleId.toString(),
								userId: userId,
								name: data.name,
								cpf: data.cpf,
								cvv: parseInt(data.cvv),
								date: convertToAmericanDate(data.date),
								countryID: countryId,
								publishedAt: new Date().toISOString(),
								cep: data.cep,
								city: data.city,
								complement: data.complement,
								number: data.number,
								state: data.state,
								neighborhood: data.district,
								street: data.street,
								paymentId: response.Payment.PaymentId!,
								payedStatus: response.Payment.Status === 2 ? 'Payed' : 'Waiting',
							}
						}).then((response) => {
							console.log({ strapi_response: response })
							updateStatusDisponibleCourt();
							handleSaveCard();
							navigation.navigate('InfoReserva', { userId: userId })
						});
					}
				})
			}
		} catch (error) {
			console.error("Erro ao criar o agendamento:", error);
		} finally {
			setIsLoading(false)
		}
	};

	const createNewSchedule = async () => {
		let isPayed = dataReserve?.courtAvailability?.data?.attributes?.minValue === dataReserve?.courtAvailability.data.attributes.value ? true : false

		try {
			const create = await createSchedule({
				variables: {
					title: 'r',
					court_availability: courtAvailabilities,
					date: courtAvailabilityDate.split("T")[0],
					pay_day: courtAvailabilityDate.split("T")[0],
					value_payed: dataReserve?.courtAvailability?.data?.attributes?.minValue ? dataReserve?.courtAvailability?.data?.attributes?.minValue : 0,
					owner: userId,
					users: [userId],
					activation_key: isPayed ? generateRandomKey(4) : null,
					service_value: serviceValue!,
					publishedAt: new Date().toISOString()
				}

			});

			return create.data?.createScheduling?.data?.id

		} catch (error) {
			console.error("Erro na mutação createSchedule:", error);
		}
	};

	const updateStatusDisponibleCourt = () => {
		updateStatusCourtAvailability({
			variables: {
				id: courtAvailabilityDate,
				status: true
			}
		})
	}


	const generatePixSignal = async () => {
		let signalValue = Number(dataReserve?.courtAvailability.data.attributes.court.data.attributes.minimumScheduleValue!.toFixed(2))
		let signalValuePix = Number(dataReserve?.courtAvailability.data.attributes.court.data.attributes.minimumScheduleValue!.toFixed(2)) * 100

		const generatePixJSON: RequestGeneratePix = {
			MerchantOrderId: userId + generateRandomKey(3) + new Date().toISOString(),
			Customer: {
				Name: userName!,
				Identity: userCPF!,
				IdentityType: "cpf",
			},
			Payment: {
				Type: "Pix",
				Amount: 1
			}
		}

		const pixGenerated = await generatePix(generatePixJSON)

		await addPaymentPix({
			variables: {
				name: dataUser?.usersPermissionsUser.data.attributes.username!,
				cpf: dataUser?.usersPermissionsUser.data.attributes.cpf!,
				value: signalValue!,
				schedulingID: null,
				paymentID: pixGenerated.Payment.PaymentId,
				publishedAt: new Date().toISOString(),
				userID: userId
			}
		}).then((response) =>
			navigation.dispatch(
				StackActions.replace('PixScreen', {
					courtName: dataReserve?.courtAvailability.data.attributes.court.data.attributes.fantasy_name ? dataReserve?.courtAvailability.data.attributes.court.data.attributes.fantasy_name : "",
					value: signalValue!.toString(),
					userID: userId,
					QRcodeURL: pixGenerated.Payment.QrCodeString,
					paymentID: pixGenerated.Payment.PaymentId,
					userPaymentPixID: response.data?.createUserPaymentPix.data.id!,
					screen: "signal",
					court_availabilityID: courtAvailabilities,
					date: courtAvailabilityDate.split("T")[0],
					pay_day: courtAvailabilityDate.split("T")[0],
					value_payed: signalValue ? signalValue : 0,
					ownerID: userId,
					service_value: serviceValue,
					isPayed: signalValue === dataReserve?.courtAvailability.data.attributes.value ? true : false,
					schedulePrice: signalValue!,
					courtId: courtId,
					courtImage: courtImage,
					userPhoto: route.params.userPhoto!
				}))
		)
	}


	useEffect(() => {
		if (userData) {
			setValue('cpf', userData.usersPermissionsUser.data.attributes.cpf)
			if (userData.usersPermissionsUser.data.attributes.address) {
				getAddress(userData.usersPermissionsUser.data.attributes.address.cep).then(response => {
					console.log(response)
					setValue('cep', response.code)
					setValue('street', response.address)
					setValue('district', response.district)
					setValue('city', response.city)
					setValue('state', response.state)
				})
			}
		}
		AsyncStorage.getItem(`user${userId}Cards`)
			.then(console.log)
	}, [userData])

	useEffect(() => {
		if (
			dataReserve &&
			dataReserve.courtAvailability.data &&
			dataReserve.courtAvailability.data.attributes.court.data
		) {
			const scheduleValue = dataReserve.courtAvailability.data.attributes.value

			setReserveValue(scheduleValue);
			setServiceValue(scheduleValue * 0.04)
			setTotalValue(scheduleValue + (scheduleValue * 0.04))
		}
	}, [dataReserve])

	return (
		<View className="flex-1 bg-white w-full h-full pb-10">
			<ScrollView>
				<View>
					<Image source={{ uri: courtImage }} className="w-full h-[230]" />
				</View>
				<View className="pt-5 pb-4 flex justify-center flex-row">
					<Text className="text-base text-center font-bold">
						Para realizar sua reserva é necessário pagar um sinal.
					</Text>
					<TouchableOpacity className="p-1 px-3" onPress={handleRateInformation}>
						<FontAwesome name="question-circle-o" size={13} color="black" />
					</TouchableOpacity>
				</View>
				<View className="bg-gray-300 p-4">
					<Text className="text-5xl text-center font-extrabold text-gray-700">
						R$ {reserveValue}
					</Text>
				</View>
				<View className='px-10 py-5'>
					<TouchableOpacity className='py-4 rounded-xl bg-orange-500 flex items-center justify-center'
						onPressIn={() => {
							generatePixSignal()
						}}
					>
						<Text className='text-lg text-gray-50 font-bold'>Copiar código PIX</Text>
					</TouchableOpacity>
				</View>
				<View><Text className="text-center font-bold text-base text-gray-700">ou</Text></View>
				<View className="pt-5 px-9">
					<TouchableOpacity onPress={handleCardClick}>
						<View className="h-30 border border-gray-500 rounded-md">
							<View className="w-full h-14 border border-gray-500 rounded-md flex flex-row justify-between items-center px-4">
								<FontAwesome name="credit-card-alt" size={24} color="#FF6112" />
								<Text className="flex-1 text-base text-center mb-0">
									Selecionar Cartão
								</Text>
								<Icon name={showCard ? 'chevron-up' : 'chevron-down'} size={25} color="#FF4715" />
							</View>
						</View>
					</TouchableOpacity>
					{showCard && (
						<View className="border border-gray-500 rounded-xl p-4 mt-3">
							<View className="flex-row justify-between">
								<View className='flex-1 mr-[20px]'>
									<Text className='text-sm text-[#FF6112]'>Data de Venc.</Text>
									<Controller
										name='date'
										control={control}
										render={({ field: { onChange } }) => (
											<TextInputMask
												className='p-3 border border-gray-500 rounded-md h-18'
												options={{
													format: 'MM/YY',
												}}
												type={'datetime'}
												value={getValues('date')}
												onChangeText={onChange}
												placeholder="MM/YY"
												keyboardType="numeric"
												maxLength={5}
											/>
										)}
									></Controller>
									{errors.date && <Text className='text-red-400 text-sm'>{errors.date.message}</Text>}
								</View>
								<View className='flex-1 ml-[20px]'>
									<Text className='text-sm text-[#FF6112]'>CVV</Text>
									<Controller
										name='cvv'
										control={control}
										render={({ field: { onChange } }) => (
											<TextInput
												className='p-3 border border-gray-500 rounded-md h-18'
												placeholder='123'
												onChangeText={onChange}
												keyboardType='numeric'
												maxLength={3}>
											</TextInput>
										)}
									></Controller>
									{errors.cvv && <Text className='text-red-400 text-sm'>{errors.cvv.message}</Text>}
								</View>
							</View>
							<View>
								<Text className='text-sm text-[#FF6112]'>Nome</Text>
								<Controller
									name='name'
									control={control}
									render={({ field: { onChange } }) => (
										<TextInput
											className='p-3 border border-gray-500 rounded-md h-18'
											placeholder='Ex: nome'
											onChangeText={onChange}>
										</TextInput>
									)}
								></Controller>
								{errors.name && <Text className='text-red-400 text-sm'>{errors.name.message}</Text>}
							</View>
							<View>
								<Text className='text-sm text-[#FF6112]'>Número do Cartão</Text>
								<Controller
									name='cardNumber'
									control={control}
									render={({ field: { onChange } }) => (
										<MaskInput
											className='p-3 border border-gray-500 rounded-md h-18'
											placeholder='Ex: 0000 0000 0000 0000'
											mask={Masks.CREDIT_CARD}
											maxLength={19}
											keyboardType={'numeric'}
											value={getValues('cardNumber')}
											onChangeText={onChange}>
										</MaskInput>
									)}
								></Controller>
								{errors.name && <Text className='text-red-400 text-sm'>{errors.name.message}</Text>}
							</View>
							<View>
								<Text className='text-sm text-[#FF6112]'>CPF</Text>
								<Controller
									name='cpf'
									control={control}
									render={({ field: { onChange } }) => (
										<MaskInput
											className='p-3 border border-gray-500 rounded-md h-18'
											placeholder='Ex: 000.000.000-00'
											value={getValues('cpf')}
											onChangeText={(masked, unmasked, obfuscated) => onChange(unmasked)}
											mask={Masks.BRL_CPF}
											keyboardType='numeric'>
										</MaskInput>
									)}
								></Controller>
								{errors.cpf && <Text className='text-red-400 text-sm'>{errors.cpf.message}</Text>}
							</View>
							<View>
								<Text className='text-sm text-[#FF6112]'>País</Text>
								<View className='flex flex-row items-center justify-between p-3 border border-neutral-400 rounded bg-white'>
									<Image className='h-[21px] w-[30px] mr-[10px] rounded' source={{ uri: getCountryImage(selected) }}></Image>
									<SelectList
										setSelected={(val: string) => {
											setSelected(val);

										}}
										data={!loadingCountry && dataCountry?.countries?.data.map(country => ({
											value: country?.attributes.name,
											label: country?.attributes.name || "",
											img: `${country?.attributes.flag?.data?.attributes?.url || ""}`
										})) || []}
										save="value"
										placeholder='Selecione um país'
										searchPlaceholder='Pesquisar...'
									/>
								</View>
							</View>
							<View className="flex flex-row justify-between">
								<View>
									<Text className='text-sm text-[#FF6112]'>CEP</Text>
									<Controller
										name='cep'
										control={control}
										render={({ field: { onChange } }) => (
											<MaskInput
												className='p-3 border border-gray-500 rounded-md h-18'
												placeholder='Ex: 00000-000'
												value={getValues('cep')}
												keyboardType='numeric'
												mask={Masks.ZIP_CODE}
												maxLength={9}
												onChangeText={(masked, unmasked) => onChange(unmasked)}>
											</MaskInput>
										)}
									></Controller>
									{errors.cep && <Text className='text-red-400 text-sm'>{errors.cep.message}</Text>}
								</View>
								<View>
									<Text className='text-sm text-[#FF6112]'>Numero</Text>
									<Controller
										name='number'
										control={control}
										render={({ field: { onChange } }) => (
											<TextInput
												className='p-3 border border-gray-500 rounded-md h-18'
												placeholder='Ex: nome'
												onChangeText={onChange}>
											</TextInput>
										)}
									></Controller>
									{errors.number && <Text className='text-red-400 text-sm'>{errors.number.message}</Text>}
								</View>
							</View>
							<View>
								<Text className='text-sm text-[#FF6112]'>Rua</Text>
								<Controller
									name='street'
									control={control}
									render={({ field: { onChange } }) => (
										<TextInput
											className='p-3 border border-gray-500 rounded-md h-18'
											placeholder='Ex: Rua xxxxxx'
											value={getValues('street')}
											onChangeText={onChange}>
										</TextInput>
									)}
								></Controller>
								{errors.street && <Text className='text-red-400 text-sm'>{errors.street.message}</Text>}
							</View>
							<View>
								<Text className='text-sm text-[#FF6112]'>Bairro</Text>
								<Controller
									name='district'
									control={control}
									render={({ field: { onChange } }) => (
										<TextInput
											className='p-3 border border-gray-500 rounded-md h-18'
											placeholder='Ex: Jd. xxxxxxx'
											value={getValues('district')}
											onChangeText={onChange}>
										</TextInput>
									)}
								></Controller>
								{errors.district && <Text className='text-red-400 text-sm'>{errors.district.message}</Text>}
							</View>
							<View>
								<Text className='text-sm text-[#FF6112]'>Complemento</Text>
								<Controller
									name='complement'
									control={control}
									render={({ field: { onChange } }) => (
										<TextInput
											className='p-3 border border-gray-500 rounded-md h-18'
											placeholder='Ex: Lado ABC'
											onChangeText={onChange}>
										</TextInput>
									)}
								></Controller>
								{errors.complement && <Text className='text-red-400 text-sm'>{errors.complement.message}</Text>}
							</View>
							<View className="flex flex-row justify-between">
								<View>
									<Text className='text-sm text-[#FF6112]'>Cidade</Text>
									<Controller
										name='city'
										control={control}
										render={({ field: { onChange } }) => (
											<TextInput
												className='p-3 border border-gray-500 rounded-md h-18'
												placeholder='Ex: xxxxx'
												value={getValues('city')}
												onChangeText={onChange}>
											</TextInput>
										)}
									></Controller>
									{errors.city && <Text className='text-red-400 text-sm'>{errors.city.message}</Text>}
								</View>
								<View>
									<Text className='text-sm text-[#FF6112]'>Estado</Text>
									<Controller
										name='state'
										control={control}
										render={({ field: { onChange } }) => (
											<TextInput
												className='p-3 border border-gray-500 rounded-md h-18'
												placeholder='Ex: XX'
												value={getValues('state')}
												maxLength={2}
												onChangeText={onChange}>
											</TextInput>
										)}
									></Controller>
									{errors.state && <Text className='text-red-400 text-sm'>{errors.state.message}</Text>}
								</View>
							</View>
							<View className="p-2 justify-center items-center pt-5">
								<TouchableOpacity onPress={handleSubmit(pay)} disabled={isLoading} className="h-10 w-40 rounded-md bg-red-500 flex items-center justify-center">
									{
										isLoading ? <ActivityIndicator size={'small'} color={'#F5620F'} /> :
											<Text className="text-white">Pagar</Text>
									}
								</TouchableOpacity>
							</View>
						</View>
					)}
					<View>
						<Text className="text-center font-extrabold text-3xl text-gray-700 pt-10 pb-4">
							Detalhes Reserva
						</Text>
					</View>
				</View>
				<View className="bg-gray-300 flex flex-row">
					<View className="m-6">
						<Text className="text-base">{dataReserve?.courtAvailability?.data?.attributes?.court?.data?.attributes?.name}</Text>
						<Text className="text-base">{distanceText} de distância</Text>
						<View className="flex flex-row">
							<Text className="text-base">Avaliação: {dataReserve?.courtAvailability?.data?.attributes?.court?.data?.attributes?.rating}</Text>
							<View className="pt-1.5 pl-1.5">
								<FontAwesome name="star" color="#FF4715" size={11} /></View>
						</View>
						<Text className="text-base">{dataReserve?.courtAvailability?.data?.attributes?.court?.data?.attributes?.establishment?.data?.attributes?.address?.streetName}</Text>
					</View>
					<View className="justify-center gap-1">
						{
							dataReserve?.courtAvailability.data.attributes.court.data.attributes.establishment.data.attributes.amenities.data.map((amenitieInfo) =>
								<View className="flex flex-row  items-center">
									<SvgUri
										width="14"
										height="14"
										source={{ uri: amenitieInfo.attributes.iconAmenitie.data.attributes.url }}
									/>
									<Text className="text-base pl-2">{amenitieInfo.attributes.name}</Text>
								</View>
							)
						}
					</View>
				</View>
				<View className="p-4 justify-center items-center border-b ml-8 mr-8">
					<View className="flex flex-row gap-6">
						<Text className="font-bold text-xl text-[#717171]">Valor da Reserva</Text>
						<Text className="font-bold text-xl text-right text-[#717171]">R$ {amountToPay && amountToPay.toFixed(2)}</Text>
					</View>
					<View className="flex flex-row gap-6">
						<View className="flex flex-row pt-1">
							<Text className="font-bold text-xl text-[#717171]">Taxa de Serviço</Text>
							<TouchableOpacity onPress={handlePaymentInformation}>
								<FontAwesome name="question-circle-o" size={13} color="black" />
							</TouchableOpacity>
						</View>
						<Text className="font-bold text-xl text-right text-[#717171]">R$ {serviceValue && serviceValue.toFixed(2)}</Text>
					</View>
				</View>
				<View className="justify-center items-center pt-6">
					<View className="flex flex-row gap-10">
						<Text className="font-bold text-xl text-right text-[#717171]">Total: </Text>
						<Text className="flex flex-row font-bold text-xl text-right text-[#717171]"> R$ {(amountToPay + serviceValue!).toFixed(2)}</Text>
					</View>
				</View>
				<Modal visible={showPaymentInformation} animationType="fade" transparent={true}>
					<View className="flex-1 justify-center items-center bg-black bg-opacity-0 rounded">
						<View className="bg-white rounded-md items-center ">
							<Text className="bg-white p-8 rounded text-base text-center">Através dessa taxa provemos a tecnologia necessária para você reservar suas quadras com antecedência e rapidez.</Text>
							<TouchableOpacity className="h-10 w-40 mb-4 rounded-md bg-orange-500 flex items-center justify-center" onPress={handleCancelExit}>
								<Text className="text-white">OK</Text>
							</TouchableOpacity>
						</View>
					</View>
				</Modal>
				<Modal visible={showRateInformation} animationType="fade" transparent={true}>
					<View className="flex-1 justify-center items-center bg-black bg-opacity-0 rounded">
						<View className="bg-white rounded-md items-center">
							<Text className="bg-white p-8 rounded text-base text-center">Esse valor será deduzido do valor total e não será estornado, mesmo no caso de não comparecimento ao local ou cancelamento da reserva.</Text>
							<TouchableOpacity className="h-10 w-40 mb-4 rounded-md bg-orange-500 flex items-center justify-center" onPress={handleCancelExit}>
								<Text className="text-white">OK</Text>
							</TouchableOpacity>
						</View>
					</View>
				</Modal>
			</ScrollView>
		</View>
	)
}