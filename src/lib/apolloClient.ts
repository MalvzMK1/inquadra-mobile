import { ApolloClient, InMemoryCache } from "@apollo/client";
import { HOST_API } from '@env'

console.log(HOST_API)

export const client = new ApolloClient({
	 uri: "https://ec0a-2804-14d-3280-54ef-c56e-ba88-e706-a5f0.ngrok-free.app" + "/graphql",
	// uri: HOST_API + "/graphql",
	cache: new InMemoryCache(),
});

