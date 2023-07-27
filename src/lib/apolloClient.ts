import { ApolloClient, InMemoryCache } from "@apollo/client";

export const client = new ApolloClient({
	uri: 'http://192.168.15.5:1337' + '/graphql',
	// uri: process.env.HOST_API + '/graphql',
	cache: new InMemoryCache(),
});
