import { QueryResult, useQuery } from "@apollo/client";
import { IFavoriteEstablishmentsResponse, getFavoriteEstablishmentsQuery } from "../graphql/queries/getFavoriteEstablishmentsById";

export default function useGetFavoriteEstablishmentsByUserId(userId: string): QueryResult<IFavoriteEstablishmentsResponse> {
    return useQuery<IFavoriteEstablishmentsResponse>(getFavoriteEstablishmentsQuery, {
        variables: {
            userId
        }
    })
}