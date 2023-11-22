import { gql } from "@apollo/client";

export interface UserByUsernameResponse {
  usersPermissionsUsers: {
    data: Array<{
      id: User["id"];
    }>;
  };
}

export interface UserByUsernameVariables {
  username: string;
}

export const userByUsernameQuery = gql`
  query UserByUsername($username: String!) {
    usersPermissionsUsers(filters: { username: { eq: $username } }) {
      data {
        id
      }
    }
  }
`;
