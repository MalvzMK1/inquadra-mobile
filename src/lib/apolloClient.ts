import { ApolloClient, InMemoryCache } from "@apollo/client";

export const client = new ApolloClient({
	uri: process.env.HOST_API + '/graphql',
	cache: new InMemoryCache(),
});
