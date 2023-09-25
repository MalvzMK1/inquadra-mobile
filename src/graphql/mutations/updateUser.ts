import { gql } from "@apollo/client";

export interface IUpdateUserResponse {
  updateUsersPermissionsUser: {
    data: {
      attributes: {
        username: User['username']
        email: User['email']
        phoneNumber: User['phoneNumber']
        cpf: User['cpf']
        photo: {
          data: {
            id: Photo['id']
          }
        }
        role: {
          data: {
            id: Role['id']
            attributes: Omit<Role, 'id'>
          }
        }
      }
    }
  }
}

export interface IUpdateUserVariables {
  username: string
  email: string
  phone_number: string
  cpf: string
  user_id: string
  photo?: string
}

export const updateUserMutation = gql`
mutation updateUser(
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
        photo: $photo
        username: $username
        email: $email
        phoneNumber: $phone_number
        cpf: $cpf
      }
    ) {
      data {
        id
        attributes {
          username
          email
          phoneNumber
          cpf
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
`