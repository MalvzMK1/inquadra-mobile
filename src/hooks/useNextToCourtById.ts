import { QueryResult, useQuery } from "@apollo/client";
import { INextToCourtBiIdVariables, useNextToCourtByIdQuery, INextToCourtByIdResponse } from "../graphql/queries/nextToCourtsById";

export function useGetNextToCourtsById(id: string): QueryResult<INextToCourtByIdResponse, INextToCourtBiIdVariables> {
	return useQuery<INextToCourtByIdResponse, INextToCourtBiIdVariables>(useNextToCourtByIdQuery, {
		variables: {
			id
		}
	});
}
