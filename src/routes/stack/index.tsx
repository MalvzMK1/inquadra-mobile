import { useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { Image, View } from 'react-native';
import { TextInput, Text } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';
import Login from '../../screens/Login';
import ChooseUserType from '../../screens/ChooseUserType/';
import Register from '../../screens/Register/Client';
import RegisterEstablishment from '../../screens/Register/Establishment';
import Password from '../../screens/Register/Client/password';
import RegisterSuccess from '../../screens/Register/Client/success';
import Home from '../../screens/home';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Entypo, MaterialCommunityIcons } from '@expo/vector-icons';
import ProfileSettings from '../../screens/ProfileSettings';
import FavoriteCourts from "../../screens/FavoriteCourts";
import InfoReserva from "../../screens/InfoReserva";
import EstablishmentInfo from '../../screens/EstablishmentInfo';
import DeleteAccountSuccess from '../../screens/ProfileSettings/client/deleteAccount';
import DescriptionReserve from '../../screens/InfoReserva/descriptionReserve';
import InvitedDescription from '../../screens/InfoReserva/descriptionReserve';
import DescriptionInvited from '../../screens/InfoReserva/descriptionInvited';
import PixScreen from '../../screens/Pix';
import { NavigationProp, useNavigation } from "@react-navigation/native";
import CourtAvailibilityInfo from '../../screens/CourtAvailibilityInfo';
import CourtPriceHour from '../../screens/CourtPriceHour';
import EditCourt from '../../screens/EditCourt';
import CourtSchedule from '../../screens/CourtSchedule';
import CompletedEstablishmentRegistration from '../../screens/CompletedEstablishmentRegistration';
import InfoProfileEstablishment from '../../screens/ProfileEstablishmentRegistration/Client/InfoProfileEstablishment';
import DeleteAccountEstablishment from '../../screens/ProfileEstablishmentRegistration/Client/deleteAccount';
import FinancialEstablishment from '../../screens/FinancialEstablishment';
import RegisterCourt from '../../screens/RegisterCourt';
import ReservationPaymentSign from '../../screens/ReservationPaymentSign';
import {HOST_API} from '@env'

const { Navigator, Screen } = createStackNavigator<RootStackParamList>();

