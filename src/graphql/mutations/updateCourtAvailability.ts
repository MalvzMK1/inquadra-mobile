import {gql} from "@apollo/client";

export interface IUpdateCourtAvailabilityResponse{
    updateCourtAvailability: {
        data: {
            id: CourtAvailability['id']
            attributes: {
                startsAt: CourtAvailability['startsAt']
                endsAt: CourtAvailability['endsAt']
                weekDay: CourtAvailability['weekDay']
            }
        } 
    }
}

export interface IUpdateCourtAvailabilityVariables{
    id: number
    title: string
    week_day: string
    value: number
    starts_at: string
    ends_at: string
    day_use_service: boolean
    court: number
    status: boolean 
}

export const updateCourtAvailabilityMutation = gql`
mutation updateCourtAvailability(
  $id: ID!
  $title: String
  $week_day: ENUM_COURTAVAILABILITY_WEEKDAY
  $value: Float
  $starts_at: Time
  $ends_at: Time
  $day_use_service: Boolean
  $court: ID
  $status: Boolean
) {
  updateCourtAvailability(
    id: $id
    data: {
      title: $title
      weekDay: $week_day
      value: $value
      startsAt: $starts_at
      endsAt: $ends_at
      dayUseService: $day_use_service
      court: $court
      status: $status
    }
  ) {
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