import { useMutation } from "@apollo/client";

import {
    IUpdateFavoriteEstablishment,
    IUpdateFavoriteEstablishmentVariables,
    updateFavoriteEstablishmentsMutation,
} from "../graphql/mutations/updateFavoriteEstablishments"


export default function useUpdateFavoriteEstablishment(){    
    return useMutation<IUpdateFavoriteEstablishment, IUpdateFavoriteEstablishmentVariables>(updateFavoriteEstablishmentsMutation)
}
