import { QueryResult, useQuery } from "@apollo/client";
import {
  IVariableFilter,
  IFilters,
  filtersQuery
} from "../graphql/queries/filters";

export default function useFilters({ amenities, dayUseService, endsAt, startsAt, weekDay }: IVariableFilter): QueryResult<IFilters> {

  let query: IVariableFilter = {}

  if (amenities.length > 0 && amenities !== null) {
    query.amenities = amenities;
  }
  if (dayUseService !== undefined && dayUseService !== null) {
    query.dayUseService = dayUseService;
  }
  if (endsAt) {
    query.endsAt = endsAt;
  }
  if (startsAt) {
    query.startsAt = startsAt;
  }
  if (weekDay) {
    query.weekDay = weekDay;
  }

  return useQuery<IFilters>(filtersQuery, {
    variables: query,
  });
}