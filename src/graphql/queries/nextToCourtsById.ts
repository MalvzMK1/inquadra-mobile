import { gql } from "@apollo/client";
import { WeekDay } from "../../types/WeekDay";

export interface ICourtByIdResponse {
  court: {
    data: {
      id: Court["id"];
      attributes: {
        court_types: {
          data: Array<{
            id: SportType["id"];
            attributes: {
              name: SportType["name"];
            };
          }>;
        };
        name: Court["name"];
        fantasy_name: Court["fantasy_name"];
        court_availabilities: {
          data: Array<{
            id: string;
            attributes: {
              weekDay: WeekDay;
              startsAt: string;
              endsAt: string;
              value: number;
              dayUseService: boolean;
            };
          }>;
        };
        photo: {
          data: Array<{
            id: Photo["id"];
            attributes: {
              url: Photo["url"];
            };
          }>;
        };
        minimumScheduleValue: CourtAdd["minimum_value"];
        establishment: {
          data: {
            id: Establishment["id"];
            attributes: {
              corporateName: Establishment["corporateName"];
              address: {
                latitude: Address["latitude"];
                longitude: Address["longitude"];
              };
            };
          };
        };
      };
    };
  };
}

export interface ICourtByIdVariables {
  id: string;
}

export const courtByIdQuery = gql`
  query courtById($id: ID) {
    court(id: $id) {
      data {
        id
        attributes {
          court_types {
            data {
              id
              attributes {
                name
              }
            }
          }
          name
          fantasy_name
          court_availabilities {
            data {
              id
              attributes {
                weekDay
                startsAt
                endsAt
                value
                dayUseService
              }
            }
          }
          photo {
            data {
              id
              attributes {
                url
              }
            }
          }
          minimumScheduleValue
          establishment {
            data {
              id
              attributes {
                corporateName
                address {
                  latitude
                  longitude
                }
              }
            }
          }
        }
      }
    }
  }
`;
