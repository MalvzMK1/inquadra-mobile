import { gql } from "@apollo/client";

export interface IinfoScheduleResponse {
  scheduling: {
    data: {
      attributes: {
        date: Scheduling['date']
        payedStatus: string
        createdAt: Date
        serviceRate: number
        valuePayed: number
        payDay: Date
        activationKey: string
        court_availability: {
          data: {
            attributes: {
              value: number
              court: {
                data: {
                  id: Court['id']
                  attributes: {
                    fantasy_name: string
                    name: string
                    photo: {
                      data: Array<{
                        attributes: {
                          url: string
                        }
                      }>
                    }
                  }
                }
              }
            }
          }
        }
        user_payments: {
          data: Array<{
            attributes: {
              users_permissions_user: {
                data: {
                  attributes: {
                    username: string
                  }
                }
              }
              value: number
              createdAt: Date
            }
          }>
        }
        owner: {
          data: {
            id: string
          }
        }
      }
    }
  }
}

export interface IinfoScheduleVariables {
  idScheduling: string
  idUser: string
}

export const infoSchedule = gql`
query infoSchedule($idScheduling: ID, $idUser: ID) {
  scheduling(id: $idScheduling) {
    data {
      attributes {
        date
        payedStatus
        createdAt
        serviceRate
        valuePayed
        payDay
        activationKey
        court_availability {
          data {
            attributes {
              value
              court {
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
                  }
                }
              }
            }
          }
        }
        user_payments(
          filters: { users_permissions_user: { id: { eq: $idUser } } }
        ) {
          data {
            attributes {
              users_permissions_user {
                data {
                  attributes {
                    username
                  }
                }
              }
              value
              createdAt
            }
          }
        }
        owner {
          data {
            id
          }
        }
      }
    }
  }
}

`