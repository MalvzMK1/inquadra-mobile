import { gql } from "@apollo/client";

export interface IUpdateUserResponse {
  updateUsersPermissionsUser: {
    data: {
      attributes: {
        cpf: User["cpf"];
        name: User["name"];
        email: User["email"];
        username: User["username"];
        phoneNumber: User["phoneNumber"];
        photo: {
          data: {
            id: Photo["id"];
          };
        };
        role: {
          data: {
            id: Role["id"];
            attributes: Omit<Role, "id">;
          };
        };
      };
    };
  };
}

export interface IUpdateUserVariables {
  name: string;
  username: string;
  email: string;
  phone_number: string;
  cpf: string;
  user_id: string;
  photo?: string;
}

export const updateUserMutation = gql`
  mutation updateUser(
    $name: String!
    $username: String!
    $email: String!
    $phone_number: String!
    $cpf: String!
    $user_id: ID!
    $photo: ID!
  ) {
    updateUsersPermissionsUser(
      id: $user_id
      data: {
        name: $name
        username: $username
        email: $email
        phoneNumber: $phone_number
        cpf: $cpf
        photo: $photo
      }
    ) {
      data {
        id
        attributes {
          cpf
          name
          email
          username
          phoneNumber
          role {
            data {
              attributes {
                name
              }
            }
          }
        }
      }
    }
  }
`;
