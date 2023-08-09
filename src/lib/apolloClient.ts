import { ApolloClient, InMemoryCache } from "@apollo/client";
import { HOST_API } from '@env'

export const client = new ApolloClient({
	// uri: "http://192.168.15.5:1337/" + "graphql",
	uri: HOST_API + "/graphql",
	cache: new InMemoryCache(),
});
