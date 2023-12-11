import { gql } from "@apollo/client";
import { CourtType } from "../../__generated__/graphql";

export interface IEstablishmentAllSchedulesResponse {
  establishment: {
    data?: {
      attributes: {
        courts: {
          data: Array<{
            id: Court["id"];
            attributes: {
              name: Court["name"];
              photo: {
                data: Array<{
                  attributes: {
                    url: string;
                  };
                }>;
              };
              court_types: {
                data: Array<{
                  attributes: {
                    name: CourtType["name"];
                  };
                }>;
              };
              court_availabilities: {
                data: Array<{
                  attributes: {
                    startsAt: string;
                    endsAt: string;
                    status: boolean;
                    weekDay: string;
                    schedulings: {
                      data: Array<{
                        id: string;
                        attributes: {
                          date: string;
                          status: boolean;
                          owner: {
                            data: {
                              attributes: {
                                name: User["name"];
                                username: User["username"];
                              };
                            };
                          };
                          payedStatus: Scheduling["payedStatus"];
                        };
                      }>;
                    };
                  };
                }>;
              };
            };
          }>;
        };
      };
    };
  };
}

export interface IEstablishmentAllSchedulesVariables {
  id: string;
}

export const allEstablishmentSchedulesQuery = gql`
  query getAllEstablishmentSchedules($id: ID) {
    establishment(id: $id) {
      data {
        attributes {
          courts {
            data {
              id
              attributes {
                name
                photo {
                  data {
                    attributes {
                      url
                    }
                  }
                }
                court_types {
                  data {
                    attributes {
                      name
                    }
                  }
                }
                court_availabilities {
                  data {
                    attributes {
                      startsAt
                      endsAt
                      status
                      weekDay
                      schedulings {
                        data {
                          id
                          attributes {
                            date
                            status
                            owner {
                              data {
                                attributes {
                                  name
                                  username
                                }
                              }
                            }
                            payedStatus
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
