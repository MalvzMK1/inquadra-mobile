import { ApolloClient, InMemoryCache } from "@apollo/client";

export const client = new ApolloClient({
	uri: 'http://192.168.0.10:1337' + '/graphql',
	// uri: process.env.HOST_API + '/graphql',
	cache: new InMemoryCache(),
});
