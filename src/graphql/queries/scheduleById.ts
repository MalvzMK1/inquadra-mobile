import { gql } from "@apollo/client";
import { ICourtType } from "./sportTypes";


export interface IScheduleByIdResponse{
   courts: {
    data: Array<{
        attributes: {
            court_type: ICourtType
        }
    }>
   }
}

export interface IScheduleByIdVariables {
	id: string
}

export const scheduleByIdQuery = gql`
    query schedule ($id: ID) {
        courts(id: $id) {
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
    }
`;