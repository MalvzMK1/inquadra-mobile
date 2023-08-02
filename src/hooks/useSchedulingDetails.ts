import { QueryResult, useQuery } from "@apollo/client";
import { ISchedulingDetailsResponse, ISchedulingDetailsVariables, schedulingsDetailsQuery } from "../graphql/queries/scheduleDetails";

export function useGetSchedulingsDetails(id: string): QueryResult<ISchedulingDetailsResponse, ISchedulingDetailsVariables> {
    return useQuery<ISchedulingDetailsResponse, ISchedulingDetailsVariables>(schedulingsDetailsQuery, {
        variables: {
            id
        }
    })
}