import { PaperProvider } from 'react-native-paper';
import { ApolloProvider } from '@apollo/client';
import Routes from './src/routes';
import { client } from './src/lib/apolloClient';

export default function App() {
	return (
		<ApolloProvider client={client}>
			<PaperProvider>
				<Routes />
			</PaperProvider>
		</ApolloProvider>
	);
}
