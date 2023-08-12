import {ApolloClient, ApolloLink, HttpLink, InMemoryCache} from "@apollo/client";
import {HOST_API} from '@env';
import storage from "../utils/storage";

const link = new HttpLink({
	uri: HOST_API + "/graphql"
})

let jwt: string = ""

storage.load<UserInfos>({
	key: 'userInfos',
}).then((data) => {
	jwt = data.token
})

const authLink = new ApolloLink((operation, forward) => {
	const token = jwt // TODO: pegar o token -> STORAGE
	operation.setContext({
		headers: {
			Authorization: 'bearer ' + token
		}
	})
	return forward(operation)
})

export const client = new ApolloClient({
	link: authLink.concat(link),
	cache: new InMemoryCache(),
});

