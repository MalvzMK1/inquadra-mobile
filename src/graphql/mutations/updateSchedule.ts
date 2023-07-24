import {gql} from "@apollo/client";

export interface IUpdateScheduleResponse{
    updateScheduling: {
        data: {
            id: Scheduling['id']
            attributes: {
                date: Scheduling['date']
            }
        }
    }
}

export interface IUpdateSchedulingVariables{
    scheduling_id: number
    title: string
    court_availability: number
    users: Array<number>
    owner: number
    date: string
    pay_day: string
    value_payed: number
}

export const updateSchedulingMutation = gql`
mutation updateSchedule(
  $title: String
  $court_availability: ID
  $users: [ID]
  $owner: ID
  $date: Date
  $pay_day: Date
  $value_payed: Float
  $scheduling_id: ID!
  $payed_status: Boolean
) {
  updateScheduling(
    id: $scheduling_id
    data: {
      schedulingTitle: $title
      court_availability: $court_availability
      users: $users
      owner: $owner
      date: $date
      payDay: $pay_day
      valuePayed: $value_payed
      payedStatus: $payed_status
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