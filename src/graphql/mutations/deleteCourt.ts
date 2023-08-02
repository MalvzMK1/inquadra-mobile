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
mutation deleteCourt($court_id: ID!) {
  deleteCourt(id: $court_id) {
    data {
      id
      attributes {
        name
      }
    }
  }
}
`