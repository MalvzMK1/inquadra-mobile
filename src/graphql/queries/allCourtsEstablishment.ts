import {gql} from "@apollo/client";

export interface IAllCourtsEstablishmentResponse{
    establishment: {
        data: {
            attributes: {
                courts: {
                    data: Array<{
                        attributes: {
                            fantasy_name: Court['fantasy_name']
                        }
                    }>
                }
            }
        }
    }
}

export interface IAllCourtsEstablishmentVariable{
    establishmentID: string
}

export const allCourtsEstablishmentVariableQuery = gql`
query allCourtsEstablishment($establishmentID: ID) {
  establishment(id: $establishmentID) {
    data {
      attributes {
        courts {
          data {
            attributes {
              fantasy_name
            }
          }
        }
      }
    }
  }
}
`