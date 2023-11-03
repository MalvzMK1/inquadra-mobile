import {gql} from "@apollo/client";
import {CourtType} from "../../__generated__/graphql";

export interface IAllCourtsEstablishmentResponse{
    establishment: {
        data: {
            attributes: {
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

export interface IAllCourtsEstablishmentVariable{
    establishmentID: string
}

export const allCourtsEstablishmentVariableQuery = gql`
query allCourtsEstablishment($establishmentID: ID) {
  establishment(id: $establishmentID) {
    data {
      attributes {
        courts {
          data {
            attributes {
              fantasy_name
              court_availabilities {
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
                    schedulings {
                      data {
                        id
                        attributes {
                          date
                          payedStatus
                          activated
                          activationKey
                          owner {
                            data {
                              id
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
