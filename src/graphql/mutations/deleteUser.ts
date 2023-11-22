import { gql } from "@apollo/client";

export interface IDeleteUserResponse {
  deleteUsersPermissionsUser: {
    data: {
      attributes: {
        username: User["username"];
        email: User["email"];
        phoneNumber: User["phoneNumber"];
      };
    };
  };
}

export interface IDeleteUserVariables {
  user_id: string;
}

export const deleteUserMutation = gql`
  mutation deleteUser($user_id: ID!) {
    deleteUsersPermissionsUser(id: $user_id) {
      data {
        attributes {
          username
          email
          phoneNumber
        }
      }
    }
  }
`;
