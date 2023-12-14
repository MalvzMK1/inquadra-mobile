import { gql } from "@apollo/client";

export interface EstablishmentPixKeysQueryResponse {
  pixKeys: {
    data: Array<{
      attributes: {
        key: string;
      };
    }>;
  };
}

export interface EstablishmentPixKeysQueryVariables {
  establishmentId: string;
}

export const establishmentPixKeysQuery = gql`
  query EstablishmentPixKeys($establishmentId: ID!) {
    pixKeys(
      sort: "createdAt:desc"
      filters: { establishment: { id: { eq: $establishmentId } } }
    ) {
      data {
        attributes {
          key
        }
      }
    }
  }
`;
