import {QueryResult, useQuery} from "@apollo/client";
import {
GetEstablishmentWithdrawsQuery,
IGetEstablishmentWithdrawsResponse,
IGetEstablishmentWithdrawsVariable
} from "../graphql/queries/allEstablishmentWithdraws"

export default function useAllEstablishmentWithdraws(establishmentID: string):QueryResult<IGetEstablishmentWithdrawsResponse, IGetEstablishmentWithdrawsVariable>{
    return useQuery<IGetEstablishmentWithdrawsResponse, IGetEstablishmentWithdrawsVariable>(GetEstablishmentWithdrawsQuery, {
        variables: {
            establishmentID
        }
    })
}