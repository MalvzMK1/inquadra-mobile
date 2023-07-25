import { QueryResult, useQuery } from "@apollo/client";
import { INextToCourtResponse, useNextToCourtQuery } from "../graphql/queries/nextToCourts";

export default function useGetNextToCourts(): QueryResult<INextToCourtResponse> {
	return useQuery<INextToCourtResponse>(useNextToCourtQuery);
}
