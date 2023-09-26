import { gql } from "@apollo/client";

export interface IUpdateScheduleValueResponse {
  updateScheduling: {
    data: {
      id: Scheduling['id']
      attributes: {
        date: Scheduling['date']
      }
    }
  }
}

export interface IUpdateScheduleValueVariables {
  scheduling_id: number
  value_payed: number
  payed_status: string
  activation_key: string | null
  activated: boolean
}

export const updateScheduleValueMutation = gql`
mutation updateScheduleValue(
  $value_payed: Float
  $scheduling_id: ID!
  $payed_status: ENUM_SCHEDULING_PAYEDSTATUS
  $activation_key: String
  $activated: Boolean
) {
  updateScheduling(
    id: $scheduling_id
    data: {
      valuePayed: $value_payed
      payedStatus: $payed_status
      activationKey: $activation_key
      activated: $activated
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