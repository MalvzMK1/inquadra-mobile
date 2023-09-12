import { PaperProvider } from 'react-native-paper';
import { ApolloProvider } from '@apollo/client';
import Routes from './src/routes';
import { client } from './src/lib/apolloClient';
import { useEffect } from "react";
import * as Location from "expo-location";
import storage from "./src/utils/storage";

export default function App() {
	useEffect(() => {
		async function getUserGeolocation(): Promise<void> {
			const { status } = await Location.requestForegroundPermissionsAsync();
			if (status === 'granted') {
				const {coords} = await Location.getCurrentPositionAsync();
				storage.save({
					key: 'userGeolocation',
					data: {
						latitude: coords.latitude,
						longitude: coords.longitude
					}
				})
			}
		}

		getUserGeolocation()
	}, [])

	return (
		<ApolloProvider client={client}>
			<PaperProvider>
				{/*<ComponentProvider>*/}
					<Routes />
				{/*</ComponentProvider>*/}
			</PaperProvider>
		</ApolloProvider>
	);
}
