import { gql } from "@apollo/client";

export interface IUpdateEstablishmentAddressResponse {
    updateEstablishment: {
        data: {
            attributes: {
                address: {
                    streetName: Address['streetName']
                    cep: Address['cep']
                    latitude: Address['latitude']
                    longitude: Address['longitude']
                }
            }
        }
    }
}

export interface IUpdateEstablishmentAddress {
    establishment_id: string
    street_name: string
    cep: string
    latitude: string
    longitude: string
}

export const updateEstablishmentAddressMutation = gql`
    mutation updateAddress($street_name: String, $cep: String, $establishment_id: ID!, $latitude: String, $longitude: String) {
  updateEstablishment(
    id: $establishment_id,
    data: {
      address: {
        streetName: $street_name,
        cep: $cep,
        latitude: $latitude,
        longitude: $longitude
      }
    }
  ) {
    data {
      attributes {
        address {
          streetName
          cep
        }
      }
    }
  }
}
`