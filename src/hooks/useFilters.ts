import { QueryResult, useQuery } from "@apollo/client";
import {
  IVariableFilter,
  IFilters,
  filtersQuery
} from "../graphql/queries/filters";

export default function useFilters({ amenities, dayUseService, endsAt, startsAt, weekDay }: IVariableFilter): QueryResult<IFilters> {

  let query: IVariableFilter = {};

  if (amenities && amenities.length > 0) {
    query.amenities = amenities;
  }
  if (dayUseService !== undefined && dayUseService !== null) {
    query.dayUseService = dayUseService;
  }
  if (endsAt !== undefined) {
    query.endsAt = endsAt;
  }
  if (startsAt !== undefined) {
    query.startsAt = startsAt;
  }
  if (weekDay !== undefined) {
    query.weekDay = weekDay;
  }

  return useQuery<IFilters>(filtersQuery, {
    variables: query,
  });
}