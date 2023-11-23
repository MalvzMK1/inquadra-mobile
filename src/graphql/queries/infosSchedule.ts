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
        activated: boolean
        court_availability: {
          data: {
            attributes: {
              value: number
              status: boolean
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
        user_payment_pixes: {
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
              createdAt: string
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
          activated
          court_availability {
            data {
              attributes {
                status
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
            filters: {
              users_permissions_user: { id: { eq: $idUser } }
              payedStatus: { eq: "Payed" }
            }
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
          user_payment_pixes(
            filters: {
              users_permissions_user: { id: { eq: $idUser } }
              PayedStatus: { eq: "Payed" }
            }
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