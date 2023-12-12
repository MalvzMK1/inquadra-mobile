import { gql } from "@apollo/client";

export interface IUserByEmailResponse {
  usersPermissionsUsers: {
    data: Array<{
      id: User["id"];
      attributes: {
        name: User["name"];
        email: User["email"];
        username: User["username"];
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
          name
          email
          username
        }
      }
    }
  }
`;
