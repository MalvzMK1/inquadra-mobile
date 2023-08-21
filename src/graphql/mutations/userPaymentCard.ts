import {gql} from "@apollo/client";
import { Float } from "react-native/Libraries/Types/CodegenTypes";

export interface IUserPaymentCardResponse{
    createUserPayment: {
        data: {
            attributes:  {
                value: number
                createdAt: Date
                user_permissions_user: {
                    data: {
                        attributes: {
                            username: string
                        }
                    }
                }
            }
        }
    }
}

export interface IUserPaymentCardVariables{
    value: number
    schedulingId: string
    userId: string
    name: string
    cpf: string
    cvv: number
    date: string
    countryID: string
    publishedAt: string
}

export const userPaymentCardMutation = gql`
mutation newUserPayment(
  $value: Float
  $schedulingId: ID
  $userId: ID
  $name: String
  $cpf: String
  $cvv: Int
  $date: Date
  $countryID: ID
  $publishedAt: DateTime
) {
  createUserPayment(
    data: {
      value: $value
      scheduling: $schedulingId
      users_permissions_user: $userId
      name: $name
      cpf: $cpf
      card: { cvv: $cvv, dueDate: $date, country: $countryID }
      publishedAt: $publishedAt
    }
  ) {
    data {
      attributes {
        value
        createdAt
        users_permissions_user {
          data {
            attributes {
              username
            }
          }
        }
      }
    }
  }
}

`