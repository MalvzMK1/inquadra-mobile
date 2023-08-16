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
        favorite_courts: {
          data: [
            {
              id: Court["id"]
            }
          ]
        }
        paymentCardInformations: {
          cvv: PaymentCardInformations['cvv']
          dueDate: string
          country: {
            data: {
              attributes: {
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
      };
    };
  };
}

export interface IUserByIdVariables {
  id: string
}

export const userByIdQuery = gql`
query getUserById($id: ID){
    usersPermissionsUser(id: $id){
      data{
        id
        attributes{
          username
          email
          phoneNumber
          cpf
          favorite_courts {
            data {
              id
            }
          }
          paymentCardInformations{
            id
            cvv
            dueDate
            country{
              data{
                attributes{
                  flag{
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
` 