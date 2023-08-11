import { gql } from "@apollo/client";
import { CourtType } from "../../__generated__/graphql";

export interface IEstablishmentByCourtId {
  data: {
    court: {
      data: {
        attributes: {
          establishment: {
            data: {
              id: string,
              attributes: {
                type: string,
                corporateName: Establishment["corporateName"],
                cellPhoneNumber: Establishment["cellphoneNumber"],
                address: {
                  latitude: Address["latitude"],
                  longitude: Address["longitude"],
                  streetName: Address["streetName"]
                },
                amenities: {
                  data: {
                    attributes: {
                      name: Amenitie["name"]
                    }
                  }
                },
                photosAmenitie: {
                  data: [
                    {
                      attributes: {
                        url: string
                      }
                    }
                  ]
                }
                photos: {
                  data: {
                    attributes: {
                      url: Establishment["photo"]
                    }
                  }
                },
                courts: {
                  data: {
                    court_availabilities: {
                      data: {
                        attributes: {
                          status: boolean,
                        }
                      }[]
                    }
                    favorited_user: {
                      data: {
                        id: number
                      }
                    }
                    rating: Court["rating"],
                    court_type: {
                      data: {
                        attributes: {
                          name: CourtType["name"]
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}

export const EstablishmentByCourtIdQuery = gql`
query getEstablishmentbyCourtId($id: ID) {
  court(id: $id) {
    data{
      attributes{
        establishment{
          data{
            id
            attributes{
              type
              corporateName
              cellPhoneNumber
              address{
                latitude
              	longitude
                streetName
              }
              amenities{
                data{
                  attributes{
                    name
                  }
                }
              }
              photosAmenitie{
                data{
                  attributes{
                    url
                  }
                }
              }
              photos{
                data{
                  attributes{
                    url
                  }
                }
              }
              courts{
								data{
                  id
									attributes{
                    court_availabilities{
                      data{
												attributes{
                          status
                        }
                      }
                    }
                    name
                    photo {
                    	data{
												attributes{
                          url
                        }
                      }
                  	}
                    rating
                    court_type{
                      data{
                        attributes{
													name
                        }
                      }
                    }
                    court_availabilities{
                      data{
                        attributes{
                          status
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
`