import { gql } from "@apollo/client";

export interface IsearchEstablishmentsByCorporateName {
    establishments: {
        data: [
            {
                id: string,
                attributes: {
                    corporateName: string
                }
            }
        ]
    }
}


export const searchEstablishmentsByCorporateNameQuery = gql`
    query searchEstablishmentsByCorporateName($name: String){
        establishments(filters:{
            corporateName: {
                contains: $name
            }
        }){
            data{
                id
                attributes{
                    corporateName
                }
            } 
        }
    }
`