import { gql } from "@apollo/client";

export interface IDeleteUserResponse {
  deleteUsersPermissionsUser: {
    data: {
      attributes: {
        name: User["name"];
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
          name
          email
          phoneNumber
        }
      }
    }
  }
`;
