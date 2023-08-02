import { ISchedulingByIdResponse, ISchedulingByIdVariables, schedulingByIdQuery } from '../graphql/queries/schedulingById';
import { QueryResult, useQuery } from "@apollo/client";



export function useSchedulingById(id: string): QueryResult<ISchedulingByIdResponse, ISchedulingByIdVariables> {
	return useQuery<ISchedulingByIdResponse, ISchedulingByIdVariables>(schedulingByIdQuery, {
		variables: {
			id
		}
	});
}

