import { QueryResult, useQuery } from "@apollo/client";
import {
    IinfoScheduleResponse,
    IinfoScheduleVariables,
    infoSchedule
} from "../graphql/queries/infosSchedule"

export function useInfoSchedule(idScheduling: string, idUser: string): QueryResult< IinfoScheduleResponse, IinfoScheduleVariables>{
    return useQuery<IinfoScheduleResponse, IinfoScheduleVariables>(infoSchedule, {
        variables: {
            idScheduling,
            idUser
        }
    })
}