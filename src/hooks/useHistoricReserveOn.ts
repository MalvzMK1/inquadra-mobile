import { QueryResult, useQuery } from "@apollo/client";
import {
  IHistoricReserveOnVariables,
  IgetHistoricOfReserveOnResponse,
  historicReserveOnQuery,
} from "../graphql/queries/historicReserveOn";

export function useGetHistoricReserveOn(
  id: string,
): QueryResult<IgetHistoricOfReserveOnResponse, IHistoricReserveOnVariables> {
  return useQuery<IgetHistoricOfReserveOnResponse, IHistoricReserveOnVariables>(
    historicReserveOnQuery,
    {
      variables: {
        id,
      },
      fetchPolicy: "network-only",
    },
  );
}
