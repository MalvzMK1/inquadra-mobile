import { gql } from "@apollo/client";

export interface IRegisterEstablishmentResponse {
  createEstablishment: {
    data: {
      id: string;
      attributes: {
        corporateName: Establishment["corporateName"];
      };
    };
  };
}

export interface IRegisterEstablishmentVariables {
  ownerId: string;
  corporate_name: string;
  cnpj: string;
  phone_number: string;
  cep: string;
  latitude: string;
  longitude: string;
  street_name: string;
  amenities: Array<string>;
  cellphone_number: string;
  photos: Array<string>;
  publishedAt: string;
}

export const registerEstablishmentMutation = gql`
  mutation newEstablishment(
    $cnpj: String
    $phone_number: String
    $cellphone_number: String
    $photos: [ID]
    $corporate_name: String
    $cep: String
    $latitude: String
    $longitude: String
    $street_name: String
    $amenities: [ID]
    $ownerId: ID!
    $publishedAt: DateTime
  ) {
    createEstablishment(
      data: {
        owner: $ownerId
        corporateName: $corporate_name
        cnpj: $cnpj
        phoneNumber: $phone_number
        address: {
          cep: $cep
          latitude: $latitude
          longitude: $longitude
          streetName: $street_name
        }
        amenities: $amenities
        cellPhoneNumber: $cellphone_number
        photos: $photos
        publishedAt: $publishedAt
      }
    ) {
      data {
        id
        attributes {
          corporateName
        }
      }
    }
  }
`;
