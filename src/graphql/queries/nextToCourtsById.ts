import { gql } from "@apollo/client";


export interface ICourtByIdResponse {
  court: {
    data: {
      id: Court['id']
      attributes: {
        court_type: {
          data: {
            attributes: {
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
        establishment:{
          data:{
            id: Establishment['id']
            attributes: {
              corporateName: Establishment['corporateName']
              address: {
                latitude: Address['latitude']
                longitude: Address['longitude']
              }
            }
          }
        }
      }
    }
  }
}

export interface ICourtByIdVariables {
	id: string
}

export const courtByIdQuery = gql`
  query courtById($id: ID) {
  court(id: $id) {
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
              corporateName
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
}`;
