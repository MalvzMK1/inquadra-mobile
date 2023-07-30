import { ApolloClient, InMemoryCache } from "@apollo/client";

export const client = new ApolloClient({
	uri: 'https://7676-2804-14d-3287-4878-7114-d7c8-849f-34d4.ngrok-free.app/graphql',
	cache: new InMemoryCache(),
});
