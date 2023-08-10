import {gql} from "@apollo/client";

export interface IRegisterCourtResponse{
    createCourt:{
        data:{
            id: Court['id']
            attributes:{
                name: Court['name']
            }
        }
    }
}

export interface IRegisterCourtVariables{
    court_name: string,
    courtType: string,
    fantasyName: string,
    photos: Array<string>,
    court_availabilities: Array<string>,
    minimum_value: number
}

export const registerCourtMutation = gql`
mutation newCourt(
  $court_name: String
  $courtType: ID
  $fantasyName: String
  $photos: [ID]
  $court_availabilities: [ID]
  $minimum_value: Float
) {
  createCourt(
    data: {
      name: $court_name
      court_type: $courtType
      fantasy_name: $fantasyName
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
}`