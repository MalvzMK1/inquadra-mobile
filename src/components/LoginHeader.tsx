import { Image } from 'react-native';
import Login from '../screens/Login';

import { createStackNavigator } from '@react-navigation/stack';
const Stack = createStackNavigator();

export function TestHeader() {
	return (
		<Stack.Navigator>
			<Stack.Screen
				name="InQuadra"
				component={Login}
				options={{
					headerTitle: () => (
						<Image source={require('../assets/inquadra_logo.png')} />
					),
					headerTitleAlign: 'center',
					headerStyle: {
						height: 200,
						backgroundColor: '#292929',
					},
				}}
			/>
		</Stack.Navigator>
	);
}

// export function LoginHeader() {
// 	return (
// 		<View
// 			className={'h-[250px] bg-gray-800 flex items-center justify-center px-4'}
// 		>
// 			<View className={'h-24 w-full bg-orange-300'} />
// 		</View>
// 	);
// }
