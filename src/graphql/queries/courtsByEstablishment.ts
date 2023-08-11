import { gql } from "@apollo/client";

export interface ICourtsByEstablishmentResponse{
  establishment: {
        data: {
            id: Establishment['id']
            attributes: {
                courts: {
                    data: Array<{
                        id: Court['id']
                        attributes: {
                            name: Court['name']
                            fantasy_name: Court['fantasy_name']
                        }
                    }>
                }
            }
        }
    }
}

export interface ICourtByEstablishmentVariable{
    establishmentId: string
}

export const courtByEstablishmentQuery = gql`
query getCourtsByEstablishment($establishmentId: ID) {
  establishment(id: $establishmentId) {
    data {
      id
      attributes {
        courts {
          data {
            id
            attributes {
              name
              fantasy_name
            }
          }
        }
      }
    }
  }
}
`