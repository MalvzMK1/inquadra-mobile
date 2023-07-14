import { createStackNavigator } from '@react-navigation/stack';
import { Image } from 'react-native';
import { TextInput } from 'react-native-paper';

import Login from '../../screens/Login';
import ChooseUserType from '../../screens/ChooseUserType';
import Register from '../../screens/Register/Client';
import Password from '../../screens/Register/Client/password';
import RegisterSuccess from '../../screens/Register/Client/success';
import Home from '../../screens/home';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Entypo } from '@expo/vector-icons';

const { Navigator, Screen } = createStackNavigator();

export default function () {
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
				component={Home}
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
						<TouchableOpacity className="ml-3">
							<Entypo
								name="menu"
								size={48}
								color={'white'}
							/>
						</TouchableOpacity>
					),
				}}
			/>
			<Screen
				name="HomeVariant"
				component={Home}
				options={({ route }) => ({
					// headerTitle: route.params.name,
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
			<Screen
				name="RegisterPassword"
				component={Password}
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
		</Navigator>
	);
}
