import { gql } from "@apollo/client";

export interface IRegisterUserResponse {
  createUsersPermissionsUser: {
    data: {
      id: string;
      attributes: {
        name: User["name"];
        email: User["email"];
        username: User["username"];
        phoneNumber: User["phoneNumber"];
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

export interface IRegisterUserVariables {
  name: string;
  username: string;
  email: string;
  phone_number: string;
  cpf: string;
  password: string;
  role: string;
}

export const registerUserMutation = gql`
  mutation newUser(
    $name: String!
    $username: String
    $email: String
    $phone_number: String
    $cpf: String
    $password: String
    $role: ID
  ) {
    createUsersPermissionsUser(
      data: {
        name: $name
        username: $username
        email: $email
        phoneNumber: $phone_number
        cpf: $cpf
        password: $password
        role: $role
      }
    ) {
      data {
        id
        attributes {
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
