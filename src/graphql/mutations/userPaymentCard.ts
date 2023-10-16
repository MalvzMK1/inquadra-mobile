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
    cep: string
    state:string
    city:string
    number:string
    complement:string | null | undefined
    street: string
    neighborhood: string
    paymentId: string
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
  $cep: String
  $state: String
  $city: String
  $number: String
  $complement: String
  $street: String
  $neighborhood: String
  $paymentId: String
) {
  createUserPayment(
    data: {
      value: $value
      scheduling: $schedulingId
      users_permissions_user: $userId
      name: $name
      cpf: $cpf
      paymentId: $paymentId
      card: {
        cvv: $cvv
        dueDate: $date
        country: $countryID
        cep: $cep
        state: $state
        city: $city
        number: $number
        complement: $complement
        street: $street
        neighborhood: $neighborhood
      }
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