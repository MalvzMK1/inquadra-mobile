import { gql } from "@apollo/client";

export interface IDeleteUserPaymentPixResponse {
    deleteUserPaymentPix: {
        data: {
            id: string
            attributes: {
                value: number
            }
        }
    }
}

export interface IDeletePaymentPixVariables {
    id: string
}

export const deletePaymentPix = gql`
mutation deletePaymentPix($id: ID!) {
  deleteUserPaymentPix(id: $id) {
    data {
      id
      attributes {
        value
      }
    }
  }
}
`