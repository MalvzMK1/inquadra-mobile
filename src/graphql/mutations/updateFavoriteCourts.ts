import { gql } from "@apollo/client";

export interface IUpdateFavoriteCourtsResponse {
    updateUserPermissionsUser: {
        data: {
            attributes: {
                favorite_courts: {
                    data: Array<{
                        id: Court['id']
                    }>
                }
            }
        }
    }
}

export interface IUpdateFavoriteCourtsVariables {
    favorite_courts: Array<string>,
    userId: string
}

export const updateFavoriteCourtsMutation = gql`
mutation updateFavoriteCourts($favorite_courts: [ID], $userId: ID!) {
  updateUsersPermissionsUser(
    id: $userId
    data: { favorite_courts: $favorite_courts }
  ) {
    data {
      attributes {
        favorite_courts {
          data {
            id
          }
        }
      }
    }
  }
}
`