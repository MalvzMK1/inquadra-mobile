import { gql } from "@apollo/client";

export interface IUpdateUserPaymentPixResponse {
    updateUserPaymentPix: {
        data: {
            attributes: {
                PayedStatus: boolean
            }
        }
    }
}

export interface IUpdateUserPaymentPixVariables {
    userPaymentPixID: string
    scheduleID: string
}

export const updateUserPaymentPixMutation = gql`
mutation updatePaymentPix($userPaymentPixID: ID!, $scheduleID: ID!) {
  updateUserPaymentPix(id: $userPaymentPixID, data: { PayedStatus: Payed, scheduling: $scheduleID }) {
    data {
      id
      attributes {
        PayedStatus
      }
    }
  }
}
`