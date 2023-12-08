import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache,
} from "@apollo/client";
import { API_BASE_URL } from "../utils/constants";
import AsyncStorage from "@react-native-async-storage/async-storage";

const httpLink = new HttpLink({
  uri: API_BASE_URL + "/graphql",
});

let jwt: string = "";

AsyncStorage.getItem(
  '@inquadra/user_data'
).then(response => {
  try {
    if (response) {
      const data = JSON.parse(response);

      jwt = data.jwt;
    } throw new Error('Response came null')
  } catch (error) {
    console.error('couldn\'t parse to json')
  }
});

const authLink = new ApolloLink((operation, forward) => {
  const token = jwt;
  const requiresAuth = operation.operationName === "userLogin";

  if (!requiresAuth) {
    return forward(operation);
  }

  operation.setContext({
    headers: {
      Authorization: "Bearer " + token,
    },
  });

  return forward(operation);
});

const link = ApolloLink.from([authLink, httpLink]);

export const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache({
    typePolicies: {
      UsersPermissionsUserResponse: {
        keyFields: [],
        merge: (existing, incoming) => incoming,
      },
      EstablishmentEntityResponse: {
        keyFields: [],
        merge: (existing, incoming) => incoming,
      },
      UsersPermissionsUserEntityResponseCollection: {
        keyFields: [],
        merge: (existing, incoming) => incoming,
      },
      EstablishmentEntity: {
        merge: true,
      },
    },
  }),
});
