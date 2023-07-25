import { ApolloClient, InMemoryCache } from "@apollo/client";

export const client = new ApolloClient({
	uri: '192.168.0.11/graphql',
	cache: new InMemoryCache(),
});
