import {gql} from "@apollo/client";

export interface IDeleteCourtAvailabilityResponse{
    deleteCourtAvailability: {
        data: {
            id: CourtAvailability['id']
            attributes: Omit<CourtAvailability, 'id'>
        }
    }
}

export interface IDeleteCourtAvailabilityVariables{
    court_availability_id: number | string
}

export const deleteCourtAvailabilityMutation = gql`
mutation deleteCourtAvailability($court_availability_id: ID!) {
  deleteCourtAvailability(id: $court_availability_id) {
    data {
      id
      attributes {
        status
        startsAt
        endsAt
        weekDay
      }
    }
  }
}
`