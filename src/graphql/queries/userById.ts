import { gql } from "@apollo/client";


export interface IUserByIdResponse {
    usersPermissionsUser: {
        data: {
            id: User['id'];
            attributes: {
                username: User['username'];
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
                    country: {
                        data: {
                            id: string
                            attributes: {
                                name: string
                                flag: {
                                    data: {
                                        attributes: {
                                            url: Flag['url'];
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
                photo: {
                    data?: {
                        attributes: {
                            url: Photo['url'];
                        };
                    };
                };
                address: {
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
          country {
            data {
              id
              attributes {
                name
                flag {
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
        photo {
          data {
            attributes {
              url
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