import { gql } from "@apollo/client";

export interface DEPRECATED_ISchedulingByIdResponse {
  establishment:{
    data:{
      attributes:{
        courts:{
          data: Array<{
            id: Court['id']
            attributes:{
              court_availabilities:{
                data: Array<{
                  id: CourtAvailability['id']
                  attributes:{
                    dayUseService: CourtAvailability['dayUseService']
                    startsAt: string
                    endsAt: string
                    weekDay: CourtAvailability['weekDay']
                  }
                }>
              }
            }
          }>
        }
      }
    }
  }
}

export interface DEPRECATED_ISchedulingByIdVariables {
	id: string
}

export const DEPRECATED_schedulingByIdQuery = gql`
query typeSchedulingById ($id : ID){
  establishment(id: $id) {
    data {
      attributes {
        courts {
          data {
            id
            attributes {
              court_availabilities {
                data {
                  id
                  attributes {
                    dayUseService
                    startsAt
                    endsAt
                    weekDay
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}`;
