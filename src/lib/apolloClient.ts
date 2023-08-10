import { ApolloClient, InMemoryCache } from "@apollo/client";
import { HOST_API } from '@env'

console.log(HOST_API)

export const client = new ApolloClient({
	 uri: "https://972a-2804-14d-3287-4878-b07b-7b67-d85e-e92c.ngrok-free.app" + "/graphql",
	// uri: HOST_API + "/graphql",
	cache: new InMemoryCache(),
});

// ttps://2248-2804-14d-3280-54ef-c56e-ba88-e706-a5f0.ngrok-free.app"