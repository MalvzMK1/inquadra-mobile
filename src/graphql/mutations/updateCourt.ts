import {gql} from "@apollo/client";

export interface IUpdateCourtResponse{
    updateCourt:{
        data:{
            id: Court['id']
            attributes:{
                name: Court['name']
            }
        }
    }
}

export interface IUpdateCourtVariables{
    court_id: number,
    court_name: string,
    court_types: number,
    fantasy_name: string,
    photos: Array<string>,
    court_availabilities: Array<string>,
    minimum_value: number
}

export const updateCourtMutation = gql`
mutation updateCourt(
  $court_name: String
  $court_types: [ID]
  $fantasy_name: String
  $photos: [ID]
  $court_availabilities: [ID]
  $minimum_value: Float
  $court_id: ID!
) {
  updateCourt(
    id: $court_id
    data: {
      name: $court_name
      court_types: $court_types
      fantasy_name: $fantasy_name
      photo: $photos
      court_availabilities: $court_availabilities
      minimumScheduleValue: $minimum_value
    }
  ) {
    data {
      id
      attributes {
        name
      }
    }
  }
}
`