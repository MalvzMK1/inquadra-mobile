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
                                valuePayed: number
                                date: string
                                users: {
                                  data: [
                                    {
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
                          valuePayed
                          date
                          users{
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
}`