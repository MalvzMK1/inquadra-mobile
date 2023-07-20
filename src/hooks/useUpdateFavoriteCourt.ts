import { useMutation } from "@apollo/client";
import {
    IUpdateFavoriteCourtResponse,
    IUpdateFavoriteCourtVariables,
    updateFavoriteCourtMutation

} from "../graphql/mutations/updateFavoriteCourt"

export default function useUpdateFavoriteCourt(){
    return useMutation<IUpdateFavoriteCourtResponse, IUpdateFavoriteCourtVariables>(updateFavoriteCourtMutation)
}
