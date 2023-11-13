import {LinkingOptions, NavigationContainer} from '@react-navigation/native';
import Stack from './stack';

const linking: LinkingOptions<RootStackParamList> = {
	prefixes: ['com.qodeless.inquadra://'],
	config: {
		screens: {
			Login: 'login',
			Home: {
				path: 'home/:userID',
				parse: {
					userID: (userID: string) => userID,
				},
			},
			EstablishmentInfo: {
				path: 'establishment/:establishmentId',
				parse: {
					establishmentId: (establishmentId: string) => establishmentId,
				},
			},
			// Adicione outras telas conforme necessário
		},
	},
};

export default function () {
	return (
		<NavigationContainer linking={linking}>
			<Stack />
		</NavigationContainer>
	);
}
