import {gql} from "@apollo/client";

export interface IUpdateFavoriteCourtResponse{
    updateUsersPermissionsUser: {
        data: {
            attributes: {
                favorite_courts: {
                    data: [
                        id: Court['id']
                    ]
                }
            }
        }
    }
}

export interface IUpdateFavoriteCourtVariables{
     user_id: number,
    favorite_courts: Array<number>
}


export const updateFavoriteCourtMutation = gql`
mutation favoriteCourt($favorite_courts: [ID], $user_id: ID!) {
  updateUsersPermissionsUser(
    id: $user_id,
    data:
    	{
        favorite_courts: $favorite_courts
      }
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