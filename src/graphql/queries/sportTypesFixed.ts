import { gql } from "@apollo/client";

export interface ISportTypesResponse {
  courtTypes: {
    data: Array<{
      id: SportType["id"];
      attributes: {
        name: SportType["name"];
      };
    }>;
  };
}

export const availablesSportTypesQuery = gql`
  query typeSports {
    courtTypes(sort: "order:asc") {
      data {
        id
        attributes {
          name
        }
      }
    }
  }
`;
