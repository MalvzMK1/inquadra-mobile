import { gql } from "@apollo/client";

export interface IgetHistoricOfReserveOnResponse {
  usersPermissionsUser: {
    data: {
      attributes: {
        schedulings: {
          data: Array<{
            id: string;
            attributes: {
              date: string;
              activated: boolean;
              serviceRate: number;
              status: boolean;
              createdAt: Date;
              valuePayed: number;
              payedStatus: string;
              court_availability: {
                data: {
                  attributes: {
                    value: number;
                    startsAt: string;
                    court: {
                      data: {
                        id: string;
                        attributes: {
                          name: string;
                          fantasy_name: string;
                          photo: {
                            data: Array<{
                              attributes: {
                                url: string;
                              };
                            }>;
                          };
                        };
                      };
                    };
                  };
                };
              };
            };
          }>;
        };
      };
    };
  };
}

export interface IHistoricReserveOnVariables {
  id: string;
}

export const historicReserveOnQuery = gql`
  query getHistoricOfReserveOn($id: ID) {
    usersPermissionsUser(id: $id) {
      data {
        attributes {
          schedulings(pagination: { limit: -1 }) {
            data {
              id
              attributes {
                date
                activated
                serviceRate
                status
                createdAt
                valuePayed
                payedStatus
                court_availability {
                  data {
                    attributes {
                      value
                      startsAt
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
`;
