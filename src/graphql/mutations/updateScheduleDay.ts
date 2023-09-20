import { gql } from "@apollo/client"

export interface IUpdateScheduleDayResponse {
  updateScheduling: {
    data: {
      id: Scheduling['id']
      attributes: {
        date: Scheduling['date']
      }
    }
  }
}

export interface IUpdateScheduleDayVariables {
  scheduleID: string
  availabilityID: string
  newDate: string
  newValue: number
  payedStatus: string
  activationKey: string | null
}

export const UpdateScheduleDayMutation = gql`
mutation updateSchedule(
  $scheduleID: ID!
  $availabilityID: ID
  $newDate: Date
  $newValue: Float
  $payedStatus: ENUM_SCHEDULING_PAYEDSTATUS
  $activationKey: String
) {
  updateScheduling(
    id: $scheduleID
    data: {
      court_availability: $availabilityID
      date: $newDate
      payedStatus: $payedStatus
      valuePayed: $newValue
      activationKey: $activationKey
    }
  ) {
    data {
      id
      attributes {
        date
      }
    }
  }
}
`