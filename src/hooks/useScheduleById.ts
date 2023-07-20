import { QueryResult, useQuery } from "@apollo/client";
import { IScheduleByIdResponse, IScheduleByIdVariables, scheduleByIdQuery } from "../graphql/queries/scheduleById";



export default function useScheduleById(id: string): QueryResult<IScheduleByIdResponse, IScheduleByIdVariables> {
	return useQuery<IScheduleByIdResponse, IScheduleByIdVariables>(scheduleByIdQuery, {
		variables: {
			id
		}
	});
}