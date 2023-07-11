import { createStackNavigator } from '@react-navigation/stack';
import { Image, View } from 'react-native';
import { Entypo } from '@expo/vector-icons';

import Login from '../../screens/Login';
import ChooseUserType from '../../screens/ChooseUserType';
import Register from '../../screens/Register';
import Home from '../../screens/home';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { ParamListBase, RouteProp } from '@react-navigation/native';

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
						<TouchableOpacity className="w-12 h-12 bg-gray-500 mr-6 rounded-full overflow-hidden">
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
