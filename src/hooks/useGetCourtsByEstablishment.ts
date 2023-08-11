import { QueryResult, useQuery } from "@apollo/client";
import {
    ICourtByEstablishmentVariable,
    ICourtsByEstablishmentResponse,
    courtByEstablishmentQuery
} from"../graphql/queries/courtsByEstablishment"

export default function useGetCourtNameByEstablishmentQuery(establishmentId: string): QueryResult<ICourtsByEstablishmentResponse, ICourtByEstablishmentVariable>{
    return useQuery<ICourtsByEstablishmentResponse, ICourtByEstablishmentVariable>(courtByEstablishmentQuery, {
        variables:{
            establishmentId
        }
    })
}