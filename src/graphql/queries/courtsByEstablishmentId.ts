import { gql } from "@apollo/client";

export interface ICourtsByEstablishmentIdResponse {
    establishment: {
        data: {
            id: Establishment['id']
            attributes: {
                courts: {
                    data: Array<{
                        id: Court['id']
                        attributes: {
                            name: CourtAdd['court_name']
                        }
                    }>
                }
            }
        }
    }
}

export interface ICourtsByEstablishmentIdVariable {
    establishment_id: string
}

export const courtsByEstablishmentIdQuery = gql`
    query courtsByEstablishmentId ($establishment_id: ID) {
	establishment(id: $establishment_id) {
    data {
      id
      attributes {
        courts {
          data {
            id 
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