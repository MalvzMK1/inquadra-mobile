import { ApolloClient, ApolloLink, HttpLink, InMemoryCache } from "@apollo/client";
import { HOST_API } from '@env';
import storage from "../utils/storage";

const httpLink = new HttpLink({
	uri: "http://192.168.0.229:1337" + "/graphql"
	
});

let jwt: string = "";

storage.load<UserInfos>({
	key: 'userInfos',
}).then((data) => {
	jwt = data.token;
});

const authLink = new ApolloLink((operation, forward) => {
	const token = jwt;
	const requiresAuth = operation.operationName === "userLogin";

	if (!requiresAuth) {
		return forward(operation);
	}

	operation.setContext({
		headers: {
			Authorization: 'bearer ' + token
		}
	});
	return forward(operation);
});

const link = ApolloLink.from([authLink, httpLink]);

export const client = new ApolloClient({
	// link: authLink.concat(link),
	link: httpLink,
	cache: new InMemoryCache(),
});