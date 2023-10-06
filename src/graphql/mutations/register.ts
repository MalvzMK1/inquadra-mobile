import { gql } from "@apollo/client";

export interface IRegisterUserResponse {
  createUsersPermissionsUser: {
    data: {
      id: string;
      attributes: {
        username: User["username"];
        email: User["email"];
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
  username: string;
  email: string;
  phone_number: string;
  cpf: string;
  password: string;
  role: string;
}

export const registerUserMutation = gql`
  mutation newUser(
    $username: String
    $email: String
    $phone_number: String
    $cpf: String
    $password: String
    $role: ID
  ) {
    createUsersPermissionsUser(
      data: {
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
          username
          email
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
