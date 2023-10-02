import { gql } from "@apollo/client";

export interface IFavoriteEstablishmentsResponse {
  establishments: {
    data: Array<{
      id: Establishment['id']
      attributes: {
        address: {
          latitude: Address['latitude']
          longitude: Address['longitude']
        }
        corporateName: Establishment['corporateName']
        photos: {
          data: Array<{
            attributes: {
              url: Photo['url']
            }
          }>
        }
      }
    }>
  }
}

export interface IFavoriteEstablishmentsVariable {
  user_id: string
}

export const getFavoriteEstablishmentsQuery = gql`
  query getFavoriteEstablishments($user_id: ID!) {
  establishments(filters: { favorited_users: { id: { eq: $user_id } } }) {
    data {
      attributes {
        address {
          latitude
          longitude
        }
        corporateName
        photos {
          data {
            attributes {
              url
            }
          }
        }
      }
    }
  }
}
`