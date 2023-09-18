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

export const getFavoriteEstablishmentsQuery = gql`
    query getFavoriteEstablishments($id: ID) {
  establishments(
    filters: {
      favorited_users:{
        id: {
          eq: $id
        }
      }
    }
  ) {
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