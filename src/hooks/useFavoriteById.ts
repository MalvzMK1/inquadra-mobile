import { QueryResult, useQuery } from "@apollo/client";
import { IFavoriteByIdResponse, IFavoriteByIdVariables, favoriteByIdQuery } from "../graphql/queries/favoriteById";

export function useGetFavoriteById(id: string, userId: string): QueryResult<IFavoriteByIdResponse, IFavoriteByIdVariables> {
    return useQuery<IFavoriteByIdResponse, IFavoriteByIdVariables>(favoriteByIdQuery, {
        variables: {
            id,
            userId
        }
    })
}

