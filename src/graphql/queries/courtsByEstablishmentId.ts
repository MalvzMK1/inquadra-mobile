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
                            court_availabilities: {
                                data: Array<{
                                    id: CourtAvailability['id']
                                    attributes: {
                                        startsAt: CourtAvailability['startsAt']
                                        endsAt: CourtAvailability['endsAt']
                                        status: CourtAvailability['status']
                                        value: CourtAvailability['value']
                                        weekDay: CourtAvailability['weekDay']
                                      }
                                }>
                            }
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
              court_availabilities {
                data {
                  id
                  attributes {
                    startsAt
                    endsAt
                    status
                    value
                    weekDay
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