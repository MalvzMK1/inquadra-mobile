import { QueryResult, useQuery } from "@apollo/client";
import { IFavoriteByIdResponse, IFavoriteByIdVariables, favoriteByIdQuery } from "../graphql/queries/favoriteById";

export default function useGetFavoriteById(id: string): QueryResult<IFavoriteByIdResponse, IFavoriteByIdVariables> {
    return useQuery<IFavoriteByIdResponse, IFavoriteByIdVariables>(favoriteByIdQuery, {
        variables: {
            id
        }
    })
}