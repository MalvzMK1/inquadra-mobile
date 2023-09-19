import { gql } from "@apollo/client";


export interface IUserByIdResponse {
  //photo: (Omit<User, "latitude" | "longitude" | "cep" | "streetName"> & { paymentCardInfos: { dueDate: string; cvv: string; country: { id: string; name: string; }; }; }) | undefined;
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
                        id: Photo['id']
                        attributes: {
                            url: Photo['url'];
                            name: Photo['name'];
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