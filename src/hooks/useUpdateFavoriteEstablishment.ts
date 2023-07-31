import { useMutation } from "@apollo/client";

import {
    IUpdateFavoriteEstablishment,
    updateFavoriteEstablishmentsMutation
} from "../graphql/mutations/updateFavoriteEstablishments"

export default function useUpdateFavoriteEstablishment(id: string, favorite_establishments: [string]){
    return useMutation<IUpdateFavoriteEstablishment>(updateFavoriteEstablishmentsMutation, {
        variables:{
            id,
            favorite_establishments
        }
    })
}
