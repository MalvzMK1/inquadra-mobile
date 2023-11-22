import { gql } from "@apollo/client";

export interface IUserByEmailResponse {
  usersPermissionsUsers: {
    data: Array<{
      id: User["id"];
      attributes: {
        username: User["username"];
        email: User["email"];
      };
    }>;
  };
}

export interface IUserByEmailVariables {
  email: string;
}

export const userByEmailQuery = gql`
  query getUserByEmail($email: String!) {
    usersPermissionsUsers(filters: { email: { eq: $email } }) {
      data {
        id
        attributes {
          username
          email
        }
      }
    }
  }
`;
