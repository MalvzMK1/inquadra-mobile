import {gql} from "@apollo/client";

export interface IUpdateUserResponse{
    updateUsersPermissionsUser:{
        data: {
            attributes: {
                username: User['username']
				email: User['email']
				phoneNumber: User['phoneNumber']
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
    user_id: number
    username: string
    email: string
    phone_number: string
    cpf: string
    password: string
    role: string
    card_cvv: number
    card_due_date: Date
}

export const updateUserMutation = gql`
    mutation updateUser(
  $username: String!
  $email: String!
  $phone_number: String!
  $cpf: String!
  $password: String!
  $role: ID!
  $user_id: ID!
  $card_cvv: Int
  $card_due_date: Date
) {
  updateUsersPermissionsUser(
    id: $user_id
    data: {
      username: $username
      email: $email
      phoneNumber: $phone_number
      cpf: $cpf
      password: $password
      role: $role
      paymentCardInformations: { cvv: $card_cvv, dueDate: $card_due_date }
    }
  ) {
    data {
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
`