import {gql} from "@apollo/client";

export interface IDeleteCourtResponse{
    deleteCourt: {
        data:{
            id: Court['id']
            attributes:{
                name: Court['name']
            }
        }
    }
}

export interface IDeleteCourtVariables{
    court_id: number
}

export const deleteCourtMutation = gql`

`