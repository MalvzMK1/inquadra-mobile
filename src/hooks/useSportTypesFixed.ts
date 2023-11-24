import { QueryResult, useQuery } from "@apollo/client";
import {
  ISportTypesResponse,
  availablesSportTypesQuery,
} from "../graphql/queries/sportTypesFixed";

export function useSportTypes(): QueryResult<ISportTypesResponse> {
  return useQuery<ISportTypesResponse>(availablesSportTypesQuery);
}
