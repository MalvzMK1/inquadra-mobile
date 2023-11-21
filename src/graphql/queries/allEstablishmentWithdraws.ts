import { gql } from "@apollo/client";

export interface IGetEstablishmentWithdrawsResponse {
    establishment: {
        data: {
            id: Establishment['id']
            attributes: {
                establishment_withdraws: {
                    data: Array<{
                        id: number
                        attributes: {
                            value: number
                            createdAt: string
                            updatedAt: string
                            payedStatus: string
                            pix_key: {
                                data: {
                                    id: string
                                }
                            }
                        }
                    }>
                }
            }
        }
    }
}

export interface IGetEstablishmentWithdrawsVariable {
    establishmentID: string
}

export const GetEstablishmentWithdrawsQuery = gql`
query getEstablishmentWithdraws($establishmentID: ID!) {
  establishment(id: $establishmentID) {
    data {
      id
      attributes {
        establishment_withdraws {
          data {
            id
            attributes {
              value
              payedStatus
              createdAt
              updatedAt
              pix_key {
                data {
                  id
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