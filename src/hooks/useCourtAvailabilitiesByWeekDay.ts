import { QueryHookOptions, QueryResult, useQuery } from "@apollo/client";
import {
  CourtAvailabilitiesByWeekDayResponse,
  CourtAvailabilitiesByWeekDayVariables,
  courtAvailabilitiesByWeekDayQuery,
} from "../graphql/queries/courtAvailabilitiesByWeekDay";

export function useCourtAvailabilitiesByWeekDay(
  options: QueryHookOptions<
    CourtAvailabilitiesByWeekDayResponse,
    CourtAvailabilitiesByWeekDayVariables
  >,
): QueryResult<
  CourtAvailabilitiesByWeekDayResponse,
  CourtAvailabilitiesByWeekDayVariables
> {
  return useQuery<
    CourtAvailabilitiesByWeekDayResponse,
    CourtAvailabilitiesByWeekDayVariables
  >(courtAvailabilitiesByWeekDayQuery, options);
}
