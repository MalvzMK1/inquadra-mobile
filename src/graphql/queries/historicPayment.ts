import { gql } from "@apollo/client";

export interface IHistoricPayment {

  establishment: {
    data: {
      id: string,
      attributes: {
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
                                date: string,
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
  establishment(id: $ID){
    data{
      id
      attributes{
        corporateName
      	courts{
          data{
            attributes{
              name
              photo{
                data{
                  attributes{
                    url
                  }
                }
              }
              court_availabilities{
                data{
									attributes{
                    startsAt
                    endsAt
                    schedulings{
                      data{
                        attributes{
                          date
                          valuePayed
                          user_payments{
                            data{
                              attributes{
                                value
                                users_permissions_user{
                                  data{
                                    attributes{
                                      username
                                      photo{
                                        data{
																					attributes{
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
          }
        }
      }
    } 
  }
}`