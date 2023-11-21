import { gql } from "@apollo/client";

export interface IHistoricPayment {

  establishment: {
    data: {
      id: string,
      attributes: {
        logo: {
          data: [
            {
              attributes: {
                url: string
              }
            }
          ]
        },
        pix_keys: {
          data: [
            {
              id: string,
              attributes: {
                key: string
              }
            }
          ]
        },
        courts: {
          data: [
            {
              attributes: {
                name: string,
                photo: {
                  data: [
                    {
                      attributes: {
                        url: string
                      }
                    }
                  ]
                },
                court_availabilities: {
                  data: [
                    {
                      attributes: {
                        startsAt: string
                        endsAt: string
                        schedulings: {
                          data: [
                            {
                              attributes: {
                                activated: boolean
                                date: string
                                valuePayed: number
                                user_payments: {
                                  data: [{
                                    attributes: {
                                      value: number
                                      users_permissions_user: {
                                        data: {
                                          attributes: {
                                            username: string
                                            photo: {
                                              data: {
                                                attributes: {
                                                  url: string
                                                }
                                              }
                                            }
                                          }
                                        }
                                      }
                                    }
                                  }]
                                }
                                user_payment_pixes: {
                                  data: [{
                                    attributes: {
                                      value: number
                                      users_permissions_user: {
                                        data: {
                                          attributes: {
                                            username: string
                                            photo: {
                                              data: {
                                                attributes: {
                                                  url: string
                                                }
                                              }
                                            }
                                          }
                                        }
                                      }
                                    }
                                  }]
                                }
                              }
                            }
                          ]
                        }
                      }
                    }
                  ]
                }
              }
            }
          ]
        }
      }
    }
  }
}

export interface VariableHistoricPayment {
  ID: string
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
        pix_keys {
          data {
            id
            attributes {
              key
            }
          }
        }
        courts {
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
              court_availabilities {
                data {
                  attributes {
                    startsAt
                    endsAt
                    schedulings {
                      data {
                        attributes {
                          activated
                          date
                          valuePayed
                          user_payment_pixes{
                            data{
                              attributes{
                                name
                                value
                                users_permissions_user{
                                  data {
                                    attributes {
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
                          user_payments {
                            data {
                              attributes {
                                value
                                users_permissions_user {
                                  data {
                                    attributes {
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
                          user_payment_pixes {
                            data {
                              id
                              attributes {
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
`