import { gql } from "@apollo/client";

export interface MeQueryResponse {
  me: User;
}

export const meQuery = gql`
  query Me {
    me {
      id
      name
      username
      email
      role {
        name
      }
    }
  }
`;
