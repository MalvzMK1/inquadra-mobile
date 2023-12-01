import { gql } from "@apollo/client";

export interface IUpdateEstablishmentFantasyNameResponse {
    updateEstablishment: {
        data: {
            attributes: {
                fantasyName: Establishment['fantasyName']
                corporateName: Establishment['corporateName']
            }
        }
    }
}

export interface IUpdateEstablishmentFantasyName {
    establishment_id: string;
    fantasy_name: string;
    corporate_name: string;
}

export const updateEstablishmentFantasyName = gql`
  mutation updateFantasyName(
        $establishment_id: ID!
        $fantasy_name: String
        $corporate_name: String
    ) {
        updateEstablishment(
        id: $establishment_id
        data: { fantasyName: $fantasy_name, corporateName: $corporate_name }
        ) {
            data {
                attributes {
                    fantasyName
                    corporateName
                }
            }
        }
    }
`