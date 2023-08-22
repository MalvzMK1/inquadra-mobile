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
    court_name: string
    courtTypes: string[]
    fantasyName: string
    photos: string[]
    court_availabilities: string[]
    minimum_value: number
    current_date: string
    establishmentId: string
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
  $establishmentId: ID
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
      establishment: $establishmentId
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