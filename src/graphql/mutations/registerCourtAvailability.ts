import {gql} from "@apollo/client";

export interface IRegisterCourtAvailabilityResponse{
    createCourtAvailability: {
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

export interface IRegisterCourtAvailabilityVariables{
    title: string
    week_day: string
    value: number
    starts_at: string
    ends_at: string
    day_use_service: boolean
    court: number
    status: boolean 
}

export const registerCourtAvailabilityMutation = gql`
mutation newCourtAvailability(
  $title: String
  $week_day: ENUM_COURTAVAILABILITY_WEEKDAY
  $value: Float
  $starts_at: Time 
  $ends_at: Time
  $day_use_service: Boolean
  $court: ID
  $status: Boolean
) {
  createCourtAvailability(
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
      attributes{
        startsAt
        endsAt
        weekDay
      }
    }
  }
}
`