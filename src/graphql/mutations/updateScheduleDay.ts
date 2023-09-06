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
}

export const UpdateScheduleDayMutation = gql`
mutation updateSchedule($scheduleID: ID!, $availabilityID: ID, $newDate: Date) {
  updateScheduling(
    id: $scheduleID
    data: { court_availability: $availabilityID, date: $newDate }
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