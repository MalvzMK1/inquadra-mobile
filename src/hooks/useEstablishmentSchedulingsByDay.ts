import { QueryResult, useQuery } from "@apollo/client";
import {
  IEstablishmentSchedulingsByDayResponse,
  IEstablishmentSchedulingsByDayVariables,
  establishmentSchedulingsByDayQuery,
} from "../graphql/queries/establishmentSchedulingsByDay";

export function useEstablishmentSchedulingsByDay(
  establishmentID: string,
  fantasyName: string,
  dayWeek: string,
  date: string,
): QueryResult<
  IEstablishmentSchedulingsByDayResponse,
  IEstablishmentSchedulingsByDayVariables
> {
  return useQuery<
    IEstablishmentSchedulingsByDayResponse,
    IEstablishmentSchedulingsByDayVariables
  >(establishmentSchedulingsByDayQuery, {
    variables: {
      establishmentID,
      fantasyName,
      dayWeek,
      date,
    },
  });
}
