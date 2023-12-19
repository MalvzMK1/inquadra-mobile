import { gql } from "@apollo/client";
import { CourtType } from "../../__generated__/graphql";

export interface CourtAvailabilitiesByWeekDayResponse {
  courtAvailabilities: {
    data: Array<{
      id: CourtAvailability["id"];
      attributes: {
        startsAt: CourtAvailability["startsAt"];
        endsAt: CourtAvailability["endsAt"];
        court: {
          data: {
            attributes: {
              court_types: {
                data: Array<{
                  attributes: {
                    name: CourtType["name"];
                    photo: {
                      data?: {
                        attributes: {
                          url: string;
                        }
                      }
                    }
                  };
                }>;
              };
            };
          };
        };
        schedulings: {
          data: Array<{
            attributes: {
              payedStatus: Scheduling["payedStatus"];
              owner: {
                data: {
                  attributes: {
                    name: User["name"];
                  };
                };
              };
            };
          }>;
        };
      };
    }>;
  };
}

export interface CourtAvailabilitiesByWeekDayVariables {
  establishmentId: string;
  courtFantasyName: string;
  weekDay: string;
  date: string;
}

export const courtAvailabilitiesByWeekDayQuery = gql`
  query CourtAvailabilitiesByWeekDay(
    $courtFantasyName: String!
    $establishmentId: ID!
    $weekDay: String!
    $date: Date
  ) {
    courtAvailabilities(
      filters: {
        weekDay: { eq: $weekDay }
        schedulings: { date: { eq: $date } }
        court: {
          fantasy_name: { eq: $courtFantasyName }
          establishment: { id: { eq: $establishmentId } }
        }
      }
    ) {
      data {
        id
        attributes {
          startsAt
          endsAt
          court {
            data {
              attributes {
                court_types {
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
                    }
                  }
                }
              }
            }
          }
          schedulings(filters: { date: { eq: $date } }) {
            data {
              attributes {
                payedStatus
                owner {
                  data {
                    attributes {
                      name
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
