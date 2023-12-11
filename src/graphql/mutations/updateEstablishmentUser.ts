import { gql } from "@apollo/client";

export interface IUpdateEstablishmentUserResponse {
  userPermissionsUser: {
    data?: {
      id: User["id"];
      attributes: {
        cpf: string;
        email: string;
        username: string;
        phoneNumber: string;
        role: {
          data: {
            attributes: {
              name: string;
            };
          };
        };
      };
    };
  };
}

export interface IUpdateEstablishmentUserVariables {
  name: string;
  username: string;
  email: string;
  phone_number: string;
  cpf: string;
  user_id: string | number;
}

export const updateEstablishmentUserMutation = gql`
  mutation updateUser(
    $name: String!
    $username: String!
    $email: String!
    $phone_number: String!
    $cpf: String!
    $user_id: ID!
  ) {
    updateUsersPermissionsUser(
      id: $user_id
      data: {
        name: $name
        username: $username
        email: $email
        phoneNumber: $phone_number
        cpf: $cpf
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
