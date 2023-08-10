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
    courtType: Array<string>,
    fantasyName: string,
    photos: Array<string>,
    court_availabilities: Array<string>,
    minimum_value: number
    currentDate: string
}

export const registerCourtMutation = gql`
mutation newCourt(
  $court_name: String
  $courtTypes: [ID]
  $fantasyName: String
  $photos: [ID]
  $court_availabilities: [ID]
  $minimum_value: Float
  $current_date: DateTime
) {
  createCourt(
    data: {
      name: $court_name
      court_types: $courtTypes
      fantasy_name: $fantasyName
      photo: $photos
      court_availabilities: $court_availabilities
      minimumScheduleValue: $minimum_value
      publishedAt: $current_date
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