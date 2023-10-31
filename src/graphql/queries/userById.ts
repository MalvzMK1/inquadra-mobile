import { gql } from "@apollo/client";


export interface IUserByIdResponse {
    usersPermissionsUser: {
        data?: {
            id: User['id'];
            attributes: {
                username: User['username'];
                birthDate: User['birthDate']
                email: User['email'];
                phoneNumber: User['phoneNumber'];
                cpf: User['cpf'];
                favorite_establishments: {
                    data: Array<{
                        id: Establishment['id']
                    }>
                }
                favorite_courts: {
                    data: Array<{
                        id: Court['id']
                    }>

                }
                role: {
                    data: {
                        id: string
                    }
                }
                paymentCardInformations: {
                    id: PaymentCardInformations['id']
                    cvv?: PaymentCardInformations['cvv']
                    dueDate?: string
                };
                photo: {
                    data?: {
                        id: Photo['id']
                        attributes: {
                            url: Photo['url'];
                            name: Photo['name'];
                        };
                    };
                };
                address?: {
                    cep: string;
                    streetName: string;
                };
            };
        };
    };
}

export interface IUserByIdVariables {
    id: string
}

export const userByIdQuery = gql`
query getUserById($id: ID) {
  usersPermissionsUser(id: $id) {
    data {
      id
      attributes {
        username
        birthDate
        email
        phoneNumber
        cpf
        favorite_establishments {
          data {
            id
          }
        }
        favorite_courts {
          data {
            id
          }
        }
        role {
          data {
            id
          }
        }
        paymentCardInformations {
          id
          cvv
          dueDate
        }
        photo {
          data {
            id
            attributes {
              url
              name
              alternativeText
              caption
              width
              height
              formats
              hash
              ext
              mime
              size
              createdAt
              updatedAt
            }
          }
        }
        address {
          cep
          streetName
        }
      }
    }
  }
}
` 