import { gql } from "@apollo/client";
import { ICourtType } from "./sportTypes";
import { Court } from "../../types/Court";
import { CourtAvailability } from "../../types/CourtAvailability";




export interface IScheduleByIdResponse{
   establishment:{
    data:{
        attributes: {
            courts: {
                data: {
                    id: Court['id']
                    attributes: {
                        court_availabilities:{
                            data:{
                                attributes: {
                                    dayUseService: CourtAvailability['dayUseService']
                                    startsAt: CourtAvailability['startsAt']
                                    endsAt: CourtAvailability['endsAt']
                                    weekDay: CourtAvailability['weekDay']
                                }
                            }
                        }
                    }
                }
            } 
        }
    }
   }
}

export interface IScheduleByIdVariables {
	id: string
}

export const scheduleByIdQuery = gql `
    query typeScheduleById ($id: ID) {
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
}
`