import {availablesSportTypesQuery, ISportTypesResponse} from "../graphql/queries/sportTypes";
import {QueryResult, useQuery} from "@apollo/client";

export default function useAvailableSportTypes(): QueryResult<ISportTypesResponse> {
	return useQuery<ISportTypesResponse>(availablesSportTypesQuery)
}