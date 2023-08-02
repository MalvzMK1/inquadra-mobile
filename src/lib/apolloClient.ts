import { ApolloClient, InMemoryCache } from "@apollo/client";
import {HOST_API} from '@env'

export const client = new ApolloClient({
	uri: HOST_API + '/graphql',
	cache: new InMemoryCache(),
});
