import { gql } from "@apollo/client";

export interface IReserveInfoResponse{
    courtAvailability: {
      data: {
        attributes: {
          minValue: CourtAvailability['minValue']
          value: CourtAvailability['value']
          court: {
            data: {
              attributes: {
                fantasy_name: Court['fantasy_name']
                name: Court['name']
                rating: Court['rating']
                minimumScheduleValue: number
                establishment: {
                  data: {
                    attributes: {
                      amenities: {
                        data: Array<{
                          attributes: {
                            name: Amenitie['name']
                            iconAmenitie: {
                              data: {
                                attributes: {
                                  url: Amenitie['icon']
                                }
                              }
                            }
                          }
                        }>
                      }
                      address: {
                        streetName: Address['streetName']
                        latitude: Address['latitude']
                        longitude: Address['longitude']
                        cep: Address['cep']
                      }
                    }
                  }
                }
                photo: {
                  data: Array<{
                    attributes: {
                      url:Court['image']
                    }
                  }>
                }
              }
            }
          }
        }
      }
    }
}

export interface IReserveInfoVariables{
    idCourt: string
}

export const reserveInfoQuery = gql`
query getReserveInfo($idCourt: ID) {
  courtAvailability(id: $idCourt) {
    data {
      attributes {
        minValue
        value
        court {
          data {
            attributes {
              fantasy_name
              name
              rating
              minimumScheduleValue
              establishment {
                data {
                  attributes {
                    amenities {
                      data {
                        attributes {
                          name
                          iconAmenitie {
                            data {
                              attributes {
                                url
                              }
                            }
                          }
                        }
                      }
                    }
                    address {
                      streetName
                      latitude
                      longitude
                      cep
                    }
                  }
                }
              }
              photo {
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
    }
  }
}
`