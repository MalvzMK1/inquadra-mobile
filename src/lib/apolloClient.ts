import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache,
} from "@apollo/client";
import { HOST_API } from "@env";
import storage from "../utils/storage";

const httpLink = new HttpLink({
  uri: HOST_API + "/graphql",
});

let jwt: string = "";

storage
  .load<UserInfos>({
    key: "userInfos",
  })
  .then(data => {
    jwt = data.token;
  })
  .catch(error => {
    if (error instanceof Error) {
      if (error.name === "NotFoundError") {
        console.log("The item wasn't found.");
      } else if (error.name === "ExpiredError") {
        console.log("The item has expired.");
        storage
          .remove({
            key: "userInfos",
          })
          .then(() => {
            console.log("The item has been removed.");
          });
      } else {
        console.log("Unknown error:", error);
      }
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
      Authorization: "bearer " + token,
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
    },
  }),
});
