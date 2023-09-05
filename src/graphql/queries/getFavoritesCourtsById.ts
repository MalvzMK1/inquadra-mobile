import { gql } from "@apollo/client";
import { CourtType } from "../../__generated__/graphql";

export interface IFavoritesCourtsByIdResponse {
    courtTypes: {
        data: Array<{
            attributes:{
                name: CourtType['name']
                courts: {
                    data: Array<{
                        id: Court['id']
                        attributes: {
                            fantasy_name: Court['fantasy_name']
                            name: Court['name']
                            photo: {
                                data: Array<{
                                    attributes: {
                                        url: Photo['url']
                                    }
                                }>
                            }
                            establishment: {
                                data: {
                                    attributes: {
                                        address: {
                                            latitude: Address['latitude']
                                            longitude: Address['longitude']
                                        }
                                    }
                                }
                            }
                            court_availabilities: {
                                data: Array<{
                                    attributes: {
                                        schedulings: {
                                            data: Array<{
                                                attributes: {
                                                    date: Scheduling['date']
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

export const favoriteCourtByIdQuery = gql`
query getFavoriteById($id: ID) {
  courtTypes(filters: { courts: { favorited_user: { id: { eq: $id } } } }) {
    data {
      attributes {
        name
        courts(filters: { favorited_user: { id: { eq: $id } } }) {
          data {
            id
            attributes {
              fantasy_name
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
                  attributes {
                    address {
                      latitude
                      longitude
                    }
                  }
                }
              }
              court_availabilities(filters: {schedulings: {users: {id: {eq : $id}}}}) {
                data {
                  attributes {
                    schedulings(filters: { users: { id: { eq: $id } } }) {
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
`