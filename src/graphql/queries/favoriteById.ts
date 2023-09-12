import { gql } from "@apollo/client";


export interface IFavoriteByIdResponse {
    usersPermissionsUser: {
        data: {
          attributes: {
            favorite_courts: {
              data: Array<{
                attributes: {
                  court_types: {
                    data: Array<{
                      attributes: {
                        name: string
                        courts: {
                          data:Array<{
                            id: string
                            attributes: {
                              name: string
                              fantasy_name: string
                              photo: {
                                data: Array<{
                                  attributes: {
                                    url: string
                                  }
                                }>
                              }
                              establishment: {
                                data: {
                                  id: string
                                  attributes: {
                                    address: {
                                      latitude: string
                                      longitude: string
                                      cep: string
                                    }
                                  }
                                }
                              }
                              court_availabilities:{
                                data: Array<{
                                  attributes: {
                                    schedulings: {
                                      data: Array<{
                                        attributes: {
                                          date: Date
                                        }
                                      }>
                                    }
                                  }
                                }>
                              }
                            }
                          }>
                        }
                      }
                    }>
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
    userId: string
}

export const favoriteByIdQuery = gql`
  query getFavoriteById($id: ID) {
  usersPermissionsUser(id: $id) {
    data {
      attributes {
        favorite_courts {
          data {
            attributes {
              court_types {
                data {
                  attributes {
                    name
                    courts {
                      data {
                        id
                        attributes {
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
                                  cep
                                }
                              }
                            }
                          }
                          court_availabilities {
                            data {
                              attributes {
                                schedulings(
                                  filters: { owner: { id: { eq: $id } } }
                                ) {
                                  data {
                                    attributes {
                                      date
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
  }
}
`