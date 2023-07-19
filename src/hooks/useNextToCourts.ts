import { QueryResult, useQuery } from "@apollo/client";
import { INextToCourtResponse, useNextToCourtQuery } from "../graphql/queries/nextToCourts";

export default function useGetNextToCourts(id: string): QueryResult<INextToCourtResponse> {
	return useQuery<INextToCourtResponse>(useNextToCourtQuery, {
		variables: {
			id
		}
	});
}
