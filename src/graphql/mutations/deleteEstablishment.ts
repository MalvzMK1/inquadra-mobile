import {gql} from "@apollo/client";

export interface IDeleteEstablishmentResponse{
    deleteEstablishment: {
        data: {
            attributes: {
                corporateName: Establishment['corporateName']
            }
        }
    }
}

export interface IDeleteEstablishmentVariables{
    establishment_id: number | string
}

export const deleteEstablishmentMutation = gql`
mutation deleteEstablishment($establishment_id: ID!) {
  deleteEstablishment(id: $establishment_id) {
    data {
      attributes {
        corporateName
      }
    }
  }
}
`

