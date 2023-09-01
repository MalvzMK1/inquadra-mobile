import {gql} from "@apollo/client";

export interface IAllPaymentsSchedulingResponse{
    scheduling: {
        data: {
            attributes: {
                user_payments: {
                    data: Array<{
                        attributes:{
                            value: user_payment['value']
                            createdAt: user_payment['createdAt']
                            users_permissions_user: {
                                data:{
                                    attributes:{
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

export interface IAllPaymentsSchedulingVariable{
    id: string
}

export const AllPaymentsSchedulingQuery = gql`
query historicOfPayments($id: ID) {
  scheduling(id: $id) {
    data {
      attributes {
        user_payments {
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