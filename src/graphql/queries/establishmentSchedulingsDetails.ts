import { gql } from "@apollo/client";
import { CourtType } from "../../__generated__/graphql";

export interface IEstablishmentSchedulingsDetailsResponse{
    establishment:{
        data: {
            id: Establishment['id']
            attributes:{
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
                                                attributes: {
                                                    payedStatus: Scheduling['payedStatus']
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
                                                                court: {
                                                                    data: {
                                                                        attributes: {
                                                                            court_type: {
                                                                                data: {
                                                                                    attributes: {
                                                                                        name: CourtType['name']
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

export interface IEstablishmentSchedulingsDetailsVariables{
    establishmentID: string
    fantasy_name: string
    dayWeek: string
    date: string
}

export const establishmentSchedulingsDetails = gql`
query getEstablishmentSchedulings(
  $fantasyName: String
  $establishmentID: ID
  $dayWeek: String
  $date: Date
) {
  establishment(id: $establishmentID) {
    data {
      id
      attributes {
        courts(filters: { fantasy_name: { eq: $fantasyName } }) {
          data {
            attributes {
              fantasy_name
              court_availabilities(
                filters: { status: { eq: true }, weekDay: { eq: $dayWeek } }
              ) {
                data {
                  id
                  attributes {
                    startsAt
                    endsAt
                    court {
                      data {
                        id
                        attributes {
                          name
                        }
                      }
                    }
                    schedulings(filters: { date: { eq: $date } }) {
                      data {
                        attributes {
                          payedStatus
                          owner {
                            data {
                              attributes {
                                username
                              }
                            }
                          }
                          court_availability {
                            data {
                              attributes {
                                startsAt
                                endsAt
                                court {
                                  data {
                                    attributes {
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