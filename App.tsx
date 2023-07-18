import { PaperProvider } from 'react-native-paper';
import Routes from './src/routes';
import { ApolloProvider } from "@apollo/client";
import { client } from "./src/lib/apolloClient";

export default function App() {
	return (
		<ApolloProvider client={client}>
			<PaperProvider>
				<Routes />
			</PaperProvider>
		</ApolloProvider>
	);
}
