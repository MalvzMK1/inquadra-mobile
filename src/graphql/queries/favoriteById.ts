import { gql } from "@apollo/client";

export interface IFavoriteByIdResponse {
    usersPermissionsUser: {
        data: {
            attributes: {
                favorite_courts: {
                    data: {
                        attributes: {
                            court_type: {
                                data: {
                                    attributes: {
                                        name: CourtCardInfos['type']
                                        courts: {
                                            data: {
                                                id: Court['id']
                                                attributes: {
                                                    photo: {
                                                        data: {
                                                            attributes: {
                                                                url: Photo['url']
                                                            }
                                                        }
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