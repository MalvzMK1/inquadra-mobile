import { gql } from "@apollo/client";

export interface ISchedulingDetailsResponse {
    scheduling: {
        data: {
            id: Scheduling['id']
            attributes: {
                owner: {
                    data: {
                        id: User['id']
                        attributes: {
                            username: User['username']
                        }
                    }
                }
                court_availability: {
                    data: {
                        attributes: {
                            court: {
                                data: {
                                    id: Court['id']
                                    attributes: {
                                        court_type: {
                                            data: {
                                                attributes: {
                                                    name: CourtCardInfos['type']
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                            startsAt: CourtAvailability['startsAt']
                            endsAt: CourtAvailability['endsAt']
                        }
                    }
                }
                payedStatus: Scheduling['payedStatus']
            }
        }
    }
}

export interface ISchedulingDetailsVariables {
    id: string
}

export const schedulingsDetailsQuery = gql`
query getDetailsReserve($id: ID) {
  scheduling(id: $id) {
    data {
      id
      attributes {
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
              court {
                data {
                  id
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
              startsAt
              endsAt
            }
          }
        }
        payedStatus
      }
    }
  }
}
`