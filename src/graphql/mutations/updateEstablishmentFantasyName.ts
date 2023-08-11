import { gql } from "@apollo/client";

export interface IUpdateEstablishmentFantasyNameResponse {
    updateEstablishment: {
        data: {
            attributes: {
                fantasyName: Establishment['fantasyName']
            }
        }
    }
}

export interface IUpdateEstablishmentFantasyName {
    establishment_id: string
    fantasy_name: string
}

export const updateEstablishmentFantasyName = gql`
    mutation updateFantasyName($establishment_id: ID!, $fantasy_name: String) {
  updateEstablishment(
    id: $establishment_id
    data: { fantasyName: $fantasy_name }
  ) {
    data {
      attributes {
        fantasyName
      }
    }
  }
}
`