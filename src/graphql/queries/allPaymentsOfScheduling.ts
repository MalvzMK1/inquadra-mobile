import { gql } from "@apollo/client";

export interface IAllPaymentsSchedulingResponse {
  scheduling: {
    data: {
      attributes: {
        user_payment_pixes: {
          data: Array<{
            attributes: {
              value: number
              createdAt: string
              users_permissions_user: {
                data: {
                  attributes: {
                    username: string
                  }
                }
              }
            }
          }>
        }
        user_payments: {
          data: Array<{
            attributes: {
              value: user_payment['value']
              createdAt: user_payment['createdAt']
              users_permissions_user: {
                data: {
                  attributes: {
                    username: user_payment['username']
                  }
                }
              }
            }
          }>
        }
      }
    }
  }
}

export interface IAllPaymentsSchedulingVariable {
  id: string
}

export const AllPaymentsSchedulingQuery = gql`
query historicOfPayments($id: ID) {
  scheduling(id: $id) {
    data {
      attributes {
        user_payment_pixes(filters: { PayedStatus: { eq: "Payed" } }) {
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
        user_payments(filters: { payedStatus: { eq: "Payed" } }) {
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
    }
  }
}
`