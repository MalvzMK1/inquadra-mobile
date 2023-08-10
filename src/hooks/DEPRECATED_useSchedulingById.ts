import { DEPRECATED_ISchedulingByIdResponse, DEPRECATED_ISchedulingByIdVariables, DEPRECATED_schedulingByIdQuery } from '../graphql/queries/DEPRECATED_schedulingById';
import { QueryResult, useQuery } from "@apollo/client";



export function DEPRECATED_useSchedulingById(id: string): QueryResult<DEPRECATED_ISchedulingByIdResponse, DEPRECATED_ISchedulingByIdVariables> {
	return useQuery<DEPRECATED_ISchedulingByIdResponse, DEPRECATED_ISchedulingByIdVariables>(DEPRECATED_schedulingByIdQuery, {
		variables: {
			id
		}
	});
}

