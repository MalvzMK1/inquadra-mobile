import { gql } from "@apollo/client";
import { ICourtType } from "./sportTypes";


export interface IScheduleResponse{
   courts: {
    data: Array<{
        attributes: {
            court_type: ICourtType
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
    }
`;