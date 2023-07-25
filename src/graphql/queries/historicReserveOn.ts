import { gql } from "@apollo/client";

export interface IgetHistoricOfReserveOnResponse{
    userPermissionsUser: {
        data: {
            attributes: {
                schedulings_owner: {
                    data: Array<{
                        attributes: {
                            createdAt: string
                            valuePayed: Number
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

export interface IHistoricReserveOnVariables{
    id: string
}

export const historicReserveOnQuery = gql`
query getHistoricOfReserveOn($id: ID) {
  usersPermissionsUser(id: $id) {
    data {
      attributes {
        schedulings_owner(filters: { status: { eq: true } }) {
          data {
            attributes {
              createdAt
              valuePayed
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