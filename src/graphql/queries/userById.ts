import { gql } from "@apollo/client";


export interface IUserByIdResponse{
    usersPermissionsUser:{
        data: {
            attributes: {
                id: User['id']
                attributes: {
                    username: User['username']
                    email: User['email']
                    phoneNumber: User['phoneNumber']
                    cpf: User['cpf']
                    paymentCardInformations: PaymentCardInformations
                } & {
                    country: {
                        data: Array<{
                            id: Country['id']
                            attributes: Omit<Country, 'id'>
                        }> & {
                            flag:{
                                data:{
                                    attributes:{
                                        url: Flag['url']
                                    }
                                }
                            }
                        }
                    }
                } & {
                    photo: {
                        data:{
                            attributes: {
                                url: Photo['url']
                            }
                        }
                    }
                }
            }
        }
    }
}

export interface IUserByIdVariables {
  id: string
}

export const userByIdQuery = gql `
query getUserById($id: ID){
    usersPermissionsUser(id: $id){
      data{
        id
        attributes{
          username
          email
          phoneNumber
          cpf
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