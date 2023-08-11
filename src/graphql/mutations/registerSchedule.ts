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
    publishedAt: string
    title: string
    court_availability: number
    users: Array<number>
    owner: number
    date: string
    pay_day: string
    value_payed: number
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