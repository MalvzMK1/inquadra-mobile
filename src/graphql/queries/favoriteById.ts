import { gql } from "@apollo/client";

export interface IFavoriteByIdResponse {
    usersPermissionsUser: {
        data: {
            attributes: {
                favorite_courts: {
                    data: Array<{
                        attributes: {
                            court_type: {
                                data: {
                                    attributes: {
                                        name: CourtCardInfos['type']
                                        courts: {
                                            data: Array<{
                                                id: Court['id']
                                                attributes: {
                                                    court_availabilities: {
                                                      data : Array<{
                                                        id: number
                                                        attributes: {
                                                          schedulings: {
                                                            data: Array<{
                                                              id: number
                                                              attributes: {
                                                                date: Date
                                                              }
                                                            }>
                                                          }
                                                        }
                                                      }>
                                                    }
                                                    name: Court['name']
                                                    fantasy_name: Court['fantasy_name']
                                                    photo: {
                                                        data: Array<{
                                                            attributes: {
                                                                url: Photo['url']
                                                            }
                                                        }>
                                                    }
                                                    establishment: {
                                                        data: {
                                                            id: Establishment['id']
                                                            attributes: {
                                                                address: {
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
                                }
                            }
                        }
                    }>
                }
            }
        }
    }
}

export interface IFavoriteByIdVariables {
    id: string
}

export const favoriteByIdQuery = gql`
query getFavoriteById($id: ID) {
  usersPermissionsUser(id: $id) {
    data {
      attributes {
        favorite_courts {
          data {
            attributes {
              court_type {
                data {
                  attributes {
                    name
                    courts {
                      data {
                        id
                        attributes {
                          court_availabilities {
                            data {
                              id
                              attributes {
                                schedulings {
                                  data {
                                    id
                                    attributes {
                                      date
                                    }
                                  }
                                }
                              }
                            }
                          }
                          name
                          fantasy_name
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