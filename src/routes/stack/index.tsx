import { createStackNavigator } from '@react-navigation/stack';
import { Image } from 'react-native';
import { TextInput, Text } from 'react-native-paper';
import { View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import Login from '../../screens/Login';
import ChooseUserType from '../../screens/ChooseUserType/';
import Register from '../../screens/Register';
import Home from '../../screens/home';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Entypo } from '@expo/vector-icons';
import ProfileSettings from '../../screens/ProfileSettings';

const { Navigator, Screen } = createStackNavigator();

export default function () {
	return (
		<Navigator>
			<Screen
				name="ProfileSettings"
				component={ProfileSettings}
				options={{
					headerTintColor: 'white',
					headerStyle: {
						height: 60,
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
						<TouchableOpacity onPress={() => navigation.goBack()}>
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
					headerTitle: route.params.name,
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
