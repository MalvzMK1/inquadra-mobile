import { QueryResult, useQuery } from "@apollo/client";
import {
    ISchedulingByDateResponse,
    ISchedulingByDateVariables,
    schedulingByDateQuery
} from "../graphql/queries/schedulingByDate";

export function useGetSchedulingByDate(date: string, court_id: string): QueryResult<ISchedulingByDateResponse, ISchedulingByDateVariables> {
    return useQuery<ISchedulingByDateResponse, ISchedulingByDateVariables>(schedulingByDateQuery, {
        variables: {
            date: {
                eq: date
            },
            court_id: {
                eq: court_id
            }
        }
    })
}