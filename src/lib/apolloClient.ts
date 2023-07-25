import { ApolloClient, InMemoryCache } from "@apollo/client";

export const client = new ApolloClient({
	uri: 'https://77a3-2804-14d-3280-54ef-ec98-740d-a7f7-e026.ngrok-free.app/graphql',
	cache: new InMemoryCache(),
});
