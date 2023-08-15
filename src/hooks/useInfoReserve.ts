import { QueryResult, useQuery } from "@apollo/client";
import {IReserveInfoResponse, IReserveInfoVariables, reserveInfoQuery} from "../graphql/queries/reserveInfos"

export function useReserveInfo(idCourt: string): QueryResult<IReserveInfoResponse, IReserveInfoVariables>{
    return useQuery<IReserveInfoResponse, IReserveInfoVariables>(reserveInfoQuery, {
        variables: {
            idCourt
        }
    })
}