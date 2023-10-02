import { QueryResult, useQuery } from "@apollo/client";
import { IFavoriteEstablishmentsResponse, IFavoriteEstablishmentsVariable, getFavoriteEstablishmentsQuery } from "../graphql/queries/getFavoriteEstablishmentsById";

export default function useGetFavoriteEstablishmentsByUserId(user_id: string): QueryResult<IFavoriteEstablishmentsResponse, IFavoriteEstablishmentsVariable> {
    return useQuery<IFavoriteEstablishmentsResponse, IFavoriteEstablishmentsVariable>(getFavoriteEstablishmentsQuery, {
        variables: {
            user_id
        }
    })
}