import { gql } from "@apollo/client";
import { Court } from "../../types/Court";
import { SportType } from "../../types/SportTypes";
import { Photo } from "../../types/Photo";
import { Establishment } from "../../types/EstablishmentInfos";
import { Address } from "../../types/Address";


export interface INextToCourtByIdResponse{
    courts: {
        data: Array<{
            id: Court ['id'];
            attributes: {
                name: Court ['name']
                court_type:{
                    data:{
                        attributes:{
                            name: SportType['name']
                        }
                    }
                } & {
                    photo: {
                        data: {
                            attributes:{
                                url: Photo['url']
                            }
                        }
                    } 
                } & {
                    establishment:{
                        data:{
                            id: Establishment['id']
                            attributes: Omit<Establishment, 'id'> & {
                                address: {
                                    data: {
                                        latitude: Address['latitude']
                                        longitude: Address['longitude']    
                                    }
                                }
                            }
                        }
                    }
                }     
            }
        }>
    }
}

export interface INextToCourtBiIdVariables {
	id: string
}

export const useNextToCourtByIdQuery = gql`
    query nextToCourtById($id: ID) {
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
        court_type {
          data {
            attributes {
              name
            }
          }
        }
      }
    }
  }
}
`;
