import { QueryResult, useQuery } from "@apollo/client";
import {IFavoritesCourtsByIdResponse, favoriteCourtByIdQuery} from "../graphql/queries/getFavoritesCourtsById"

export default function useGetFavoritesCourtsById(id: string): QueryResult<IFavoritesCourtsByIdResponse>{
    return useQuery<IFavoritesCourtsByIdResponse>(favoriteCourtByIdQuery, {
        variables: {
            id
        }
    })
}