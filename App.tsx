import { PaperProvider } from 'react-native-paper';
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import Routes from './src/routes';

const client = new ApolloClient({
	uri: 'http://localhost:1337/graphql',
	cache: new InMemoryCache(),
});

export default function App() {
	return (
		<ApolloProvider client={client}>
			<PaperProvider>
				<Routes />
			</PaperProvider>
		</ApolloProvider>
	);
}
