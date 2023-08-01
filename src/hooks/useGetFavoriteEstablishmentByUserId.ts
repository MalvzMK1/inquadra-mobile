import { QueryResult, useQuery } from "@apollo/client";
import {
	IFavoriteEstablishmentByUserId,
    favoriteEstablishmentByUserIdQuery
} from "../graphql/queries/favoriteEstablishmentByUserId";

export default function useGetFavoriteEstablishmentByUserId(userID: string): QueryResult<IFavoriteEstablishmentByUserId> {
	return useQuery<IFavoriteEstablishmentByUserId>(favoriteEstablishmentByUserIdQuery, {
		variables: {
			userID
		}
	});
}