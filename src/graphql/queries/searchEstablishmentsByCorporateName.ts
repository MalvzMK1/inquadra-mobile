import { gql } from "@apollo/client";

export interface IAllEstablishmentsResponse {
    establishments: {
        data: Array<{
            id: string,
            attributes: {
                corporateName: string
            }
        }>
    }
}


export const allEstablishmentsQuery = gql`
    query getAllEstablishments($name: String){
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