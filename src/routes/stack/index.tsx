import { createStackNavigator } from '@react-navigation/stack';
import { Image } from 'react-native';

import Login from '../../screens/Login';
import ChooseUserType from '../../screens/ChooseUserType';

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
		</Navigator>
	);
}
