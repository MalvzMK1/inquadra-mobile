import { gql } from "@apollo/client";

export interface IUserPaymentPixResponse {
  createUserPaymentPix: {
    data: {
      id: string,
      attributes: {
        paymentID: string
      }
    }
  }
}

export interface IUserPaymentPixVariables {
  name: string
  value: number
  schedulingID: string | null
  userID: string
  cpf: string
  paymentID: string
  publishedAt: string
}

export const userPaymentPixMutation = gql`
mutation createPaymentPix(
  $name: String
  $value: Float
  $schedulingID: ID
  $userID: ID!
  $cpf: String
  $paymentID: String
  $publishedAt: DateTime
) {
  createUserPaymentPix(
    data: {
      name: $name
      value: $value
      scheduling: $schedulingID
      users_permissions_user: $userID
      cpf: $cpf
      paymentId: $paymentID
      PayedStatus: Waiting
      publishedAt: $publishedAt
    }
  ) {
    data {
      id
      attributes {
        paymentId
      }
    }
  }
}

`