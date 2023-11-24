import { QueryHookOptions, QueryResult, useQuery } from "@apollo/client";
import {
  IAllCourtsEstablishmentResponse,
  IAllCourtsEstablishmentVariable,
  allCourtsEstablishmentVariableQuery,
} from "../graphql/queries/allCourtsEstablishment";

export default function useAllCourtsEstablishment(
  establishmentID: string,
  options?: Omit<
    QueryHookOptions<
      IAllCourtsEstablishmentResponse,
      IAllCourtsEstablishmentVariable
    >,
    "variables"
  >,
): QueryResult<
  IAllCourtsEstablishmentResponse,
  IAllCourtsEstablishmentVariable
> {
  return useQuery<
    IAllCourtsEstablishmentResponse,
    IAllCourtsEstablishmentVariable
  >(allCourtsEstablishmentVariableQuery, {
    ...options,
    variables: {
      establishmentID: establishmentID,
    },
  });
}
