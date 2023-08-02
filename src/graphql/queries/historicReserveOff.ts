import { gql } from "@apollo/client";

export interface IHistoricReserveOffResponse{
    usersPermissionsUser: {
        data: {
            attributes: {
                schedulings_owner: {
                    data: Array<{
                        attributes: {
                            createdAt: Date
                            status: boolean
                            valuePayed: number
                            court_availability:{
                                data:{
                                    attributes: {
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

export interface IHistoricReserveOffVariables{
    id: string
}

export const historicReserveOff = gql`
query getHistoricOfReserveOFF($id: ID) {
  usersPermissionsUser(id: $id) {
    data {
      attributes {
        schedulings_owner(filters: { status: { eq: false } }) {
          data {
            attributes {
              createdAt
              status
              valuePayed
              court_availability {
                data {
                  attributes {
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
