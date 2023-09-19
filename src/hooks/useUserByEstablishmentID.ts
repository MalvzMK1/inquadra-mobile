import { QueryResult, useQuery } from "@apollo/client";
import { IUserByEstablishmentResponse, userByEstablishmentQuery } from "../graphql/queries/userByEstablishments"

export function useGetUserIDByEstablishment(establishmentID: string): QueryResult<IUserByEstablishmentResponse> {
    return useQuery<IUserByEstablishmentResponse>(userByEstablishmentQuery, {
        variables: {
            establishmentID
        }
    })
}
