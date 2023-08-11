import { ApolloClient, InMemoryCache } from "@apollo/client";
import { HOST_API } from '@env'

export const client = new ApolloClient({
	//  uri: "https://6233-2804-14d-3280-54ef-f005-4db5-b9db-b360.ngrok-free.app" + "/graphql",
	uri: HOST_API + "/graphql",
	cache: new InMemoryCache(),
});

