import {gql} from "@apollo/client";

export interface IUpdateUserResponse{
  updateUsersPermissionsUser:{
    data: {
      attributes: {
        username: User['username']
        email: User['email']
        phoneNumber: User['phoneNumber']
        cpf: User['cpf']
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

export interface IUpdateUserVariables{
    user_id: string
    username: string
    email: string
    phone_number: string
    cpf: string
}

export const updateUserMutation = gql`
    mutation updateUser(
  $username: String!
  $email: String!
  $phone_number: String!
  $cpf: String!
  $user_id: ID!
) {
  updateUsersPermissionsUser(
    id: $user_id
    data: {
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