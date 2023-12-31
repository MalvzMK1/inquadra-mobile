import { QueryResult, useQuery } from "@apollo/client";
import {
	IUserEstablishmentResponse,
	IUserEstablishmentVariables,
	userEstablishmentQuery
} from "../graphql/queries/userEstablishmentInfo";

export function useGetUserEstablishmentInfos(id: string): QueryResult<IUserEstablishmentResponse, IUserEstablishmentVariables> {
	return useQuery<IUserEstablishmentResponse, IUserEstablishmentVariables>(userEstablishmentQuery, {
		variables: {
			id
		}
	});
}
