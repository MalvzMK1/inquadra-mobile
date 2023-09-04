import { gql } from "@apollo/client";

export interface ISchedulingDetailsResponse {
    scheduling: {
        data?: {
            id: Scheduling['id']
            attributes: {
                owner: {
                    data?: {
                        id: User['id']
                        attributes: {
                            username: User['username']
                        }
                    }
                }
                court_availability: {
                    data?: {
                        attributes: {
                            value: number
                            court: {
                                data?: {
                                    id: Court['id']
                                    attributes: {
                                        court_types: {
                                            data?: Array<{
                                                attributes: {
                                                    name: CourtCardInfos['type']
                                                }
                                            }>
                                        }
                                    }
                                }
                            }
                            startsAt: string
                            endsAt: string
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
                value
                court {
                  data {
                    id
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
                startsAt
                endsAt
              }
            }
          }
          payedStatus
        }
      }
    }
  }`