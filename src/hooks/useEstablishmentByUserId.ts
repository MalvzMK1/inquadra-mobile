import { QueryResult, useQuery } from "@apollo/client";
import { EstablishmentByUserIdQuery, IEstablishmentByUserIdResponse, IEstablishmentByUserIdVariables } from "../graphql/queries/establishmentByUserId"

export default function useEstablishmentIdByUserId(userID: string): QueryResult<IEstablishmentByUserIdResponse, IEstablishmentByUserIdVariables> {
    return useQuery<IEstablishmentByUserIdResponse, IEstablishmentByUserIdVariables>(EstablishmentByUserIdQuery, {
        variables: {
            userID
        }
    })
}