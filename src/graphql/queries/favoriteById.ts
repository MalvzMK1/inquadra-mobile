import { gql } from "@apollo/client";
import { Photo } from "../../types/Photo"
import { Court } from "../../types/Court"
import { Address } from "../../types/Address";
import { Establishment } from "../../types/EstablishmentInfos";
import { CourtCardInfos } from "../../types/Court";

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
                        name: string
                        courts: {
                          data:Array<{
                            id: string
                            attributes: {
                              court_availabilities:{
                                data: Array<{
                                  id: string
                                  attributes: {
                                    schedulings: {
                                      data: Array<{
                                        id: string
                                        attributes: {
                                          date: Date
                                        }
                                      }>
                                    }
                                  }
                                }>
                              }
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