export default function () {
	const [menuBurguer, setMenuBurguer] = useState(false)
	const navigation = useNavigation<NavigationProp<RootStackParamList>>()
	return (
		<Navigator>
			<Screen
				name="Login"
				component={Login}
				options={{
					headerTitle: () => (
						<Image source={require('../../assets/inquadra_logo.png')} />
					),
					headerTitleAlign: 'center',
					headerStyle: {
						height: 200,
						backgroundColor: '#292929',
					},
				}}
			/>
			<Screen
				name="CourtSchedule"
				component={CourtSchedule}
				options={{
					headerTintColor: 'white',
					headerStyle: {
						height: 85,
						backgroundColor: '#292929',
					},
					headerTitleAlign: 'center',
					headerTitle: () => (
						<View className='flex-1 justify-center items-center'>
							<Text className='text-white text-[18px] font-black'>Agenda</Text>
						</View>
					),
					headerRight: () => (
						<TouchableOpacity className='pr-[10px]'>
							<Image source={require('../../assets/court_image.png')} className='w-[30px] h-[30px] rounded-[15px]' />
						</TouchableOpacity>
					),
					headerLeft: ({ navigation }) => (
						<TouchableOpacity onPress={() => navigation.goBack()}>
							<Icon name="arrow-back" size={25} color="white" />
						</TouchableOpacity>
					),
				}}
			/>
			<Screen
				name="ChooseUserType"
				component={ChooseUserType}
				options={{
					headerShown: false,
				}}
			/>
			<Screen
				name="PixScreen"
				component={PixScreen}
				options={{
					headerShown: false,
				}}
			/>
			<Screen
				name="Register"
				component={Register}
				options={{
					headerTitle: '',
				}}
			/>
			<Screen
				name="EstablishmentRegister"
				component={RegisterEstablishment}
				options={{
					headerTitle: '',
				}}
			/>
			<Screen
				name='RegisterCourts'
				component={RegisterCourt}
				options={{
					headerShown: false
				}}
			/>
			<Screen
				name="Home"
				options={({ route: { params } }) => ({
					headerTintColor: 'white',
					headerStyle: {
						height: 125,
						backgroundColor: '#292929',
					},
					headerTitle: () => (
						<TextInput
							theme={{ colors: { placeholder: '#e9e9e9' } }}
							placeholder="O que você está procurando?"
							className="bg-white rounded-2xl w-full flex items-center justify-center placeholder:text-[#e9e9e9] text-sm outline-none"
							right={<TextInput.Icon icon={'magnify'} />}
						/>
					),
					headerRight: () => (
						<TouchableOpacity className="w-12 h-12 bg-gray-500 mr-3 rounded-full overflow-hidden" onPress={() => {
							console.log(params)
							navigation.navigate('ProfileSettings', {
								userPhoto: HOST_API + params.userPhoto
							})
						}}>
							<Image
								source={params.userPhoto ? { uri: `http://192.168.0.10:1337${params.userPhoto}` } : require('../../assets/default-user-image.png')}
								className="w-full h-full"
							/>
						</TouchableOpacity>
					),
					headerLeft: () => (
						<TouchableOpacity className="ml-3" onPress={() => {
							setMenuBurguer((prevState) => !prevState)
						}}>
							{
								!menuBurguer ?
									<Entypo
										name="menu"
										size={48}
										color={'white'}
									/>
									:
									<MaterialCommunityIcons
										name="window-close"
										size={48}
										color="white"
									/>

							}
						</TouchableOpacity>
					),
				})}
			>
				{props => (
					<Home
						{...props}
						menuBurguer={menuBurguer}
					/>
				)}
			</Screen>
			<Screen
				name="HomeVariant"
				options={({ route: {params} }) => ({
					headerTitleStyle: {
						fontSize: 26
					},
					headerTitleAlign: 'center',
					headerTintColor: 'white',
					headerStyle: {
						height: 125,
						backgroundColor: '#292929',
					},
					headerLeftContainerStyle: {
						marginLeft: 12,
					},
					headerRight: () => (
						<TouchableOpacity className="w-12 h-12 bg-gray-500 mr-3 rounded-full overflow-hidden" onPress={() => {
							navigation.navigate('ProfileSettings', {
								userPhoto: params.userPhoto
							})
						}}>
							<Image
								source={params.userPhoto ? {uri: `http://192.168.0.10:1337${params.userPhoto}`} : require('../../assets/default-user-image.png')}
								className="w-full h-full"
							/>
						</TouchableOpacity>
					),
				})}
			>
				{props => (
					<Home
						{...props}
						menuBurguer={menuBurguer}
					/>
				)}
			</Screen>
			<Screen
				name="RegisterPassword"
				component={Password}
			/>
			<Screen
				name="DeleteAccountSuccess"
				component={DeleteAccountSuccess}
				options={{
					headerTintColor: 'white',
					headerStyle: {
						height: 100,
						backgroundColor: '#292929',
					},
					headerTitleAlign: 'center',
					headerTitle: () => (
						<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
							<Text style={{ color: 'white', fontSize: 18, fontWeight: '900' }}>PERFIL</Text>
						</View>
					),
				}}
			/>
			<Screen
				name="InfoReserva"
				component={InfoReserva}
				options={{
					headerShown: false
				}}
			/>
			<Screen
				name="DescriptionReserve"
				component={DescriptionReserve}
				options={{
					headerShown: false
				}}
			/>
			<Screen
				name="DescriptionInvited"
				component={DescriptionInvited}
				options={{
					headerShown: false
				}}
			/>

			<Screen
				name="RegisterSuccess"
				component={RegisterSuccess}
				options={{
					title: '',
					headerTransparent: true,
					headerShown: false
				}}
			/>
			<Screen
				name="FavoriteCourts"
				component={FavoriteCourts}
				options={({ route: { params } }) => ({
					headerTitle: 'Favoritos',
					headerTitleStyle: {
						fontSize: 26
					},
					headerTitleAlign: 'center',
					headerTintColor: 'white',
					headerStyle: {
						height: 125,
						backgroundColor: '#292929',
					},
					headerLeftContainerStyle: {
						marginLeft: 12,
					},
					headerRight: () => (
						<TouchableOpacity className="w-12 h-12 bg-gray-500 mr-3 rounded-full overflow-hidden" onPress={() => {
							navigation.navigate('ProfileSettings', {
								userPhoto: params.userPhoto
							})
						}}>
							<Image
								source={params.userPhoto ? { uri: `http://192.168.0.10:1337${params.userPhoto}` } : require('../../assets/default-user-image.png')}
								className="w-full h-full"
							/>
						</TouchableOpacity>
					),
				})}
			/>
			<Screen
				name="ProfileSettings"
				component={ProfileSettings}
				options={({ route: { params } }) => ({
					headerTintColor: 'white',
					headerStyle: {
						height: 100,
						backgroundColor: '#292929',
					},
					headerTitleAlign: 'center',
					headerTitle: () => (
						<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
							<Text style={{ color: 'white', fontSize: 18, fontWeight: '900' }}>PERFIL</Text>
						</View>
					),
					headerRight: () => (
						<TouchableOpacity className='w-12 h-12 bg-gray-500 mr-3 rounded-full overflow-hidden'>
							<Image
								source={params?.userPhoto ? { uri: params.userPhoto } : require('../../assets/default-user-image.png')}
								className='w-full h-full'
							/>
						</TouchableOpacity>
					),
				})}
			/>
			<Screen
				name="EstablishmentInfo"
				options={({ route: { params } }) => ({
					headerTintColor: 'white',
					headerStyle: {
						height: 100,
						backgroundColor: '#292929',
					},
					headerTitleAlign: 'center',
					headerTitle: () => (
						<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
							<Text style={{ color: 'white', fontSize: 18, fontWeight: '900' }}>ESTABELECIMENTO</Text>
						</View>
					),
					headerRight: () => (
						<TouchableOpacity className='w-12 h-12 bg-gray-500 mr-3 rounded-full overflow-hidden'>
							<Image
								source={params?.userPhoto ? { uri: `http://192.168.0.10:1337${params.userPhoto}` } : require('../../assets/default-user-image.png')}
								className='w-full h-full'
							/>
						</TouchableOpacity>
					),
					headerLeft: () => (
						<TouchableOpacity onPress={() => navigation.goBack()}>
							<Icon name="arrow-back" size={25} color="white" />
						</TouchableOpacity>
					),
				})}
			>
				{props => (
					<EstablishmentInfo
						{...props}
					/>
				)}
			</Screen>
			<Screen
				name="CourtAvailibilityInfo"
				component={CourtAvailibilityInfo}
				options={{
					headerShown: false,
				}}
			/>
			<Screen
				name='ReservationPaymentSign'
				component={ReservationPaymentSign}
				options={{
					headerShown: false
				}}
			/>
			<Screen
				name="CompletedEstablishmentResgistration"
				component={CompletedEstablishmentRegistration}
				options={{
					headerTintColor: 'white',
					headerStyle: {
					},headerTitleAlign: 'center',
				}}
			/>
			<Screen
				name="DeleteAccountEstablishment"
				component={DeleteAccountEstablishment}
				options={{
					headerTintColor: 'white',
					headerStyle: {
						height: 100,
						backgroundColor: '#292929',
					},
					headerTitleAlign: 'center',
					headerTitle: () => (
						<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
							<Text style={{ color: 'white', fontSize: 18, fontWeight: '900' }}>PERFIL</Text>
						</View>
					),
				}}
			/>
			<Screen
				name="InfoProfileEstablishment"
				component={InfoProfileEstablishment}
				options={{
					headerTintColor: 'white',
					headerStyle: {
						height: 100,
						backgroundColor: '#292929',
					},
					headerTitleAlign: 'center',
					headerTitle: () => (
						<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
							<Text style={{ color: 'white', fontSize: 18, fontWeight: '900' }}>PERFIL</Text>
						</View>
					),
					headerRight: () => (
						<TouchableOpacity style={{ paddingRight: 10 }}>
							<Image source={require('../../assets/picture.png')} style={{ width: 30, height: 30, borderRadius: 15 }} />
						</TouchableOpacity>
					),
					headerLeft: ({ navigation }) => (
						<TouchableOpacity onPress={() => navigation.navigate('Login')}>
							<Icon name="arrow-back" size={25} color="white" />
						</TouchableOpacity>
					),
				}}
			/>
			<Screen
				name="FinancialEstablishment"
				component={FinancialEstablishment}
				options={{
					headerTintColor: 'white',
					headerStyle: {
						height: 100,
						backgroundColor: '#292929',
					},
					headerTitleAlign: 'center',
					headerTitle: () => (
						<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
							<Text style={{ color: 'white', fontSize: 18, fontWeight: '900' }}>PERFIL</Text>
						</View>
					),
					headerRight: () => (
						<TouchableOpacity style={{ paddingRight: 10 }}>
							<Image source={require('../../assets/picture.png')} style={{ width: 30, height: 30, borderRadius: 15 }} />
						</TouchableOpacity>
					),
					headerLeft: ({ navigation }) => (
						<TouchableOpacity onPress={() => navigation.navigate('Login')}>
							<Icon name="arrow-back" size={25} color="white" />
						</TouchableOpacity>
					),
				}}
			/>
			<Screen
				name='CourtPriceHour'
				component={CourtPriceHour}
				options={{
					headerTitle: 'Definir hora/valor',
					headerLeft: ({ navigation }) => (
						<TouchableOpacity onPress={() => navigation.goBack()}>
							<Icon name="arrow-back" size={25} color="black" />
						</TouchableOpacity>
					)
				}}
			/>
			<Screen
				name="EditCourt"
				component={EditCourt}
				options={{
					headerTintColor: 'white',
					headerStyle: {
						height: 80,
						backgroundColor: '#292929',
					},
					headerTitleAlign: 'center',
					headerTitle: () => (
						<View className='flex-1 justify-center items-center'>
							<Text className='text-white text-[18px] font-black'>QUADRAS</Text>
						</View>
					),
					headerRight: () => (
						<TouchableOpacity className='pr-[10px]'>
							<Image source={require('../../assets/court_image.png')} className='w-[30px] h-[30px] rounded-[15px]' />
						</TouchableOpacity>
					),
					headerLeft: ({ navigation }) => (
						<TouchableOpacity onPress={() => navigation.navigate('Login')}>
							<Icon name="arrow-back" size={25} color="white" />
						</TouchableOpacity>
					),
				}}
			/>
	
		</Navigator>
	);
}
