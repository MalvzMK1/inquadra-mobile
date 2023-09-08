import { useMutation } from "@apollo/client";
import {IUpdateFavoriteCourtsResponse, IUpdateFavoriteCourtsVariables, updateFavoriteCourtsMutation} from "../graphql/mutations/updateFavoriteCourts"

export default function useUpdateFavoriteCourts(){
    return useMutation<IUpdateFavoriteCourtsResponse, IUpdateFavoriteCourtsVariables>(updateFavoriteCourtsMutation)
}