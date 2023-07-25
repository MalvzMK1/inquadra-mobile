import { ApolloClient, InMemoryCache } from "@apollo/client";

export const client = new ApolloClient({
	uri: 'https://cbe4-2804-14d-3280-54ef-c5c1-2854-52b4-8b01.ngrok-free.app' + '/graphql',
	// uri: process.env.HOST_API + '/graphql',
	cache: new InMemoryCache(),
});
