import { gql } from "@apollo/client";

export interface IinfoScheduleResponse{
    scheduling: {
        data: {
            attributes: {
                createdAt: Date
                valuePayed: number
                payDay: Date
                court_availability: {
                    data: {
                        attributes: {
                            value: number
                            court: {
                                data: {
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
                user_payments : {
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
                owner:{
                  data: {
                    id: string
                  }
                }
            }
        }
    }
}

export interface IinfoScheduleVariables{
    idScheduling: string
    idUser: string
}

export const infoSchedule = gql`
query infoSchedule($idScheduling: ID, $idUser: ID) {
  scheduling(id: $idScheduling) {
    data {
      attributes {
        createdAt
        valuePayed
        payDay
        court_availability {
          data {
            attributes {
              value
              court {
                data {
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
        user_payments(filters: { id: { eq: $idUser } }) {
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