import { gql } from "@apollo/client";


export interface INextToCourtResponse{
    courts:{
        data: Array<{
          id: Court['id']
          attributes:{
            court_type:{
              data:{
                attributes:{
                  name: SportType['name']
                }
              }
            }
            name: Court['name']
            photo:{
              data: Array<{
                attributes:{
                  url: Photo['url']
                }
              }>
            }
            establishment: {
              data: {
                id: Establishment['id']
                attributes:{
                  address:{
                    latitude: Address['latitude']
                    longitude: Address['longitude']
                  }
                }
              }
            }
          }
        }>
      }
}

export const useNextToCourtQuery = gql`
query nextToCourts {
  courts {
    data {
      id
      attributes {
        court_type {
          data {
            attributes {
              name
            }
          }
        }
        name
        photo {
          data {
            attributes {
              url
            }
          }
        }
        establishment {
          data {
            id
            attributes {
              address {
                latitude
                longitude
              }
            }
          }
        }
      }
    }
  }
}`