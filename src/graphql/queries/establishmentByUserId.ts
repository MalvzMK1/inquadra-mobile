import { gql } from "@apollo/client";

export interface IEstablishmentByUserIdResponse {
    usersPermissionsUser: {
        data: {
            attributes: {
                establishment: {
                    data: {
                        id: Establishment['id']
                    }
                }
            }
        }
    }
}

export interface IEstablishmentByUserIdVariables {
    userID: string
}

export const EstablishmentByUserIdQuery = gql`
query getUserEstablishment($userID: ID) {
  usersPermissionsUser(id: $userID) {
    data {
      attributes {
        establishment {
          data {
            id
          }
        }
      }
    }
  }
}

`