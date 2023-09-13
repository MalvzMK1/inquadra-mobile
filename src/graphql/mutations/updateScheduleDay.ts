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
  payedStatus: boolean
  activationKey: string | null
}

export const UpdateScheduleDayMutation = gql`
mutation updateSchedule(
  $scheduleID: ID!
  $availabilityID: ID
  $newDate: Date
  $newValue: Float
  $payedStatus: Boolean
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