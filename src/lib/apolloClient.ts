import { ApolloClient, InMemoryCache } from "@apollo/client";

export const client = new ApolloClient({
	uri: 'https://eedb-2804-14d-3287-4878-d89e-e0a3-81e-8228.ngrok-free.app/graphql',
	cache: new InMemoryCache(),
});
