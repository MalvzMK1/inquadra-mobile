import { gql } from "@apollo/client";

export interface IUserByEstablishmentResponse {
    establishment: {
        data: {
            attributes: {
                logo: {
                    data: {
                        attributes: {
                            url: Establishment['logo']
                        }
                    }
                }
                owner: {
                    data: {
                        id: User['id']
                    }
                }
            }
        }
    }
}

export const userByEstablishmentQuery = gql`
query getUserByEstablishmentID($establishmentID: ID) {
  establishment(id: $establishmentID) {
    data {
      attributes {
        owner {
          data {
            id
          }
        }
      }
    }
  }
}

`