import { QueryResult, useQuery } from "@apollo/client";
import {
  AllEstablishmentsCNPJQuery,
  IEstablishmentsCNPJResponse,
} from "../graphql/queries/allEstablishmentsCNPJ";

export default function useAllEstablishmentsCNPJ(
  cnpj: string,
): QueryResult<IEstablishmentsCNPJResponse> {
  return useQuery<IEstablishmentsCNPJResponse>(AllEstablishmentsCNPJQuery, {
    variables: {
      cnpj,
    },
  });
}
