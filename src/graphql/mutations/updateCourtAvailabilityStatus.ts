import {gql} from "@apollo/client";

export interface IUpdateCourtAvailabilityStatusResponse{
    updateCourtAvailability: {
        data:{
            id: CourtAvailability['id']
            attributes: {
                startsAt: CourtAvailability['startsAt']
                endsAt: CourtAvailability['endsAt']
                weekDay: CourtAvailability['weekDay']
            }
        }
    }
}

export interface IUpdateCourtAvailabilityStatusVariables{
    id: string
    status: boolean
}

export const updateCourtAvailabilityStatusMutation = gql`
mutation updateCourtAvailabilityStatus($id: ID!, $status: Boolean) {
  updateCourtAvailability(id: $id, data: { status: $status }) {
    data {
      id
      attributes {
        startsAt
        endsAt
        weekDay
      }
    }
  }
}
`