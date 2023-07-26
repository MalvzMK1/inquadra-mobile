import {gql} from "@apollo/client";

export interface IDeleteScheduleResponse{
   deleteScheduling: {
      data: {
        id: Schedule['id']
        attributes: {
            date: Schedule['date']
        }
      }
   }
}

export interface IDeleteScheduleVariables{
    scheduling_id: number
}

export const deleteScheduleMutation = gql`
mutation deleteSchedule($scheduling_id: ID!) {
  deleteScheduling(id: $scheduling_id) {
    data {
      id
      attributes {
        date
      }
    }
  }
}
`