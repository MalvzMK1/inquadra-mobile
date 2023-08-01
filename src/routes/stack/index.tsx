import { useState } from 'react';
import Home from '../../screens/home';
import { createStackNavigator } from '@react-navigation/stack';
import { Image, View } from 'react-native';
import { TextInput, Text } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';
import Login from '../../screens/Login';
import ChooseUserType from '../../screens/ChooseUserType/';
import Register from '../../screens/Register/Client';
import Password from '../../screens/Register/Client/password';
import RegisterSuccess from '../../screens/Register/Client/success';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Entypo, MaterialCommunityIcons } from '@expo/vector-icons';
import ProfileSettings from '../../screens/ProfileSettings';
import FavoriteCourts from "../../screens/FavoriteCourts";
import InfoReserva from "../../screens/InfoReserva";
import DeleteAccountSuccess from '../../screens/ProfileSettings/client/deleteAccount';
import ReservationPaymentSign from '../../screens/ReservationPaymentSign';
import ProfileEstablishmentRegistration from '../../screens/ProfileEstablishmentRegistration';
import RegisterEstablishment from '../../screens/ProfileEstablishmentRegistration/Client/RegisterEstablishment';
import RegisterCourt from '../../screens/RegisterCourt';
import RegisterNewCourt from '../../screens/RegisterCourt/Client/newCourt';
import AllVeryWell from '../../screens/AllVeryWell';
import CourtDetails from '../../screens/AllVeryWell/CourtDetails';
import HomeEstablishment from '../../screens/HomeEstablishment';
import InfoProfileEstablishment from '../../screens/ProfileEstablishmentRegistration/Client/InfoProfileEstablishment';

const { Navigator, Screen } = createStackNavigator<RootStackParamList>();

export default function () {

	const [menuBurguer, setMenuBurguer] = useState(false)

	return (
		<Navigator>
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
				name="HomeEstablishment"
				component={HomeEstablishment}
				options={{
					headerTintColor: 'white',
					headerStyle: {
						height: 100,
						backgroundColor: '#292929',
					},
					headerTitleAlign: 'center',
					headerTitle: () => (
						<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
							<Text style={{ color: 'white', fontSize: 18, fontWeight: '900' }}>Olá, Jhon!</Text>
						</View>
					),
					headerRight: () => (
						<TouchableOpacity style={{ paddingRight: 10 }}>
							<Image source={require('../../assets/picture.png')} style={{ width: 30, height: 30, borderRadius: 15 }} />
						</TouchableOpacity>
					),
				}}
			/>
			<Screen
				name="TudoCerto"
				component={AllVeryWell}
				options={{
					headerTintColor: 'white',
					headerStyle: {
						height: 100,
						backgroundColor: 'white',
					},headerTitleAlign: 'center',
					headerTitle: () => (
						<View>
							<Text className='text-4xl font-extrabold'>Tudo Certo?</Text>
						</View>
					),
					headerLeft: ({ navigation }) => (
						<TouchableOpacity onPress={() => navigation.navigate('Login')}>
							<Icon name="arrow-back" size={25} color="black" />
						</TouchableOpacity>
					),
				}}
			/>
			<Screen
				name="CourtDetails"
				component={CourtDetails}
				options={{
					headerTintColor: 'white',
					headerStyle: {
						height: 100,
						backgroundColor: 'white',
					},headerTitleAlign: 'center',
					headerTitle: () => (
						<View>
							<Text className='text-4xl font-extrabold'>Tudo Certo?</Text>
						</View>
					),
					headerLeft: ({ navigation }) => (
						<TouchableOpacity onPress={() => navigation.navigate('Login')}>
							<Icon name="arrow-back" size={25} color="black" />
						</TouchableOpacity>
					),
				}}
			/>
			<Screen
				name="ProfileEstablishmentRegistration"
				component={ProfileEstablishmentRegistration}
				options={{
					headerTintColor: 'white',
					headerStyle: {
						height: 100,
						backgroundColor: '#292929',
					},headerTitleAlign: 'center',
					headerTitle: () => (
						<View>
							
						</View>
					),
					headerLeft: ({ navigation }) => (
						<TouchableOpacity onPress={() => navigation.navigate('Login')}>
							<Icon name="arrow-back" size={25} color="white" />
						</TouchableOpacity>
					),
				}}
			/>
			<Screen
				name="RegisterEstablishment"
				component={RegisterEstablishment}
				options={{
					headerTintColor: 'white',
					headerStyle: {
						height: 100,
						backgroundColor: '#292929',
					},headerTitleAlign: 'center',
					headerTitle: () => (
						<View>
							
						</View>
					),
					headerLeft: ({ navigation }) => (
						<TouchableOpacity onPress={() => navigation.navigate('Login')}>
							<Icon name="arrow-back" size={25} color="white" />
						</TouchableOpacity>
					),
				}}
			/>
			<Screen
				name="RegisterCourt"
				component={RegisterCourt}
				options={{
					headerTintColor: 'white',
					headerStyle: {
						height: 100,
						backgroundColor: '#292929',
					},headerTitleAlign: 'center',
					headerTitle: () => (
						<View>
							
						</View>
					),
					headerLeft: ({ navigation }) => (
						<TouchableOpacity onPress={() => navigation.navigate('Login')}>
							<Icon name="arrow-back" size={25} color="white" />
						</TouchableOpacity>
					),
				}}
			/>
			<Screen
				name="RegisterNewCourt"
				component={RegisterNewCourt}
				options={{
					headerTintColor: 'white',
					headerStyle: {
						height: 100,
						backgroundColor: '#292929',
					},headerTitleAlign: 'center',
					headerTitle: () => (
						<View>
							
						</View>
					),
					headerLeft: ({ navigation }) => (
						<TouchableOpacity onPress={() => navigation.navigate('Login')}>
							<Icon name="arrow-back" size={25} color="white" />
						</TouchableOpacity>
					),
				}}
			/>
			<Screen
				name="ReservationPaymentSign"
				component={ReservationPaymentSign}
				options={{
					headerTintColor: 'white',
					headerStyle: {
						height: 100,
						backgroundColor: '#292929',
					},
					headerTitleAlign: 'center',
					headerTitle: () => (
						<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
							<Text style={{ color: 'white', fontSize: 18, fontWeight: '900' }}>SINAL</Text>
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
				name="ProfileSettings"
				component={ProfileSettings}
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
				name="ChooseUserType"
				component={ChooseUserType}
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
				name="Home"
				options={{
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
						<TouchableOpacity className="w-12 h-12 bg-gray-500 mr-3 rounded-full overflow-hidden">
							<Image
								source={require('../../assets/qodeless_logo.jpg')}
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
				}}
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
				options={({ route }) => ({
					// headerTitle: route.params.name,
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
						<TouchableOpacity className="w-12 h-12 bg-gray-500 mr-3 rounded-full overflow-hidden">
							<Image
								source={require('../../assets/qodeless_logo.jpg')}
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
					headerShown: false,
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
				options={({ route }) => ({
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
						<TouchableOpacity className="w-12 h-12 bg-gray-500 mr-3 rounded-full overflow-hidden">
							<Image
								source={require('../../assets/qodeless_logo.jpg')}
								className="w-full h-full"
							/>
						</TouchableOpacity>
					),
				})}
			/>
		</Navigator>
	);
}
