import { scheduleQuery, IScheduleResponse } from './../graphql/queries/schedule';
import { QueryResult, useQuery } from "@apollo/client";

export function useSchedule(): QueryResult<IScheduleResponse> {
	return useQuery<IScheduleResponse>(scheduleQuery)
}