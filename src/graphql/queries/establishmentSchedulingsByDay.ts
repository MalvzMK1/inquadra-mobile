import { gql } from "@apollo/client";
import { CourtType } from "../../__generated__/graphql";

export interface IEstablishmentSchedulingsByDayResponse {
  establishment: {
    data: {
      id: Establishment['id']
      attributes: {
        fantasyName: Establishment['fantasyName'] | null
        corporateName: Establishment['corporateName']
        logo: {
          data: {
            attributes: {
              url: Establishment['logo']
            }
          }
        }
        courts: {
          data: Array<{
            attributes: {
              fantasy_name: Court['fantasy_name']
              court_availabilities: {
                data: Array<{
                  id: CourtAvailability['id']
                  attributes: {
                    startsAt: CourtAvailability['startsAt']
                    endsAt: CourtAvailability['endsAt']
                    court: {
                      data: {
                        id: Court['id']
                        attributes: {
                          name: Court['name']
                        }
                      }
                    }
                    schedulings: {
                      data: Array<{
                        id: string
                        attributes: {
                          date: Scheduling['date']
                          payedStatus: Scheduling['payedStatus']
                          activated: boolean
                          activationKey: string
                          owner: {
                            data: {
                              attributes: {
                                username: User['username']
                              }
                            }
                          }
                          court_availability: {
                            data: {
                              attributes: {
                                startsAt: CourtAvailability['startsAt']
                                endsAt: CourtAvailability['endsAt']
                                dayUseService: CourtAvailability['dayUseService']
                                court: {
                                  data: {
                                    attributes: {
                                      court_types: {
                                        data: Array<{
                                          attributes: {
                                            name: CourtType['name']
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

export interface IEstablishmentSchedulingsByDayVariables {
  establishmentID: string
  fantasyName: string
  dayWeek: string
  date: string
}

export const establishmentSchedulingsByDayQuery = gql`
query getFavoritesCourtsById($id: ID) {
  usersPermissionsUser(id: $id) {
    data {
      attributes {
        favorite_courts {
          data {
            id
            attributes {
              court_types(
                filters: { courts: { favorited_user: { id: { eq: $id } } } }
              ) {
                data {
                  attributes {
                    name
                    courts(filters: { favorited_user: { id: { eq: $id } } }) {
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
                                }
                              }
                            }
                          }
                          court_availabilities {
                                dayUseService
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