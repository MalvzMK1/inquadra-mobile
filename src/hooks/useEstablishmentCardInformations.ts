import { QueryHookOptions, QueryResult, useQuery } from "@apollo/client";
import {
  IEstablishmentCardInformationsResponse,
  IEstablishmentCardInformationsVariables,
  establishmentCardInformationsQuery,
} from "../graphql/queries/establishmentCardInformations";

export default function useEstablishmentCardInformations(
  options?: QueryHookOptions<
    IEstablishmentCardInformationsResponse,
    IEstablishmentCardInformationsVariables
  >,
): QueryResult<IEstablishmentCardInformationsResponse> {
  return useQuery<
    IEstablishmentCardInformationsResponse,
    IEstablishmentCardInformationsVariables
  >(establishmentCardInformationsQuery, options);
}
