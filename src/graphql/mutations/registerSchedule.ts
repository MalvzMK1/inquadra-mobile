import {gql} from "@apollo/client";

export interface IRegisterScheduleResponse{
    createScheduling: {
      data: {
        id: Schedule['id']
        attributes: {
            date: Schedule['date']
        }
      }
    }
}

export interface IRegisterScheduleVariables{
    title: string
    court_availability: string
    users: Array<string>
    owner: string
    date: string
    pay_day: string
    value_payed: number
    activation_key: string | null
    publishedAt: string
}

export const registerScheduleMutation = gql`
mutation newSchedule(
  $title: String
  $court_availability: ID
  $users: [ID]
  $owner: ID
  $date: Date
  $pay_day: Date
  $value_payed: Float
  $activation_key: String
  $publishedAt: DateTime
) {
  createScheduling(
    data: {
      schedulingTitle: $title
      court_availability: $court_availability
      users: $users
      owner: $owner
      date: $date
      payDay: $pay_day
      valuePayed: $value_payed
      publishedAt: $publishedAt
      activated: true
      activationKey: $activation_key
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