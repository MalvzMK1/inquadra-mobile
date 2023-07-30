import { gql } from "@apollo/client";


export interface IScheduleResponse{
  courts: {
    data: Array<{
      attributes: {
        court_type: {
          data:{
            id: SportType['id']
            attributes:{
              name: SportType['name']
            }
          }
        }
      }
    }>
  }
}

export const scheduleQuery = gql`
query schedule {
  courts {
    data {
      attributes {
        court_type {
          data {
            id
            attributes {
              name
            }
          }
        }
      }
    }
  }
}`;