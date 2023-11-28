import { QueryHookOptions, QueryResult, useQuery } from "@apollo/client";
import {
  IinfoScheduleResponse,
  IinfoScheduleVariables,
  infoSchedule,
} from "../graphql/queries/infosSchedule";

export function useInfoSchedule(
  idScheduling: string,
  idUser: string,
  options?: Omit<
    QueryHookOptions<IinfoScheduleResponse, IinfoScheduleVariables>,
    "variables"
  >,
): QueryResult<IinfoScheduleResponse, IinfoScheduleVariables> {
  return useQuery<IinfoScheduleResponse, IinfoScheduleVariables>(infoSchedule, {
    ...options,
    variables: {
      idScheduling,
      idUser,
    },
  });
}
