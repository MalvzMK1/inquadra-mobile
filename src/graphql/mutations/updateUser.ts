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
  user_id: string
  username: string
  email: string
  phoneNumber: string
  cpf: string
  photo: string
}

export const updateUserMutation = gql`
    mutation updateUser(
  $user_id: ID!
  $username: String!
  $email: String!
  $phoneNumber: String!
  $cpf: String!
  $photo: ID!
) {
  updateUsersPermissionsUser(
    id: $user_id
    data: {
      username: $username
      email: $email
      phoneNumber: $phoneNumber
      cpf: $cpf
      photo: $photo
    }
  ) {
    data {
      id
      attributes {
        username
        email
        phoneNumber
        cpf
        photo {
          data {
            id
          }
        }
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
}`