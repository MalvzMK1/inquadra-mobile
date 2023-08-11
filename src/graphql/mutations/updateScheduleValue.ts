import {gql} from "@apollo/client";

export interface IUpdateScheduleValueResponse{
    updateScheduling: {
        data: {
            id: Scheduling['id']
            attributes: {
                date: Scheduling['date']
            }
        }
    }
}

export interface IUpdateScheduleValueVariables{
    scheduling_id: number
    value_payed: number
    payed_status: boolean
}

export const updateScheduleValueMutation = gql`
mutation updateScheduleValue(
  $value_payed: Float
  $scheduling_id: ID!
  $payed_status: Boolean
) {
  updateScheduling(
    id: $scheduling_id
    data: { valuePayed: $value_payed, payedStatus: $payed_status }
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