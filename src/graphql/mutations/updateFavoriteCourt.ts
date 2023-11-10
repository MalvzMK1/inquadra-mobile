import { gql } from "@apollo/client";

export interface IUpdateFavoriteCourtResponse {
  updateUsersPermissionsUser: {
    data: {
      attributes: {
        favorite_establishments: {
          data: Array<{
            id: Court['id']
          }>
        }
      }
    }
  }
}

export interface IUpdateFavoriteCourtVariables {
  user_id: string,
  favorite_establishment: Array<string>
}


export const updateFavoriteCourtMutation = gql`
mutation favoriteCourt($favorite_establishment: [ID], $user_id: ID!) {
  updateUsersPermissionsUser(
    id: $user_id
    data: { favorite_establishments: $favorite_establishment }
  ) {
    data {
      attributes {
        favorite_establishments {
          data {
            id
          }
        }
      }
    }
  }
}
`