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
        fantasyName
        corporateName
        logo {
          data {
            attributes {
              url
            }
          }
        }
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
                        id
                        attributes {
                          date
                          payedStatus
                          activated
                          activationKey
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
                                dayUseService
                                court {
                                  data {
                                    attributes {
                                      court_types {
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