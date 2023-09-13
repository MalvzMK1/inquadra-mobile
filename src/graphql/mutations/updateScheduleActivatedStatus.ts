import { gql } from "@apollo/client"

export interface IUpdateScheduleActivatedStatusResponse{
    updateScheduling: {
        data: {
            attributes: {
                activated: boolean
            }
        }
    }
}

export interface IUpdateScheduleActivatedStatusVariables{
    schedulingId: string
    activate: boolean
}

export const updateScheduleActivatedStatusMutation = gql`
mutation updateActivateSchedule($schedulingId: ID!, $activate: Boolean) {
  updateScheduling(id: $schedulingId, data: { activated: $activate }) {
    data {
      attributes {
        activated
      }
    }
  }
}
`