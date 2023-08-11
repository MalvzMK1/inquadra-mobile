import { gql } from "@apollo/client"
type DateTime = Date;

export interface IRegisterPixKeyResponse {
    createPixKey: {
        data: {
            attributes: {
                establishment: {
                    data: {
                        id: Establishment['id']
                    }
                }
            }
        }
    }
}

export interface IRegisterPixKeyVariables {
    pix_key: string
    establishment_id: string
    published_at: DateTime
}

export const registerPixKey = gql`
    mutation newPixKey($pix_key: String, $establishment_id: ID, $published_at: DateTime) {
  createPixKey( 
    data: {
    	key: $pix_key,
      establishment: $establishment_id,
      publishedAt: $published_at
  	} 
  ) {
    data {
      attributes {
        establishment {
          data {
            id
          }
        }
      }
    }
  }
}
`