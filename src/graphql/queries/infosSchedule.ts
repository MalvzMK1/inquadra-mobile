import { gql } from "@apollo/client";

export interface IinfoScheduleResponse {
  scheduling: {
    data: {
      attributes: {
        date: string;
        payedStatus: string;
        createdAt: string;
        serviceRate: number;
        valuePayed: number;
        payDay: string;
        activationKey: string;
        activated: boolean;
        status: boolean;
        court_availability: {
          data: {
            attributes: {
              value: number;
              status: boolean;
              startsAt: string;
              endsAt: string;
              court: {
                data: {
                  id: Court["id"];
                  attributes: {
                    fantasy_name: string;
                    name: string;
                    photo: {
                      data: Array<{
                        attributes: {
                          url: string;
                        };
                      }>;
                    };
                    establishment: {
                      data: {
                        id: string;
                      };
                    };
                  };
                };
              };
            };
          };
        };
        user_payments: {
          data: Array<{
            attributes: {
              users_permissions_user: {
                data: {
                  attributes: {
                    name: string;
                    username: string;
                  };
                };
              };
              value: number;
              createdAt: string;
            };
          }>;
        };
        user_payment_pixes: {
          data: Array<{
            attributes: {
              users_permissions_user: {
                data: {
                  attributes: {
                    name: string;
                    username: string;
                  };
                };
              };
              value: number;
              createdAt: string;
            };
          }>;
        };
        owner: {
          data: {
            id: string;
          };
        };
      };
    };
  };
}

export interface IinfoScheduleVariables {
  idScheduling: string;
  idUser: string;
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
          status
          court_availability {
            data {
              attributes {
                status
                value
                startsAt
                endsAt
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
                      establishment {
                        data {
                          id
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
                      name
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
                      name
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
`;
