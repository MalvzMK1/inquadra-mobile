import { gql } from "@apollo/client";

export interface IgetHistoricOfReserveOnResponse {
  usersPermissionsUser: {
    data: {
      attributes: {
        schedulings: {
          data: Array<{
            id: string
            attributes: {
              serviceRate: Number
              status: boolean
              createdAt: Date
              valuePayed: Number
              payedStatus: string
              court_availability: {
                data: {
                  attributes: {
                    value: Number
                    court: {
                      data: {
                        id: string
                        attributes: {
                          name: string
                          fantasy_name: string
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
            }
          }>
        }
      }
    }
  }
}

export interface IHistoricReserveOnVariables {
  id: string
}

export const historicReserveOnQuery = gql`
query getHistoricOfReserveOn($id: ID) {
  usersPermissionsUser(id: $id) {
    data {
      attributes {
        schedulings {
          data {
            id
            attributes {
              serviceRate
              status
              createdAt
              valuePayed
              payedStatus
              court_availability {
                data {
                  attributes {
                    value
                    court {
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