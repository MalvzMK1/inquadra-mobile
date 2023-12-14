import { QueryHookOptions, useQuery } from "@apollo/client";
import {
  EstablishmentPixKeysQueryResponse,
  EstablishmentPixKeysQueryVariables,
  establishmentPixKeysQuery,
} from "../graphql/queries/establishmentPixKeys";

export function useEstablishmentPixKeysQuery(
  options?: QueryHookOptions<
    EstablishmentPixKeysQueryResponse,
    EstablishmentPixKeysQueryVariables
  >,
) {
  return useQuery<
    EstablishmentPixKeysQueryResponse,
    EstablishmentPixKeysQueryVariables
  >(establishmentPixKeysQuery, options);
}
