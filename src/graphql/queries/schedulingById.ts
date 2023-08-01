import { gql } from "@apollo/client";

export interface ISchedulingByIdResponse{
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
                    startsAt: CourtAvailability ['startsAt']
                    endsAt: CourtAvailability['endsAt']
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

export interface ISchedulingByIdVariables {
	id: string
}

export const schedulingByIdQuery = gql`
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
