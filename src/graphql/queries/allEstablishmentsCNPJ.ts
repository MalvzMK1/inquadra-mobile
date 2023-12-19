import { gql } from "@apollo/client";

export interface IEstablishmentsCNPJResponse {
  establishments:
    | {
        data: [
          {
            attributes: {
              cnpj: string;
            };
          },
        ];
      }
    | { data: [] };
}

export interface IEstablishmentsCNPJVariables {
  cnpj: string;
}

export const AllEstablishmentsCNPJQuery = gql`
  query getEstablishmentCNPJ($cnpj: String) {
    establishments(filters: { cnpj: { eq: $cnpj } }) {
      data {
        attributes {
          corporateName
          cnpj
        }
      }
    }
  }
`;
