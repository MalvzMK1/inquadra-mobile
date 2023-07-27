import { QueryResult, useQuery } from "@apollo/client";
import {
    IHistoricReserveOffResponse,
    IHistoricReserveOffVariables,
    historicReserveOff
} from "../graphql/queries/historicReserveOff"

export function useHistoricReserveOff(id: string): QueryResult<IHistoricReserveOffResponse, IHistoricReserveOffVariables> {
    return useQuery<IHistoricReserveOffResponse, IHistoricReserveOffVariables>(historicReserveOff, {
        variables: {
            id
        }
    })
}