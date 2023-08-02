import { QueryResult, useQuery } from "@apollo/client";
import { ICourtByIdVariables, courtByIdQuery, ICourtByIdResponse } from "../graphql/queries/nextToCourtsById";

export default function useGetNextToCourtsById(id: string): QueryResult<ICourtByIdResponse, ICourtByIdVariables> {
	return useQuery<ICourtByIdResponse, ICourtByIdVariables>(courtByIdQuery, {
		variables: {
			id
		}
	});
}
