import {gql} from "@apollo/client";

export interface IUpdateCordenationsResponse{
    updateUsersPermissionsUser: {
        data: {
            attributes: {
                address: Omit<Address, 'id'>
            }
        }
    }
}

export interface IUpdateCordenationsVariables{
    user_id: number,
    latitude: string,
    longitude: string,
    cep: string,
    street_name: string
}

export const updateCordenationsMutation = gql`
mutation updateCoordenations(
  $latitude: String
  $longitude: String
  $cep: String
  $street_name: String
  $user_id: ID!
) {
  updateUsersPermissionsUser(
    id: $user_id
    data: {
      address: {
        latitude: $latitude
        longitude: $longitude
        cep: $cep
        streetName: $street_name
      }
    }
  ) {
    data {
      attributes {
        address {
          latitude
          longitude
          cep
          streetName
        }
      }
    }
  }
}
`