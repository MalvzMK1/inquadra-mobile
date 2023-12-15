import { gql } from "@apollo/client";

export interface IUpdateEstablishmentFantasyNameResponse {
    updateEstablishment: {
        data: {
            attributes: {
                corporateName: Establishment['corporateName']
            }
        }
    }
}

export interface IUpdateEstablishmentFantasyName {
    establishment_id: string;
    corporate_name: string;
}

export const updateEstablishmentFantasyName = gql`
  mutation updateFantasyName(
        $establishment_id: ID!
        $corporate_name: String
    ) {
        updateEstablishment(
        id: $establishment_id
        data: { fantasyName: $corporate_name, corporateName: $corporate_name }
        ) {
            data {
                attributes {
                    corporateName
                }
            }
        }
    }
`