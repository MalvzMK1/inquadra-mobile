import { gql } from "@apollo/client";

export interface IUpdateFavoriteEstablishment {
    updateUsersPermissionsUser: {
        data: {
            id: number,
            attributes: {
                favorited_establishments: {
                    data: [
                        {
                            id: number
                        }
                    ]
                }
            }
        }
    }
}

export interface IUpdateFavoriteEstablishmentVariables {
  user_id: string,
  favorite_establishments: string[]
}

export const updateFavoriteEstablishmentsMutation = gql`
mutation updateFavoriteEstablishment($user_id: ID!, $favorite_establishments: [ID]){
	updateUsersPermissionsUser(
        id: $user_id, 
        data:{
          favorite_establishments: $favorite_establishments
        }
    ){
    data{
      id
      attributes{
        favorite_establishments{
          data{
            id
          }
        }
      }
    }
  }
}
`