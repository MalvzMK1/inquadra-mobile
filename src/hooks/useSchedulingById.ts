import { IschedulingByIdResponse, ISchedulingByIdVariables, schedulingByIdQuery } from '../graphql/queries/schedulingById';
import { QueryResult, useQuery } from "@apollo/client";



export function useSchedulingById(id: string): QueryResult<IschedulingByIdResponse, ISchedulingByIdVariables> {
	return useQuery<IschedulingByIdResponse, ISchedulingByIdVariables>(schedulingByIdQuery, {
		variables: {
			id
		}
	});
}

