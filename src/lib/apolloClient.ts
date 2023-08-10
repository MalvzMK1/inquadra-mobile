import {ApolloClient, ApolloLink, HttpLink, InMemoryCache} from "@apollo/client";
import { HOST_API } from '@env';

const link = new HttpLink({
	uri: HOST_API + '/graphql',
})

const authLink = new ApolloLink((operation, forward) => {
	const token = '' // TODO: pegar o token -> STORAGE
	operation.setContext({
		headers: {
			Authorization: 'bearer ' + token
		}
	})
	return forward(operation)
})

export const client = new ApolloClient({
	link: authLink.concat(link),
	cache: new InMemoryCache(),
});
