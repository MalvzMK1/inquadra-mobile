import { QueryHookOptions, QueryResult, useQuery } from "@apollo/client";
import {
  IReserveInfoResponse,
  IReserveInfoVariables,
  reserveInfoQuery,
} from "../graphql/queries/reserveInfos";

export function useReserveInfo(
  idCourt: string,
  options?: Omit<
    QueryHookOptions<IReserveInfoResponse, IReserveInfoVariables>,
    "variables"
  >,
): QueryResult<IReserveInfoResponse, IReserveInfoVariables> {
  return useQuery<IReserveInfoResponse, IReserveInfoVariables>(
    reserveInfoQuery,
    {
      ...options,
      variables: {
        idCourt,
      },
    },
  );
}
