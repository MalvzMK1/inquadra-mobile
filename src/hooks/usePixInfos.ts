import {QueryResult, useQuery} from "@apollo/client";
import {IPixInfosResponse, IPixInfosVariables, pixInfosQuery} from "../graphql/queries/pixInfos";

export function usePixInfos(): QueryResult<IPixInfosResponse, IPixInfosVariables> {
	return useQuery<IPixInfosResponse, IPixInfosVariables>(pixInfosQuery);
}
