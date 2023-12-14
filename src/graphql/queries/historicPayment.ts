import { gql } from "@apollo/client";

export interface IHistoricPayment {
  establishment: {
    data: {
      id: string;
      attributes: {
        logo: {
          data: [
            {
              attributes: {
                url: string;
              };
            },
          ];
        };
        pix_keys: {
          data: [
            {
              id: string;
              attributes: {
                key: string;
              };
            },
          ];
        };
        courts: {
          data: [
            {
              attributes: {
                name: string;
                photo: {
                  data: [
                    {
                      attributes: {
                        url: string;
                      };
                    },
                  ];
                };
                court_availabilities: {
                  data: [
                    {
                      attributes: {
                        startsAt: string;
                        endsAt: string;
                        schedulings: {
                          data: [
                            {
                              attributes: {
                                activated: boolean;
                                date: string;
                                valuePayed: number;
                                user_payments: {
                                  data: [
                                    {
                                      attributes: {
                                        payedStatus: string;
                                        createdAt: string;
                                        value: number;
                                        users_permissions_user: {
                                          data: {
                                            attributes: {
                                              name: string;
                                              username: string;
                                              photo: {
                                                data: {
                                                  attributes: {
                                                    url: string;
                                                  };
                                                };
                                              };
                                            };
                                          };
                                        };
                                      };
                                    },
                                  ];
                                };
                                user_payment_pixes: {
                                  data: [
                                    {
                                      id: number;
                                      attributes: {
                                        createdAt: string;
                                        value: number;
                                        PayedStatus: string;
                                        users_permissions_user: {
                                          data: {
                                            attributes: {
                                              name: string;
                                              username: string;
                                              photo: {
                                                data: {
                                                  attributes: {
                                                    url: string;
                                                  };
                                                };
                                              };
                                            };
                                          };
                                        };
                                        paymentId: string;
                                      };
                                    },
                                  ];
                                };
                              };
                            },
                          ];
                        };
                      };
                    },
                  ];
                };
              };
            },
          ];
        };
      };
    };
  };
}

export interface VariableHistoricPayment {
  ID: string;
}

export const historicPaymentonQuery = gql`
  query getHistoryPayment($ID: ID!) {
    establishment(id: $ID) {
      data {
        id
        attributes {
          corporateName
          logo {
            data {
              attributes {
                url
              }
            }
          }
          pix_keys(pagination: { limit: -1 }) {
            data {
              id
              attributes {
                key
              }
            }
          }
          courts(pagination: { limit: -1 }) {
            data {
              attributes {
                name
                photo {
                  data {
                    attributes {
                      url
                    }
                  }
                }
                court_availabilities(pagination: { limit: -1 }) {
                  data {
                    attributes {
                      startsAt
                      endsAt
                      schedulings(
                        pagination: { limit: -1 }
                        filters: { activated: { eq: true } }
                      ) {
                        data {
                          attributes {
                            activated
                            date
                            valuePayed
                            user_payment_pixes {
                              data {
                                attributes {
                                  name
                                  value
                                  users_permissions_user {
                                    data {
                                      attributes {
                                        name
                                        username
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
                            user_payments(pagination: { limit: -1 }) {
                              data {
                                attributes {
                                  payedStatus
                                  createdAt
                                  value
                                  users_permissions_user {
                                    data {
                                      attributes {
                                        name
                                        username
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
                            user_payment_pixes_data: user_payment_pixes(
                              pagination: { limit: -1 }
                            ) {
                              data {
                                id
                                attributes {
                                  createdAt
                                  value
                                  PayedStatus
                                  paymentId
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
