import { QueryHookOptions, QueryResult, useQuery } from "@apollo/client";
import {
  ICourtByIdResponse,
  ICourtByIdVariables,
  courtByIdQuery,
} from "../graphql/queries/nextToCourtsById";

export default function useCourtById(
  id: string,
  options?: Omit<
    QueryHookOptions<ICourtByIdResponse, ICourtByIdVariables>,
    "variables"
  >,
): QueryResult<ICourtByIdResponse, ICourtByIdVariables> {
  return useQuery<ICourtByIdResponse, ICourtByIdVariables>(courtByIdQuery, {
    ...options,
    variables: {
      id,
    },
  });
}
